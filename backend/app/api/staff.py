from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.schemas import StaffActionRequest, StaffActionResponse
from app.models.database import get_db, Application, StaffAction
from app.core.socket_manager import emit_to_app, broadcast_staff

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.post("/actions", response_model=StaffActionResponse)
async def perform_staff_action(request: StaffActionRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == request.application_id))
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    action_record = StaffAction(
        application_id=request.application_id,
        action_type=request.action,
        target_issue_type=request.issue_id,
        note=request.note
    )
    db.add(action_record)
    
    if request.action in ["override_issue", "approve_query"]:
        app.compliance_passed = True
        app.stage = "ready_for_submission"
        client_msg = f"Consultant verified: {request.note or 'Discrepancy resolved under employer sponsorship guarantee.'}"
    elif request.action == "authorize_submit":
        app.stage = "submitted"
        client_msg = "Application formally submitted to UKVI portal!"
    else:
        app.stage = "staff_review"
        client_msg = f"Consultant query: {request.note}"
        
    await db.commit()
    
    # Broadcast to applicant room and staff dashboard via WebSocket
    event_payload = {
        "application_id": request.application_id,
        "action": request.action,
        "updated_stage": app.stage,
        "note": request.note,
        "client_message": client_msg
    }
    await emit_to_app(request.application_id, "staff_action", event_payload)
    await broadcast_staff("staff_action", event_payload)
    
    return StaffActionResponse(
        success=True,
        updated_stage=app.stage,
        client_message=client_msg
    )
