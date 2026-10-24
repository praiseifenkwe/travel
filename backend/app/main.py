from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import chat, audit, checklist, rules, trusted_sources, audit_tickets

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Native RAG-Powered Visa & Relocation Assistant API",
    version="2.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(checklist.router, prefix="/api")
app.include_router(rules.router, prefix="/api")
app.include_router(trusted_sources.router, prefix="/api")
app.include_router(audit_tickets.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    from app.core.database import init_db
    from app.services.rag_service import get_collection_stats, ingest_document
    from app.services.rule_store import get_active_rules, list_drafts
    from pathlib import Path
    
    init_db()  # Create PostgreSQL tables & seed trusted sources
    stats = await get_collection_stats()
    
    # Auto-bootstrap if vector store is empty
    if stats["total_chunks"] == 0:
        dump_path = Path(__file__).resolve().parent / "data" / "raw_data" / "wakanow_dump.txt"
        if dump_path.exists():
            print(f"📦 Vector store empty on startup — auto-ingesting {dump_path.name}...")
            await ingest_document(str(dump_path), source_name=dump_path.name, doc_type="policy")
            stats = await get_collection_stats()

    active_rules = get_active_rules()
    pending_drafts = [d for d in list_drafts() if not d.is_complete]
    print(
        f"✅ {stats['provider'].capitalize()} ready — "
        f"collection '{stats['collection_name']}' | {stats['total_chunks']} chunks indexed"
    )
    print(f"✅ Rules engine — {len(active_rules)} active rules | {len(pending_drafts)} drafts awaiting operator input")


@app.get("/health")
@app.get("/api/health")
async def health_check():
    from app.services.rag_service import get_collection_stats
    stats = await get_collection_stats()
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "vector_store": stats,
    }
