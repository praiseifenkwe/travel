"""
rag_service.py
──────────────
Handles:
  1. Document ingestion  → parse → chunk → embed (local all-MiniLM-L6-v2) → upsert to ChromaDB
  2. Query retrieval     → query text → similarity search → return formatted context string

Powered by ChromaDB's local DefaultEmbeddingFunction (all-MiniLM-L6-v2 via ONNX).
100% offline, zero API quota dependencies, sub-millisecond search speed.
"""

import os
import uuid
from typing import List, Dict, Any, Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings
from chromadb.utils import embedding_functions

from app.core.config import settings

# ── ChromaDB singleton ────────────────────────────────────────────────────────

_chroma_client: Optional[chromadb.PersistentClient] = None
_collection = None


def get_chroma_client() -> chromadb.PersistentClient:
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_PATH,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _chroma_client


def get_collection():
    global _collection
    if _collection is None:
        client = get_chroma_client()
        # Local all-MiniLM-L6-v2 via ONNX — zero external API calls
        local_ef = embedding_functions.DefaultEmbeddingFunction()
        _collection = client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=local_ef,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


# ── Text chunking ─────────────────────────────────────────────────────────────

def _chunk_text(text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
    """Sliding-window chunker by word count."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return [c for c in chunks if c.strip()]


# ── Document parsers ──────────────────────────────────────────────────────────

def _parse_pdf(file_path: str) -> str:
    try:
        import PyPDF2
        text = []
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text.append(page.extract_text() or "")
        return "\n".join(text)
    except ImportError:
        raise RuntimeError("PyPDF2 not installed. Run: pip install PyPDF2")


def _parse_docx(file_path: str) -> str:
    try:
        from docx import Document
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except ImportError:
        raise RuntimeError("python-docx not installed. Run: pip install python-docx")


def _parse_txt_or_md(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def _parse_file(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()
    if ext == ".pdf":
        return _parse_pdf(file_path)
    elif ext in (".docx", ".doc"):
        return _parse_docx(file_path)
    elif ext in (".txt", ".md"):
        return _parse_txt_or_md(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


# ── Public API ────────────────────────────────────────────────────────────────

async def ingest_document(
    file_path: str,
    source_name: str,
    doc_type: str = "policy",
    business_id: str = "default",
    metadata_extra: Dict[str, Any] = {},
) -> Dict[str, Any]:
    """
    Parse → chunk → upsert one document directly to ChromaDB.
    Chroma's local embedding function computes all-MiniLM-L6-v2 vectors automatically.

    Returns: { document_id, chunks_created, source_name }
    """
    doc_id = str(uuid.uuid4())
    raw_text = _parse_file(file_path)
    chunks = _chunk_text(raw_text)

    if not chunks:
        return {"document_id": doc_id, "chunks_created": 0, "source_name": source_name}

    collection = get_collection()
    collection.upsert(
        ids=[f"{doc_id}_{i}" for i in range(len(chunks))],
        documents=chunks,
        metadatas=[
            {
                "document_id": doc_id,
                "source_name": source_name,
                "doc_type": doc_type,
                "business_id": business_id,
                "chunk_index": i,
                **metadata_extra,
            }
            for i in range(len(chunks))
        ],
    )

    return {
        "document_id": doc_id,
        "chunks_created": len(chunks),
        "source_name": source_name,
    }


async def retrieve_context(
    query: str,
    n_results: int = None,
    filter_metadata: Optional[Dict[str, str]] = None,
) -> str:
    """
    Direct query_texts search → similarity lookup → return formatted context string.
    Chroma embeds the query text automatically using local all-MiniLM-L6-v2.
    """
    result = await retrieve_context_with_scores(query, n_results, filter_metadata)
    return result["context"]


async def retrieve_context_with_scores(
    query: str,
    n_results: int = None,
    filter_metadata: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """Retrieve formatted context together with Chroma cosine distances."""
    n_results = n_results or settings.RAG_TOP_K
    collection = get_collection()

    if collection.count() == 0:
        return {"context": "", "distances": [], "sources": []}

    results = collection.query(
        query_texts=[query],
        n_results=min(n_results, collection.count()),
        where=filter_metadata or None,
        include=["documents", "metadatas", "distances"],
    )

    chunks = results["documents"][0] or []
    metas = results["metadatas"][0] or []
    distances = results["distances"][0] or []

    # Format as numbered context blocks
    context_blocks = []
    sources = []
    for i, (chunk, meta) in enumerate(zip(chunks, metas), start=1):
        if not chunk:
            continue
        source = meta.get("source_name", "Unknown")
        context_blocks.append(f"[{i}] Source: {source}\n{chunk}")
        sources.append(source)

    return {
        "context": "\n\n".join(context_blocks),
        "distances": distances,
        "sources": sources,
    }


async def get_collection_stats() -> Dict[str, Any]:
    """Returns basic stats about the local knowledge store."""
    collection = get_collection()
    return {
        "collection_name": settings.CHROMA_COLLECTION_NAME,
        "total_chunks": collection.count(),
        "persist_path": settings.CHROMA_PERSIST_PATH,
    }
