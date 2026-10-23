from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.schemas import ChatRequest, ChatResponse
from app.models.database import get_db, Application, ChatMessage
from app.services.chat_service import process_chat_message
from app.core.socket_manager import sio

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def handle_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    app_id, reply, intent, checklist, stage = await process_chat_message(
        message=request.message,
        application_id=request.application_id
    )
    
    # Check or create application record
    result = await db.execute(select(Application).where(Application.id == app_id))
    app_record = result.scalar_one_or_none()
    
    if not app_record:
        app_record = Application(
            id=app_id,
            client_name=intent.get("client_name") or "Tunde Adeyemi",
            client_email="tunde.adeyemi@bloomberg.com",
            visa_type=intent.get("visa_type", "uk_skilled_worker"),
            destination=intent.get("destination", "United Kingdom"),
            employer=intent.get("employer", "Bloomberg LP"),
            travel_timeline=intent.get("timeline", "next month"),
            stage=stage,
            extracted_profile=intent
        )
        db.add(app_record)
        
    # Save user message
    user_msg = ChatMessage(
        application_id=app_id,
        role="user",
        content=request.message
    )
    # Save assistant reply
    bot_msg = ChatMessage(
        application_id=app_id,
        role="assistant",
        content=reply,
        metadata_json={"intent": intent, "checklist": checklist}
    )
    db.add(user_msg)
    db.add(bot_msg)
    await db.commit()
    
    # Emit websocket notification to staff room
    await sio.emit("staff_new_intake", {
        "application_id": app_id,
        "client_name": app_record.client_name,
        "destination": app_record.destination,
        "employer": app_record.employer,
        "stage": app_record.stage
    }, room="staff_room")

    return ChatResponse(
        application_id=app_id,
        reply=reply,
        extracted_intent=intent,
        checklist=checklist,
        stage=stage
    )
