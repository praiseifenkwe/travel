import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from app.api.chat import handle_chat
from app.core.schemas import ChatRequest
from app.services.whitelisted_search import match_trusted_source


class ChatWebFallbackTests(unittest.IsolatedAsyncioTestCase):
    async def test_confident_retrieval_skips_web_fallback(self):
        with (
            patch(
                "app.api.chat.retrieve_context_with_scores",
                new=AsyncMock(
                    return_value={
                        "context": "Relevant local policy",
                        "distances": [0.2],
                        "sources": ["local-policy.pdf"],
                    }
                ),
            ),
            patch(
                "app.api.chat.resolve_whitelisted_fallback",
                new=AsyncMock(),
            ) as resolve_fallback,
            patch(
                "app.api.chat.chat_completion",
                new=AsyncMock(return_value={"reply": "Local answer", "sources": []}),
            ),
        ):
            response = await handle_chat(ChatRequest(message="What is the UK visitor visa?"))

        resolve_fallback.assert_not_awaited()
        self.assertEqual(response.reply, "Local answer")
        self.assertEqual(response.sources, [])

    async def test_missing_or_weak_retrieval_uses_web_fallback(self):
        page = {
            "title": "Official visitor visa guidance",
            "url": "https://www.gov.uk/standard-visitor/eligibility",
            "domain": "gov.uk",
            "content": "A visitor can stay for up to six months.",
            "can_answer_autonomously": True,
        }
        for distances in ([], [0.8]):
            with self.subTest(distances=distances):
                with (
                    patch(
                        "app.api.chat.retrieve_context_with_scores",
                        new=AsyncMock(
                            return_value={
                                "context": "Weak local evidence" if distances else "",
                                "distances": distances,
                                "sources": [],
                            }
                        ),
                    ),
                    patch(
                        "app.api.chat.resolve_whitelisted_fallback",
                        new=AsyncMock(return_value=page),
                    ) as resolve_fallback,
                    patch(
                        "app.api.chat.chat_completion",
                        new=AsyncMock(return_value={"reply": "Web answer", "sources": []}),
                    ) as completion,
                ):
                    response = await handle_chat(
                        ChatRequest(message="What is the UK visitor visa?")
                    )

                resolve_fallback.assert_awaited_once_with(
                    "What is the UK visitor visa?"
                )
                self.assertEqual(response.reply, "Web answer")
                self.assertEqual(
                    response.sources,
                    [
                        "Official visitor visa guidance — "
                        "https://www.gov.uk/standard-visitor/eligibility"
                    ],
                )
                self.assertIn(
                    "A visitor can stay for up to six months.",
                    completion.await_args.kwargs["system_prompt"],
                )
                self.assertNotIn(
                    "Weak local evidence",
                    completion.await_args.kwargs["system_prompt"],
                )

    def test_trusted_domain_matching_requires_exact_domain_boundary(self):
        source = SimpleNamespace(domain="gov.uk", is_active=True)
        session = SimpleNamespace(
            __enter__=lambda self: self,
            __exit__=lambda self, *_: None,
        )

        class SessionContext:
            def __enter__(self):
                return session

            def __exit__(self, *_):
                return None

        session.exec = lambda _statement: SimpleNamespace(all=lambda: [source])
        with patch(
            "app.services.whitelisted_search.Session",
            return_value=SessionContext(),
        ):
            self.assertIsNotNone(
                match_trusted_source("https://www.gov.uk/standard-visitor")
            )
            self.assertIsNone(
                match_trusted_source("https://gov.uk.attacker.example/page")
            )
            self.assertIsNone(match_trusted_source("http://www.gov.uk/page"))
