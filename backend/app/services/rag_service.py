"""
rag_service.py
──────────────
Handles document ingestion and query retrieval from Qdrant when configured,
with ChromaDB retained as the local fallback and migration source.

Embeddings use the same local all-MiniLM-L6-v2 function for both vector stores.
"""

import os
import uuid
from typing import List, Dict, Any, Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings
from chromadb.utils import embedding_functions
from qdrant_client import QdrantClient, models

from app.core.config import settings

# ── ChromaDB singleton ────────────────────────────────────────────────────────

_chroma_client: Optional[chromadb.PersistentClient] = None
_collection = None
_qdrant_client: Optional[QdrantClient] = None
_embedding_function = None
QDRANT_PAYLOAD_TEXT_KEY = "_rag_text"
QDRANT_PAYLOAD_CHROMA_ID_KEY = "_chroma_id"


def _get_embedding_function():
    global _embedding_function
    if _embedding_function is None:
        _embedding_function = embedding_functions.DefaultEmbeddingFunction()
    return _embedding_function


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
        _collection = client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=_get_embedding_function(),
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def get_qdrant_client() -> QdrantClient:
    global _qdrant_client
    if not settings.qdrant_enabled:
        raise RuntimeError(
            "Qdrant is not configured. Set QDRANT_CLUSTER_ENDPOINT_KEY and QDRANT_API_KEY."
        )
    if _qdrant_client is None:
        endpoint = settings.QDRANT_CLUSTER_ENDPOINT_KEY
        if not endpoint or not endpoint.startswith("https://"):
            raise ValueError("QDRANT_CLUSTER_ENDPOINT_KEY must be an HTTPS cluster URL.")
        _qdrant_client = QdrantClient(
            url=endpoint,
            api_key=settings.QDRANT_API_KEY,
            timeout=30,
        )
    return _qdrant_client


def _ensure_qdrant_collection(vector_size: int) -> None:
    client = get_qdrant_client()
    collection_name = settings.qdrant_collection
    if not client.collection_exists(collection_name):
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=vector_size,
                distance=models.Distance.COSINE,
            ),
        )
        return

    info = client.get_collection(collection_name)
    vectors_config = info.config.params.vectors
    if isinstance(vectors_config, dict):
        raise ValueError("Qdrant collection uses named vectors; expected one unnamed vector.")
    if vectors_config.size != vector_size:
        raise ValueError(
            f"Qdrant collection vector size {vectors_config.size} does not match "
            f"the embedding size {vector_size}."
        )
    if vectors_config.distance != models.Distance.COSINE:
        raise ValueError("Qdrant collection must use cosine distance.")


def _qdrant_point_id(chroma_id: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"{settings.CHROMA_COLLECTION_NAME}:{chroma_id}"))


def _qdrant_filter(filter_metadata: Optional[Dict[str, str]]):
    if not filter_metadata:
        return None
    return models.Filter(
        must=[
            models.FieldCondition(key=key, match=models.MatchValue(value=value))
            for key, value in filter_metadata.items()
        ]
    )


