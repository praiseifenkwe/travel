import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

def evaluate_document_compliance(doc_type: str, extracted_data: Dict[str, Any], rule_path: str = None) -> List[Dict[str, Any]]:
    """Deterministically validates extracted document fields against official immigration rules."""
    issues = []
    
    if doc_type == "passport":
        expiry_str = extracted_data.get("expiry_date") # Expected YYYY-MM-DD
        if expiry_str:
            try:
                expiry_dt = datetime.strptime(expiry_str, "%Y-%m-%d")
                # Must be valid for at least 180 days (6 months)
                six_months_ahead = datetime.utcnow() + timedelta(days=180)
                if expiry_dt < six_months_ahead:
                    issues.append({
                        "rule": "passport_validity_period",
                        "document": "passport",
                        "passed": False,
                        "detail": f"Passport expires on {expiry_str}, which has less than 6 months validity from intended departure date.",
                        "severity": "critical"
                    })
            except Exception:
                pass
                
    elif doc_type == "bank_statement":
        closing_balance = extracted_data.get("closing_balance_ngn", 0)
        required_ngn = 2476500 # ?1,270 @ 1,950 NGN/GBP
        if closing_balance < required_ngn:
            issues.append({
                "rule": "funds_check",
                "document": "bank_statement",
                "passed": False,
                "detail": f"Closing balance of ?{closing_balance:,.2f} is below the required ?{required_ngn:,.2f} (?1,270 UKVI maintenance).",
                "severity": "critical"
            })
            
    elif doc_type == "cos":
        status = extracted_data.get("cos_status", "ACTIVE")
        if status.upper() != "ACTIVE":
            issues.append({
                "rule": "cos_status",
                "document": "cos",
                "passed": False,
                "detail": f"Certificate of Sponsorship status is '{status}'. Must be in ACTIVE / UNASSIGNED state.",
                "severity": "critical"
            })
            
    elif doc_type == "tb_test":
        issuer = extracted_data.get("issuing_authority", "")
        if "IOM" not in issuer.upper():
            issues.append({
                "rule": "tb_test_authority",
                "document": "tb_test",
                "passed": False,
                "detail": "TB Certificate was not issued by an accredited IOM clinic (UKVI requirement for Nigerian residents).",
                "severity": "critical"
            })

    return issues
