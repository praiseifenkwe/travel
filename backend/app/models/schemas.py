from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Chat Schemas
class ChatRequest(BaseModel):
    application_id: Optional[str] = None
    message: str

class ChecklistItem(BaseModel):
    id: str
    label: str
    status: str = "pending" # pending, uploaded, verified, flagged
    required: bool = True

class ExtractedIntent(BaseModel):
    visa_type: Optional[str] = None
    destination: Optional[str] = None
    purpose: Optional[str] = None
    employer: Optional[str] = None
    timeline: Optional[str] = None
    client_name: Optional[str] = None

class ChatResponse(BaseModel):
    application_id: str
    reply: str
    extracted_intent: ExtractedIntent
    checklist: List[ChecklistItem]
    stage: str

# Document Schemas
class DocumentUploadResponse(BaseModel):
    document_id: str
    application_id: str
    doc_type: str
    status: str
    message: str

class IssueDetail(BaseModel):
    rule: str
    document: Optional[str] = None
    passed: bool
    detail: str
    severity: str = "critical" # critical, warning, info

class DocumentProcessedEvent(BaseModel):
    document_id: str
    application_id: str
    doc_type: str
    status: str
    extracted_data: Dict[str, Any]
    confidence: float
    issues: List[IssueDetail]

# Application Schemas
class ApplicationResponse(BaseModel):
    id: str
    client_name: str
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    visa_type: str
    destination: str
    employer: Optional[str] = None
    travel_timeline: Optional[str] = None
    stage: str
    compliance_passed: bool
    compliance_summary: Dict[str, Any]
    extracted_profile: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    documents: Optional[List[Dict[str, Any]]] = None

# Staff Schemas
class StaffActionRequest(BaseModel):
    application_id: str
    action: str # approve_query, override_issue, authorize_submit
    issue_id: Optional[str] = None
    note: Optional[str] = None

class StaffActionResponse(BaseModel):
    success: bool
    updated_stage: str
    client_message: str

# Flight Schemas
class FlightOption(BaseModel):
    id: str
    airline: str
    flight_no: str
    route: str
    departure: str
    arrival: str
    cabin: str
    price_ngn: int
    baggage: str
    stops: int

class FlightListResponse(BaseModel):
    application_id: Optional[str] = None
    destination: str
    flights: List[FlightOption]