def _upsert_qdrant_points(
    ids: List[str],
    documents: List[str],
    metadatas: List[Dict[str, Any]],
    vectors: List[List[float]],
) -> None:
    if not vectors:
        return
    _ensure_qdrant_collection(len(vectors[0]))
    points = []
    for chroma_id, document, metadata, vector in zip(ids, documents, metadatas, vectors):
        payload = {
            key: value
            for key, value in metadata.items()
            if value is not None and isinstance(value, (str, int, float, bool, list, dict))
        }
        payload[QDRANT_PAYLOAD_TEXT_KEY] = document
        payload[QDRANT_PAYLOAD_CHROMA_ID_KEY] = chroma_id
        points.append(
            models.PointStruct(
                id=_qdrant_point_id(chroma_id),
                vector=vector,
                payload=payload,
            )
        )
    get_qdrant_client().upsert(
        collection_name=settings.qdrant_collection,
        points=points,
        wait=True,
    )


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

    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
    metadatas = [
        {
                "document_id": doc_id,
                "source_name": source_name,
                "doc_type": doc_type,
                "business_id": business_id,
                "chunk_index": i,
                **metadata_extra,
        }
        for i in range(len(chunks))
    ]
    if settings.qdrant_enabled:
        vectors = _get_embedding_function()(chunks)
        _upsert_qdrant_points(
            ids=ids,
            documents=chunks,
            metadatas=metadatas,
            vectors=[vector.tolist() for vector in vectors],
        )
    else:
        get_collection().upsert(ids=ids, documents=chunks, metadatas=metadatas)

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
    """Retrieve formatted context and cosine distances from the active vector store."""
    n_results = n_results or settings.RAG_TOP_K
    if settings.qdrant_enabled:
        query_vector = _get_embedding_function()([query])[0].tolist()
        client = get_qdrant_client()
        if not client.collection_exists(settings.qdrant_collection):
            return {"context": "", "distances": [], "sources": []}
        response = client.query_points(
            collection_name=settings.qdrant_collection,
            query=query_vector,
            query_filter=_qdrant_filter(filter_metadata),
            limit=n_results,
            with_payload=True,
        )
        context_blocks = []
        distances = []
        sources = []
        for index, point in enumerate(response.points, start=1):
            payload = point.payload or {}
            chunk = payload.get(QDRANT_PAYLOAD_TEXT_KEY)
            if not isinstance(chunk, str) or not chunk:
                continue
            source = payload.get("source_name", "Unknown")
            context_blocks.append(f"[{index}] Source: {source}\n{chunk}")
            sources.append(source)
            distances.append(1.0 - point.score)
        return {
            "context": "\n\n".join(context_blocks),
            "distances": distances,
            "sources": sources,
        }

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
    if settings.qdrant_enabled:
        client = get_qdrant_client()
        collection_name = settings.qdrant_collection
        if not client.collection_exists(collection_name):
            return {
                "collection_name": collection_name,
                "total_chunks": 0,
                "provider": "qdrant",
            }
        info = client.get_collection(collection_name)
        return {
            "collection_name": collection_name,
            "total_chunks": info.points_count or 0,
            "provider": "qdrant",
        }

    collection = get_collection()
    return {
        "collection_name": settings.CHROMA_COLLECTION_NAME,
        "total_chunks": collection.count(),
        "persist_path": settings.CHROMA_PERSIST_PATH,
        "provider": "chroma",
    }


def migrate_chroma_to_qdrant(batch_size: int = 256) -> Dict[str, Any]:
    """Copy all Chroma documents, metadata, and vectors into the configured Qdrant collection."""
    if not settings.qdrant_enabled:
        raise RuntimeError(
            "Qdrant is not configured. Set QDRANT_CLUSTER_ENDPOINT_KEY and QDRANT_API_KEY."
        )

    collection = get_collection()
    total = collection.count()
    if total == 0:
        return {
            "source_collection": settings.CHROMA_COLLECTION_NAME,
            "target_collection": settings.qdrant_collection,
            "points_migrated": 0,
        }

    first_batch = collection.get(
        limit=min(batch_size, total),
        include=["documents", "metadatas", "embeddings"],
    )
    embeddings = first_batch["embeddings"]
    if embeddings is None or len(embeddings) == 0:
        raise RuntimeError("Chroma returned no stored embeddings; migration was not started.")
    _ensure_qdrant_collection(len(embeddings[0]))

    migrated = 0
    for offset in range(0, total, batch_size):
        batch = first_batch if offset == 0 else collection.get(
            limit=min(batch_size, total - offset),
            offset=offset,
            include=["documents", "metadatas", "embeddings"],
        )
        documents = batch["documents"] or []
        metadatas = batch["metadatas"] or [{} for _ in documents]
        vectors = batch["embeddings"]
        if vectors is None or len(vectors) != len(documents):
            raise RuntimeError(f"Chroma returned incomplete vectors at offset {offset}.")
        _upsert_qdrant_points(
            ids=batch["ids"],
            documents=documents,
            metadatas=metadatas,
            vectors=[vector.tolist() for vector in vectors],
        )
        migrated += len(documents)

    return {
        "source_collection": settings.CHROMA_COLLECTION_NAME,
        "target_collection": settings.qdrant_collection,
        "points_migrated": migrated,
    }
