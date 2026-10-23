"""
whitelisted_search.py
─────────────────────
Domain-Restricted Web Verification & Knowledge Flywheel Service for TravelForge.

Responsibilities:
1. Strict Domain Whitelist Enforcement: Validates URLs against PostgreSQL trusted_sources.
2. Verified Page Fetcher: Safely extracts text from approved official government/partner sites.
3. Knowledge Flywheel Logger: Creates AuditTickets for gaps or when consultant sign-off is required.
"""

from urllib.parse import urlparse
from typing import Optional, Dict, Any, List
from bs4 import BeautifulSoup
import httpx
from sqlmodel import Session, select

from app.core.database import engine
from app.models.trusted_sources import TrustedSource, AuditTicket


def get_trusted_sources(country: Optional[str] = None, only_active: bool = True) -> List[TrustedSource]:
    """Fetch active trusted sources from PostgreSQL, optionally filtered by country."""
    with Session(engine) as session:
        query = select(TrustedSource)
        if only_active:
            query = query.where(TrustedSource.is_active == True)
        if country and country != "GLOBAL":
            query = query.where(TrustedSource.jurisdiction_country.in_([country, "GLOBAL"]))
        return list(session.exec(query).all())


def match_trusted_source(url: str) -> Optional[TrustedSource]:
    """
    Checks if a URL belongs to an active whitelisted domain in PostgreSQL.
    Returns the TrustedSource record or None.
    """
    domain = urlparse(url).netloc.lower()
    if not domain:
        domain = url.lower().split("/")[0]
        
    with Session(engine) as session:
        active_sources = session.exec(select(TrustedSource).where(TrustedSource.is_active == True)).all()
        for src in active_sources:
            if src.domain in domain or domain.endswith(f".{src.domain}"):
                return src
    return None


async def fetch_verified_page_content(url: str) -> Dict[str, Any]:
    """
    Fetches and parses text from a URL ONLY IF it is in trusted_sources.
    Enforces the security boundary: refuses to fetch unapproved blogs/forums.
    """
    source = match_trusted_source(url)
    if not source:
        raise ValueError(
            f"Security Boundary Violation: Domain for '{url}' is not in approved trusted_sources. "
            f"Add this domain to the whitelist via staff dashboard to enable ingestion."
        )

    headers = {
        "User-Agent": "TravelForge-Compliance-Verifier/2.0 (+https://travelforge.internal)"
    }
    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True, headers=headers) as client:
        resp = await client.get(url)
        resp.raise_for_status()

    # Parse HTML to clean, structured markdown/text
    soup = BeautifulSoup(resp.text, "html.parser")
    
    # Remove navigation, headers, footers, scripts
    for elem in soup(["script", "style", "nav", "footer", "header", "aside"]):
        elem.decompose()

    text_content = soup.get_text(separator="\n", strip=True)
    title = soup.title.string.strip() if soup.title and soup.title.string else source.name

    return {
        "url": url,
        "title": title,
        "content": text_content,
        "source_name": source.name,
        "domain": source.domain,
        "trust_level": source.trust_level,
        "can_answer_autonomously": source.can_answer_autonomously,
    }


def create_audit_ticket(
    ticket_type: str,
    title: str,
    description: str,
    proposed_content: str,
    target_country: str = "GLOBAL",
    source_url: Optional[str] = None,
    source_domain: Optional[str] = None,
) -> AuditTicket:
    """
    Creates a review ticket in PostgreSQL for the Knowledge Flywheel.
    Consultants can approve, edit, or reject this from the agency dashboard.
    """
    with Session(engine) as session:
        # Check if identical ticket already exists
        stmt = select(AuditTicket).where(
            AuditTicket.title == title,
            AuditTicket.status == "pending"
        )
        existing = session.exec(stmt).first()
        if existing:
            existing.frequency_count += 1
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing

        ticket = AuditTicket(
            ticket_type=ticket_type,
            title=title,
            description=description,
            proposed_content=proposed_content,
            target_country=target_country,
            source_url=source_url,
            source_domain=source_domain,
            status="pending",
        )
        session.add(ticket)
        session.commit()
        session.refresh(ticket)
        return ticket


async def resolve_whitelisted_fallback(query: str) -> Optional[Dict[str, Any]]:
    """
    Called when local ChromaDB has low confidence or no documents.
    Detects jurisdiction from user query, queries PostgreSQL trusted_sources,
    and scrapes live verified official guidance on the spot.
    """
    q_lower = query.lower()
    country = "GLOBAL"
    if any(k in q_lower for k in ["uk", "united kingdom", "britain", "england", "london"]):
        country = "UK"
    elif any(k in q_lower for k in ["us", "usa", "united states", "america", "b1", "b2", "ds160", "ds-160"]):
        country = "US"
    elif any(k in q_lower for k in ["schengen", "france", "germany", "italy", "spain", "vfs"]):
        country = "GLOBAL"

    with Session(engine) as session:
        # Prefer gold-level autonomous sources
        stmt = select(TrustedSource).where(
            TrustedSource.is_active == True,
            TrustedSource.jurisdiction_country.in_([country, "GLOBAL"])
        ).order_by(TrustedSource.trust_level.asc())
        sources = session.exec(stmt).all()
        if not sources:
            return None
        
        target_source = sources[0]
        target_url = target_source.base_url
        if target_source.domain == "gov.uk" and ("visitor" in q_lower or "visit" in q_lower or "tourist" in q_lower or "holiday" in q_lower):
            target_url = "https://www.gov.uk/standard-visitor/eligibility"

        try:
            page = await fetch_verified_page_content(target_url)
            return page
        except Exception as e:
            print(f"[whitelisted_search] Live fallback fetch failed: {e}")
            return None
