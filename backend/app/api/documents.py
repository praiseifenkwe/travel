import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.schemas import DocumentUploadResponse
from app.models.database import get_db, Application, Document
from app.services.document_service import analyze_document
from app.core.socket_manager import emit_to_app, broadcast_staff

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def run_async_document_processing(
    doc_id: str, 
    app_id: str, 
    doc_type: str, 
    file_bytes: bytes, 
    filename: str
):
    extracted_data, confidence, issues, status = await analyze_document(
        file_bytes=file_bytes,
        filename=filename,
        doc_type=doc_type,
        application_id=app_id
    )
    
    # Save to database in separate session
    from app.models.database import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Document).where(Document.id == doc_id))
        doc = result.scalar_one_or_none()
        if doc:
            doc.extracted_data = extracted_data
            doc.ai_confidence = confidence
            doc.issues = issues
            doc.status = status
            doc.processed_at = datetime.utcnow()
            
            # Check application stage
            app_res = await session.execute(select(Application).where(Application.id == app_id))
            app_rec = app_res.scalar_one_or_none()
            if app_rec:
                if status == "flagged":
                    app_rec.stage = "document_audit"
                app_rec.updated_at = datetime.utcnow()
            
            await session.commit()
            
    # Emit real-time WebSocket events
    payload = {
        "document_id": doc_id,
        "application_id": app_id,
        "doc_type": doc_type,
        "status": status,
        "extracted_data": extracted_data,
        "confidence": confidence,
        "issues": issues
    }
    await emit_to_app(app_id, "document_processed", payload)
    await broadcast_staff("document_processed", payload)

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    application_id: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    doc_id = str(uuid.uuid4())
    file_bytes = await file.read()
    
    # Save file to disk
    save_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
    with open(save_path, "wb") as f:
        f.write(file_bytes)
        
    doc = Document(
        id=doc_id,
        application_id=application_id,
        doc_type=doc_type,
        file_path=save_path,
        original_filename=file.filename,
        mime_type=file.content_type,
        file_size_bytes=len(file_bytes),
        status="processing"
    )
    db.add(doc)
    await db.commit()
    
    # Trigger background AI OCR & compliance evaluation
    background_tasks.add_task(
        run_async_document_processing,
        doc_id, application_id, doc_type, file_bytes, file.filename
    )
    
    return DocumentUploadResponse(
        document_id=doc_id,
        application_id=application_id,
        doc_type=doc_type,
        status="processing",
        message=f"Received {doc_type}. Automated AI analysis underway."
    )
