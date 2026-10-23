# 🏗️ Updated Architecture: React + Python FastAPI

---

## Why React + Python is THE Right Choice Here

This isn't "we picked what we know." Every technology is chosen because the **workload demands it:**

| Layer | Technology | Why This Specifically |
|-------|-----------|----------------------|
| **Frontend** | React (Vite) | Component-based UI for two complex views (client portal + staff dashboard). Vite for instant HMR during hackathon development. |
| **Backend API** | Python FastAPI | FastAPI is async-native, handles concurrent AI calls without blocking. Python has the richest AI/ML ecosystem (OpenAI SDK, LangChain, pdf parsing, image processing). Type hints + Pydantic = automatic request validation + API docs. |
| **Real-time** | Socket.io (python-socketio) | Persistent WebSocket connections for live updates between client ↔ staff. python-socketio integrates directly with FastAPI's ASGI server. |
| **AI Pipeline** | Python + OpenAI SDK | The OpenAI Python SDK is the most mature and best-documented. Python's async/await handles concurrent Vision API calls cleanly. Libraries like PyPDF2, Pillow for pre-processing before AI analysis. |
| **Task Queue** | Celery + Redis | Document processing is async. Celery is the production standard for Python background tasks. Redis as broker. Workers scale horizontally. |
| **Database** | SQLite (hackathon) → PostgreSQL (prod) | SQLAlchemy ORM works with both. Zero config for hackathon. One config change for production. |

### The Judge Answer:

> *"We chose Python for the backend specifically because this system's core workload is AI-driven document processing. Python has the most mature AI SDK ecosystem — OpenAI, LangChain, pdf parsing, image processing libraries. FastAPI gives us async request handling so concurrent Vision API calls don't block the server. The compliance rules engine runs as pure Python logic — fast, testable, deterministic. React on the frontend because the UI has two complex real-time views that need component-based architecture. This isn't a monolith that happens to use Python — it's a deliberate separation where each technology handles what it's best at."*

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)                 │
│              Port 5173 (dev)                         │
│                                                      │
│  ┌────────────────────┐  ┌────────────────────────┐  │
│  │  CLIENT PORTAL     │  │  AGENCY DASHBOARD      │  │
│  │  /client           │  │  /dashboard            │  │
│  │                    │  │                         │  │
│  │  • Chat UI         │  │  • Application Cards   │  │
│  │  • Doc Upload      │  │  • Audit Cards         │  │
│  │  • Status Cards    │  │  • Diff View           │  │
│  │  • Visa Summary    │  │  • Approve/Query       │  │
│  │  • Flight Cards    │  │  • Activity Feed       │  │
│  └────────────────────┘  └────────────────────────┘  │
│                                                      │
│  HTTP requests → fetch/axios to backend API          │
│  WebSocket → socket.io-client to backend WS          │
└──────────────────────────────────────────────────────┘
          │ HTTP (REST)              │ WebSocket
          ▼                         ▼
┌──────────────────────────────────────────────────────┐
│              BACKEND (Python FastAPI)                │
│              Port 8000                               │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │              ASGI Server (Uvicorn)            │    │
│  │                                              │    │
│  │  ┌──────────────┐  ┌──────────────────────┐  │    │
│  │  │  REST API    │  │  Socket.io Server    │  │    │
│  │  │  (FastAPI)   │  │  (python-socketio)   │  │    │
│  │  │              │  │                      │  │    │
│  │  │  /api/chat   │  │  emit: doc_processed │  │    │
│  │  │  /api/docs   │  │  emit: status_update │  │    │
│  │  │  /api/apps   │  │  emit: staff_action  │  │    │
│  │  │  /api/staff  │  │                      │  │    │
│  │  │  /api/flights│  │  rooms: per-app      │  │    │
│  │  └──────┬───────┘  └──────────────────────┘  │    │
│  └─────────┼────────────────────────────────────┘    │
│            │                                         │
│  ┌─────────┴────────────────────────────────────┐    │
│  │           Service Layer                      │    │
│  │                                              │    │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────┐  │    │
│  │  │ Chat       │ │ Document   │ │Compliance│  │    │
│  │  │ Service    │ │ Service    │ │ Engine   │  │    │
│  │  │            │ │            │ │          │  │    │
│  │  │ LLM intake │ │ Upload     │ │ Rules    │  │    │
│  │  │ Slot-fill  │ │ OCR/Vision │ │ Config   │  │    │
│  │  │ Context    │ │ Extract    │ │ Validate │  │    │
│  │  └────────────┘ └────────────┘ └──────────┘  │    │
│  │                                              │    │
│  │  ┌────────────┐ ┌────────────┐               │    │
│  │  │ Application│ │ Staff      │               │    │
│  │  │ Service    │ │ Service    │               │    │
│  │  │            │ │            │               │    │
│  │  │ State mgmt │ │ Actions    │               │    │
│  │  │ Lifecycle  │ │ Overrides  │               │    │
│  │  └────────────┘ └────────────┘               │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │           Data Layer                         │    │
│  │                                              │    │
│  │  SQLAlchemy ORM → SQLite (hack) / PG (prod)  │    │
│  │  Redis (Socket.io state + future job queue)   │    │
│  │  Local filesystem (hack) / S3 (prod)          │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## Project Structure (Monorepo)

