from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.models.database import get_db, Application, Document

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_applications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).order_by(Application.created_at.desc()))
    apps = result.scalars().all()
    
    output = []
    for app in apps:
        output.append({
            "id": app.id,
            "client_name": app.client_name,
            "client_email": app.client_email,
            "visa_type": app.visa_type,
            "destination": app.destination,
            "employer": app.employer,
            "stage": app.stage,
            "compliance_passed": app.compliance_passed,
            "created_at": app.created_at.isoformat() if app.created_at else None,
            "updated_at": app.updated_at.isoformat() if app.updated_at else None
        })
    return output

@router.get("/{app_id}")
async def get_application(app_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == app_id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    doc_result = await db.execute(select(Document).where(Document.application_id == app_id))
    docs = doc_result.scalars().all()
    
    doc_list = []
    total_issues = []
    for d in docs:
        doc_list.append({
            "id": d.id,
            "doc_type": d.doc_type,
            "original_filename": d.original_filename,
            "status": d.status,
            "extracted_data": d.extracted_data or {},
            "ai_confidence": d.ai_confidence,
            "issues": d.issues or []
        })
        if d.issues:
            total_issues.extend(d.issues)
            
    return {
        "id": app.id,
        "client_name": app.client_name,
        "client_email": app.client_email,
        "client_phone": app.client_phone,
        "visa_type": app.visa_type,
        "destination": app.destination,
        "employer": app.employer,
        "stage": app.stage,
        "compliance_passed": app.compliance_passed,
        "compliance_result": {
            "passed": len(total_issues) == 0,
            "total_issues_count": len(total_issues),
            "issues": total_issues
        },
        "extracted_profile": app.extracted_profile or {},
        "documents": doc_list,
        "created_at": app.created_at.isoformat() if app.created_at else None,
        "updated_at": app.updated_at.isoformat() if app.updated_at else None
    }
