"""
llm_gateway.py
──────────────
Unified, resilient Dual-LLM Gateway:
  - Primary Provider: Gemini (gemini-3.8-flash via google-genai)
  - Backup / Failover Provider: Groq (via groq SDK)
  
Features:
  - Provider-agnostic message format: [{"role": "system"|"user"|"assistant", "content": "..."}]
  - Automatic failover on 429 (ResourceExhausted / RateLimitError) or API exceptions
  - Strict JSON mode support across both models
  - Markdown fence stripper for rock-solid JSON parsing
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from groq import AsyncGroq
from app.core.config import settings

logger = logging.getLogger(__name__)


def clean_json_text(text: str) -> str:
    """Strips markdown code fences (```json ... ```) from model output."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    return cleaned


class LLMGateway:
    def __init__(self):
        self.gemini_key = settings.get_gemini_key
        self.groq_key = settings.get_groq_key

        self.gemini_model = "gemini-3.8-flash"
        # Try qwen/qwen3.8-27b or user configured groq model
        self.groq_model = settings.GROQ_MODEL if settings.GROQ_MODEL != "llama-3.3-70b-versatile" else "qwen/qwen3.8-27b"
        self.active_provider = settings.PRIMARY_LLM_PROVIDER or "gemini"

        # Initialize clients
        self.gemini_client = genai.Client(api_key=self.gemini_key) if self.gemini_key else None
        self.groq_client = AsyncGroq(api_key=self.groq_key) if self.groq_key else None

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        json_mode: bool = True,
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Takes provider-agnostic messages.
        Attempts active provider first, automatically falls back on error/quota.
        """
        # Separate system instruction if provided or in messages
        sys_prompt = system_instruction
        filtered_messages = []
        for m in messages:
            if m["role"] == "system":
                if not sys_prompt:
                    sys_prompt = m["content"]
                else:
                    sys_prompt += f"\n\n{m['content']}"
            else:
                filtered_messages.append(m)

        # ── 1. Try Primary ───────────────────────────────────────────────────
        if self.active_provider == "gemini" and self.gemini_client:
            try:
                return await self._call_gemini(filtered_messages, sys_prompt, temperature, json_mode)
            except Exception as e:
                logger.warning(f"[LLMGateway] Gemini failed or rate-limited: {e}. Falling back to Groq.")
                if self.groq_client:
                    return await self._call_groq(messages, temperature, json_mode)
                raise e

        # ── 2. Try Groq (Primary or Fallback) ─────────────────────────────────
        if self.groq_client:
            try:
                return await self._call_groq(messages, temperature, json_mode)
            except Exception as e:
                logger.warning(f"[LLMGateway] Groq failed: {e}. Attempting Gemini.")
                if self.gemini_client:
                    return await self._call_gemini(filtered_messages, sys_prompt, temperature, json_mode)
                raise e

        raise RuntimeError("No working LLM provider available. Check GEMINI_API_KEY and GROQ_API_KEY in .env.")

    async def _call_gemini(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str],
        temperature: float,
        json_mode: bool,
    ) -> Dict[str, Any]:
        """Calls Gemini via google-genai SDK."""
        # Assemble contents
        prompt_parts = []
        for m in messages:
            role = m["role"]
            content = m["content"]
            prompt_parts.append(f"[{role.upper()}]:\n{content}")

        combined_prompt = "\n\n".join(prompt_parts)

        config_args = {"temperature": temperature}
        if system_instruction:
            config_args["system_instruction"] = system_instruction
        if json_mode:
            config_args["response_mime_type"] = "application/json"

        config = types.GenerateContentConfig(**config_args)

        # Run synchronously in executor since google-genai generate_content is synchronous
        import asyncio
        loop = asyncio.get_running_loop()
        
        # 8-second timeout so a Gemini freeze never hangs the app
        call_task = loop.run_in_executor(
            None,
            lambda: self.gemini_client.models.generate_content(
                model=self.gemini_model,
                contents=combined_prompt,
                config=config,
            )
        )
        response = await asyncio.wait_for(call_task, timeout=8.0)

        raw_text = response.text or "{}"
        if json_mode:
            cleaned = clean_json_text(raw_text)
            return json.loads(cleaned)
        return {"text": raw_text}

    async def _call_groq(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        json_mode: bool,
    ) -> Dict[str, Any]:
        """Calls Groq via AsyncGroq SDK."""
        kwargs: Dict[str, Any] = {
            "model": self.groq_model,
            "messages": messages,
            "temperature": temperature,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        try:
            resp = await self.groq_client.chat.completions.create(**kwargs)
        except Exception as e:
            # If default model fails, try fallback qwen model
            if "model_not_found" in str(e) or "does not exist" in str(e):
                kwargs["model"] = "qwen/qwen3.8-27b"
                resp = await self.groq_client.chat.completions.create(**kwargs)
            else:
                raise e

        raw_text = resp.choices[0].message.content or "{}"
        if json_mode:
            cleaned = clean_json_text(raw_text)
            return json.loads(cleaned)
        return {"text": raw_text}


# Global singleton instance
gateway = LLMGateway()