```
hackathon-project/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/            # Chat bubbles, input, typing indicator
│   │   │   ├── documents/       # Upload zone, status cards
│   │   │   ├── dashboard/       # Application cards, audit cards
│   │   │   ├── visa/            # Summary card, diff view
│   │   │   ├── flights/         # Flight option cards
│   │   │   └── shared/          # Buttons, modals, loaders, layout
│   │   ├── pages/
│   │   │   ├── ClientPortal.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   └── Landing.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js     # WebSocket connection hook
│   │   │   └── useApi.js        # API call hook with loading/error
│   │   ├── services/
│   │   │   └── api.js           # All backend API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Design system
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── main.py              # FastAPI app + Socket.io mount
│   │   ├── api/
│   │   │   ├── chat.py          # POST /api/chat
│   │   │   ├── documents.py     # POST /api/documents/upload
│   │   │   ├── applications.py  # CRUD /api/applications
│   │   │   ├── staff.py         # POST /api/staff/actions
│   │   │   └── flights.py       # GET /api/flights
│   │   ├── services/
│   │   │   ├── chat_service.py       # LLM intake + slot-filling
│   │   │   ├── document_service.py   # Vision API + field extraction
│   │   │   ├── compliance_engine.py  # Deterministic rules engine
│   │   │   ├── application_service.py # State machine
│   │   │   └── flight_service.py     # Mock GDS data
│   │   ├── models/
│   │   │   ├── schemas.py       # Pydantic request/response models
│   │   │   └── database.py      # SQLAlchemy models
│   │   ├── rules/
│   │   │   ├── uk_skilled_worker.json
│   │   │   ├── us_b1_b2.json
│   │   │   └── schengen_tourist.json
│   │   ├── core/
│   │   │   ├── config.py        # Environment variables
│   │   │   └── socket_manager.py # Socket.io event handlers
│   │   └── data/
│   │       └── mock_flights.json
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## API Contract (Frontend ↔ Backend)

This is what both devs agree on FIRST, then build in parallel:

### POST /api/chat
```json
// Request
{
  "application_id": "app_123" | null,
  "message": "I'm relocating to London for Bloomberg..."
}

// Response
{
  "application_id": "app_123",
  "reply": "Great! I can help with your UK Skilled Worker visa...",
  "extracted_intent": {
    "visa_type": "uk_skilled_worker",
    "destination": "United Kingdom",
    "purpose": "employment",
    "employer": "Bloomberg LP",
    "timeline": "next month"
  },
  "checklist": [
    {"id": "passport", "label": "Valid Passport", "status": "pending"},
    {"id": "cos", "label": "Certificate of Sponsorship", "status": "pending"},
    {"id": "tb_test", "label": "TB Test Certificate", "status": "pending"},
    {"id": "bank_statement", "label": "28-Day Bank Statement", "status": "pending"}
  ],
  "stage": "intake"
}
```

### POST /api/documents/upload
```json
// Request: multipart/form-data
// Fields: application_id, doc_type, file

// Response
{
  "document_id": "doc_456",
  "doc_type": "passport",
  "status": "processing",
  "message": "Analyzing your passport..."
}

