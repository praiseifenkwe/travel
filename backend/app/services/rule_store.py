"""
rule_store.py
─────────────
Manages the persistence of confirmed deterministic rules.

Storage: data/rules/active_rules.json  (append-only, human-readable)
         data/rules/drafts.json        (pending operator input)

Both files are JSON arrays. Simple, auditable, no DB required.
"""

import json
import os
from datetime import datetime, timezone
from typing import List, Optional
from pathlib import Path

from app.core.schemas import (
    DeterministicRuleDraft,
    RuleConfirmation,
    ActiveRule,
)

# ── Storage paths ─────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent / "data" / "rules"
ACTIVE_RULES_PATH = BASE_DIR / "active_rules.json"
DRAFTS_PATH = BASE_DIR / "drafts.json"


def _ensure_files():
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    if not ACTIVE_RULES_PATH.exists():
        ACTIVE_RULES_PATH.write_text("[]")
    if not DRAFTS_PATH.exists():
        DRAFTS_PATH.write_text("[]")


# ── Draft management ──────────────────────────────────────────────────────────

def save_drafts(drafts: List[DeterministicRuleDraft]) -> None:
    """Persist a batch of rule drafts (pending operator review)."""
    _ensure_files()
    existing = _load_json(DRAFTS_PATH)
    existing_ids = {d["rule_id"] for d in existing}

    for draft in drafts:
        data = draft.model_dump()
        if draft.rule_id not in existing_ids:
            existing.append(data)
        else:
            # Overwrite if re-extracted
            existing = [d if d["rule_id"] != draft.rule_id else data for d in existing]

    DRAFTS_PATH.write_text(json.dumps(existing, indent=2, ensure_ascii=False))


def get_draft(rule_id: str) -> Optional[DeterministicRuleDraft]:
    """Retrieve a specific draft by rule_id."""
    _ensure_files()
    for d in _load_json(DRAFTS_PATH):
        if d["rule_id"] == rule_id:
            return DeterministicRuleDraft(**d)
    return None


def list_drafts(needs_input_only: bool = False) -> List[DeterministicRuleDraft]:
    """List all drafts, optionally only those needing operator input."""
    _ensure_files()
    drafts = [DeterministicRuleDraft(**d) for d in _load_json(DRAFTS_PATH)]
    if needs_input_only:
        return [d for d in drafts if not d.is_complete]
    return drafts


# ── Active rule management ────────────────────────────────────────────────────

def confirm_rule(
    draft: DeterministicRuleDraft,
    confirmation: RuleConfirmation,
    parsed_values: dict,
) -> ActiveRule:
    """
    Merge draft + operator confirmation + LLM-parsed values → ActiveRule.
    Saves to active_rules.json and removes from drafts.json.
    """
    _ensure_files()

    active = ActiveRule(
        rule_id=draft.rule_id,
        visa_type=draft.visa_type,
        category=draft.category,
        condition_summary=draft.condition_summary,
        target_field=draft.target_field,
        operator=draft.operator,
        # Use explicitly provided values first, then LLM-parsed, then draft values
        threshold_value=(
            confirmation.confirmed_threshold_value
            or parsed_values.get("confirmed_threshold_value")
            or draft.threshold_value
        ),
        threshold_unit=(
            confirmation.confirmed_threshold_unit
            or parsed_values.get("confirmed_threshold_unit")
            or draft.threshold_unit
        ),
        holding_period_days=(
            confirmation.confirmed_holding_period_days
            or parsed_values.get("confirmed_holding_period_days")
            or draft.holding_period_days
        ),
        exception_clause=draft.exception_clause,
        is_active=True,
        confirmed_at=datetime.now(timezone.utc).isoformat(),
        confirmed_by=confirmation.confirmed_by,
        operator_notes=confirmation.operator_notes,
        source_text=draft.raw_excerpt,
    )

    # Append to active rules
    existing_active = _load_json(ACTIVE_RULES_PATH)
    existing_active = [r for r in existing_active if r["rule_id"] != active.rule_id]
    existing_active.append(active.model_dump())
    ACTIVE_RULES_PATH.write_text(json.dumps(existing_active, indent=2, ensure_ascii=False))

    # Remove from drafts
    existing_drafts = _load_json(DRAFTS_PATH)
    existing_drafts = [d for d in existing_drafts if d["rule_id"] != draft.rule_id]
    DRAFTS_PATH.write_text(json.dumps(existing_drafts, indent=2, ensure_ascii=False))

    return active


def get_active_rules(visa_type: Optional[str] = None) -> List[ActiveRule]:
    """Load all active rules, optionally filtered by visa_type."""
    _ensure_files()
    rules = [ActiveRule(**r) for r in _load_json(ACTIVE_RULES_PATH) if r.get("is_active")]
    if visa_type:
        rules = [r for r in rules if r.visa_type == visa_type]
    return rules


def deactivate_rule(rule_id: str) -> bool:
    """Soft-delete: set is_active=False on a confirmed rule."""
    _ensure_files()
    existing = _load_json(ACTIVE_RULES_PATH)
    updated = False
    for r in existing:
        if r["rule_id"] == rule_id:
            r["is_active"] = False
            updated = True
    if updated:
        ACTIVE_RULES_PATH.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
    return updated


# ── Helpers ───────────────────────────────────────────────────────────────────

def _load_json(path: Path) -> list:
    try:
        return json.loads(path.read_text())
    except (json.JSONDecodeError, FileNotFoundError):
        return []
