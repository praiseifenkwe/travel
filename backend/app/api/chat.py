"""
chat.py  —  POST /api/chat
──────────────────────────
Conversational Q&A endpoint.
Retrieves relevant policy context from ChromaDB, then calls the LLM
to answer the user's question in context.
"""

import uuid
from fastapi import APIRouter, HTTPException

from app.core.schemas import ChatRequest, ChatResponse
from app.services.rag_service import retrieve_context
from app.services.llm_service import chat_completion, build_rag_chat_prompt

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

    # 1. Retrieve relevant policy chunks for the user's query
    rag_context = await retrieve_context(query=request.message)

    # 2. Build RAG-enriched prompt
    system_prompt, user_msg = await build_rag_chat_prompt(
        rag_context=rag_context,
        user_message=request.message,
    )

    # 3. LLM completion
    try:
        result = await chat_completion(
            system_prompt=system_prompt,
            user_message=user_msg,
            json_mode=True,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM unavailable: {str(e)}")

    return ChatResponse(
        session_id=session_id,
        reply=result.get("reply", "I'm sorry, I couldn't process that request."),
        sources=result.get("sources", []),
        extracted_intent=result.get("extracted_intent", {}),
        stage=result.get("stage", "intake"),
    )