// WebSocket event (emitted when processing completes):
// Event: "document_processed"
{
  "document_id": "doc_456",
  "application_id": "app_123",
  "doc_type": "passport",
  "status": "passed" | "flagged" | "failed",
  "extracted_data": {
    "full_name": "Tunde Adeyemi",
    "passport_number": "A12345678",
    "expiry_date": "2029-03-15",
    "nationality": "Nigerian"
  },
  "confidence": 0.94,
  "issues": []  // or [{"type": "expiry_warning", "detail": "Expires in 5 months"}]
}
```

### GET /api/applications/{id}
```json
// Response
{
  "id": "app_123",
  "client_name": "Tunde Adeyemi",
  "visa_type": "uk_skilled_worker",
  "destination": "United Kingdom",
  "employer": "Bloomberg LP",
  "stage": "document_audit",
  "documents": [...],
  "compliance_result": {
    "passed": false,
    "issues": [
      {"rule": "funds_check", "passed": false, "detail": "Balance ₦14.5M < required ₦16.6M"},
      {"rule": "tb_test_quality", "passed": false, "detail": "Seal area has low confidence (0.42)"}
    ]
  },
  "created_at": "2026-10-23T20:00:00Z"
}
```

### POST /api/staff/actions
```json
// Request
{
  "application_id": "app_123",
  "action": "approve_query" | "override_issue" | "authorize_submit",
  "issue_id": "funds_check",
  "note": "Client confirmed employer covers maintenance on CoS"
}

// Response
{
  "success": true,
  "updated_stage": "review",
  "client_message": "Great news! Your consultant has verified..."
}

// WebSocket event emitted to client: "staff_action"
```

### GET /api/flights?application_id=app_123
```json
// Response
{
  "flights": [
    {
      "id": "fl_001",
      "airline": "British Airways",
      "flight_no": "BA76",
      "route": "LOS → LHR",
      "departure": "2026-11-15T22:30:00Z",
      "arrival": "2026-11-16T05:15:00Z",
      "class": "Economy",
      "price_ngn": 1850000,
      "baggage": "2 × 23kg",
      "stops": 0
    },
    ...
  ]
}
```

---

## Updated 2-Dev Work Split

### Dev A — Frontend (React + Vite)
| Task | Priority | Hours |
|------|----------|-------|
| Vite project setup + design system (colors, fonts, CSS) | 🔴 | 1.5 |
| React Router setup (/, /client, /dashboard) | 🔴 | 0.5 |
| Chat interface (bubbles, input, typing indicator, structured cards) | 🔴 | 2.5 |
| Document upload UI (drag-drop, progress, per-doc status cards) | 🔴 | 2 |
| Staff dashboard (application list, audit cards, action buttons) | 🔴 | 3 |
| Visa summary card (auto-filled form preview, diff view) | 🔴 | 1.5 |
| WebSocket integration (useSocket hook, real-time updates) | 🔴 | 1.5 |
| Flight options card | 🟡 | 1 |
| Landing/hero page | 🟡 | 1 |
| Polish + animations | 🟡 | 1 |
| **Total** | | **~16 hrs** |

### Dev B — Backend (Python FastAPI)
| Task | Priority | Hours |
|------|----------|-------|
| FastAPI project setup + Socket.io integration + CORS | 🔴 | 1 |
| Pydantic schemas + SQLAlchemy models (or in-memory store) | 🔴 | 1 |
| Chat endpoint: OpenAI integration + slot-filling prompt | 🔴 | 2.5 |
| Document upload endpoint + file handling | 🔴 | 1.5 |
| Document analysis: GPT-4o Vision integration + field extraction | 🔴 | 3 |
| Compliance rules engine (JSON config + validation logic) | 🔴 | 2 |
| Application state machine (stage transitions, validation) | 🔴 | 1.5 |
| Staff actions API + WebSocket event emission | 🔴 | 1.5 |
| Mock flight data endpoint | 🟡 | 0.5 |
| Prompt engineering (intake + vision prompts refinement) | 🟡 | 1 |
| **Total** | | **~16 hrs** |

---

## How to Defend "No Database" to the Judge

> *"We're using SQLite through SQLAlchemy ORM for the hackathon. The reason we chose SQLAlchemy is that our models and queries are database-agnostic — switching to PostgreSQL is a connection string change, not a code change. We deliberately chose NOT to spend hackathon time on database infrastructure because the innovation is in the AI pipeline and the workflow architecture, not in CRUD operations. The data model is designed for PostgreSQL in production: we have proper foreign keys, JSONB columns for flexible document data, and the schema supports row-level security for multi-tenant agency isolation."*

---

> [!IMPORTANT]
> **First 30 minutes:** Both devs agree on the API contract above, set up their respective projects, confirm CORS + Socket.io connection works between them. Then go heads-down in parallel.
