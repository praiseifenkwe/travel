"""
chat.py  —  POST /api/chat
──────────────────────────
Conversational Q&A endpoint.
Retrieves relevant policy context from ChromaDB, then calls the LLM
to answer the user's question in context.
"""

import uuid
import logging
from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.core.schemas import ChatRequest, ChatResponse
from app.services.rag_service import retrieve_context_with_scores
from app.services.llm_service import chat_completion, build_rag_chat_prompt
from app.services.whitelisted_search import resolve_whitelisted_fallback

router = APIRouter(prefix="/chat", tags=["Chat"])
logger = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

    # 1. Retrieve relevant policy chunks for the user's query
    retrieval = await retrieve_context_with_scores(query=request.message)
    rag_context = retrieval["context"]
    valid_distances = [
        distance
        for distance in retrieval["distances"]
        if isinstance(distance, (int, float))
    ]
    best_distance = min(valid_distances, default=None)
    web_page = None

    if best_distance is None or best_distance > settings.RAG_DISTANCE_THRESHOLD:
        rag_context = ""
        try:
            web_page = await resolve_whitelisted_fallback(request.message)
        except Exception:
            logger.exception("Trusted web fallback failed for chat request")

    web_context = ""
    if web_page and web_page["can_answer_autonomously"]:
        web_context = (
            f"Source: {web_page['title']} ({web_page['url']})\n"
            f"Trusted domain: {web_page['domain']}\n"
            f"Content:\n{web_page['content'][:12000]}"
        )

    # 2. Build RAG-enriched prompt
    system_prompt, user_msg = await build_rag_chat_prompt(
        rag_context=rag_context,
        user_message=request.message,
        web_context=web_context,
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

    sources = result.get("sources")
    if not isinstance(sources, list):
        sources = []
    sources = [source for source in sources if isinstance(source, str)]
    if web_context:
        web_source = f"{web_page['title']} — {web_page['url']}"
        if web_source not in sources:
            sources.append(web_source)

    return ChatResponse(
        session_id=session_id,
        reply=result.get("reply", "I'm sorry, I couldn't process that request."),
        sources=sources,
        extracted_intent=result.get("extracted_intent", {}),
        stage=result.get("stage", "intake"),
    )
