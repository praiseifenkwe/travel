from typing import Dict, Any, List

def calculate_application_stage(documents: List[Dict[str, Any]], compliance_passed: bool) -> str:
    """Determines the workflow stage based on uploaded documents and compliance status."""
    if not documents:
        return "intake"
    
    uploaded_types = {d.get("doc_type") for d in documents}
    mandatory = {"passport", "cos", "tb_test", "bank_statement"}
    
    if not mandatory.issubset(uploaded_types):
        return "document_upload"
        
    has_critical_issue = any(d.get("status") == "flagged" for d in documents)
    if has_critical_issue and not compliance_passed:
        return "document_audit"
        
    return "ready_for_submission"
