from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime

# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    sources: List[str] = []          # RAG source doc names surfaced to user
    extracted_intent: Dict[str, Any] = {}
    stage: str = "intake"

# ── Audit ─────────────────────────────────────────────────────────────────────

class AuditRequest(BaseModel):
    session_id: str
    applicant_profile: Dict[str, Any]   # Structured data from intake chat
    visa_type: str                       # e.g. "uk_skilled_worker"

class IssueDetail(BaseModel):
    rule: str
    passed: bool
    detail: str
    severity: str = "critical"           # critical | warning | info
    source: Optional[str] = None         # Which policy doc this came from

class AuditResponse(BaseModel):
    session_id: str
    visa_type: str
    overall_passed: bool
    issues: List[IssueDetail] = []
    summary: str                         # LLM-generated plain-English summary
    retrieved_policy_chunks: int = 0     # How many RAG chunks informed this

# ── Checklist ─────────────────────────────────────────────────────────────────

class ChecklistItem(BaseModel):
    id: str
    label: str
    description: str
    status: str = "pending"              # pending | uploaded | verified | flagged
    required: bool = True
    source_policy: Optional[str] = None  # Which doc this requirement came from

class ChecklistResponse(BaseModel):
    session_id: str
    visa_type: str
    items: List[ChecklistItem]
    generated_from_rag: bool = True

# ── HITL Rule Extraction ──────────────────────────────────────────────────────

class DeterministicRuleDraft(BaseModel):
    """
    What the LLM returns after reading a raw policy excerpt.
    is_complete=False means it detected a gap and has a question for the operator.
    """
    rule_id: str = Field(description="Unique snake_case ID, e.g. 'uk_maintenance_funds'")
    visa_type: str = Field(description="e.g. 'uk_standard_visitor', 'us_b1_b2', 'schengen'")
    category: Literal["statutory", "company_policy", "fee", "document_requirement", "timing"] = Field(
        description="Classification of the rule"
    )
    condition_summary: str = Field(description="One-sentence plain-English description of the rule")
    target_field: str = Field(description="Applicant profile field this checks, e.g. 'bank_balance_gbp'")
    operator: Literal[">=", "<=", "==", ">", "<", "in", "exists", "not_exists", "contains"] = Field(
        description="Comparison operator for deterministic evaluation"
    )
    threshold_value: Optional[float] = Field(None, description="Exact numeric threshold if present in text")
    threshold_unit: Optional[str] = Field(None, description="Unit: 'GBP', 'EUR', 'NGN', 'days', 'months', 'weeks'")
    holding_period_days: Optional[int] = Field(None, description="How many days the threshold must be maintained")
    exception_clause: Optional[str] = Field(None, description="Any explicit exceptions stated in the policy")
    # Gap detection
    is_complete: bool = Field(description="True only if ALL fields needed for code execution are present")
    missing_fields: List[str] = Field(default_factory=list, description="Field names that are ambiguous or absent")
    operator_question: Optional[str] = Field(
        None,
        description="Specific question to ask the human operator to resolve the gap. Must be actionable."
    )
    raw_excerpt: str = Field(description="The exact source text this rule was extracted from")


class RuleConfirmation(BaseModel):
    """Operator's response that fills the gap in a DeterministicRuleDraft."""
    rule_id: str
    operator_answer: str               # Free-text answer, e.g. "£1,270 held for 28 days"
    confirmed_threshold_value: Optional[float] = None
    confirmed_threshold_unit: Optional[str] = None
    confirmed_holding_period_days: Optional[int] = None
    operator_notes: Optional[str] = None
    confirmed_by: str = "admin"        # Who approved it


class ActiveRule(BaseModel):
    """A fully confirmed, executable deterministic rule stored in data/rules/."""
    rule_id: str
    visa_type: str
    category: str
    condition_summary: str
    target_field: str
    operator: str
    threshold_value: Optional[float] = None
    threshold_unit: Optional[str] = None
    holding_period_days: Optional[int] = None
    exception_clause: Optional[str] = None
    is_active: bool = True
    confirmed_at: str                  # ISO datetime string
    confirmed_by: str
    operator_notes: Optional[str] = None
    source_text: str                   # Original policy excerpt


# ── Knowledge Ingestion ───────────────────────────────────────────────────────

class IngestRequest(BaseModel):
    source_name: str                   # Human-readable doc name
    doc_type: str = "policy"           # policy | sop | faq | regulation
    business_id: str = "default"
    text: Optional[str] = None         # Inline text OR use file upload endpoint

class IngestResponse(BaseModel):
    document_id: str
    chunks_created: int
    source_name: str
    message: str


# ── Rule Extract & Confirm ────────────────────────────────────────────────────

class ExtractRequest(BaseModel):
    raw_text: str                      # The raw policy paragraph/section
    visa_type: str                     # Hint to the LLM about context
    source_name: str = "unknown"       # Which doc this came from

class ExtractResponse(BaseModel):
    rules: List[DeterministicRuleDraft]
    total_extracted: int
    complete: int                      # Rules that are immediately usable
    needs_operator_input: int          # Rules that have gaps

class ConfirmResponse(BaseModel):
    rule_id: str
    status: str                        # "activated" | "error"
    active_rule: Optional[ActiveRule] = None
    message: str
