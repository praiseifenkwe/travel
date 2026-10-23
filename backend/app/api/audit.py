"""
audit.py  —  POST /api/audit
──────────────────────────────
Full eligibility evaluation endpoint.
Runs the RAG-backed compliance engine against an applicant's profile.
"""

from fastapi import APIRouter, HTTPException

from app.core.schemas import AuditRequest, AuditResponse, IssueDetail
from app.services.compliance_engine import evaluate_compliance

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.post("", response_model=AuditResponse)
async def run_audit(request: AuditRequest):
    try:
        result = await evaluate_compliance(
            applicant_profile=request.applicant_profile,
            visa_type=request.visa_type,
            session_id=request.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Audit failed: {str(e)}")

    issues = [IssueDetail(**issue) for issue in result.get("issues", [])]

    return AuditResponse(
        session_id=request.session_id,
        visa_type=request.visa_type,
        overall_passed=result["overall_passed"],
        issues=issues,
        summary=result["summary"],
        retrieved_policy_chunks=result.get("retrieved_policy_chunks", 0),
    )
