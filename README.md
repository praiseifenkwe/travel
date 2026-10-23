# ?? TravelForge ? AI-Native Visa & Relocation Operating System

> **Theme**: Re-imagining the AI-Native Digital Universe  
> **Mission**: Transforming a manual, 3-week, high-stress visa & travel process into an intelligent, transparent, 15-minute orchestrated workflow.  
> **Stack**: React (Vite) + Python FastAPI + PostgreSQL + Redis + Socket.io + OpenAI GPT-4o / Vision + Deterministic Compliance Engine

---

## ?? Table of Contents
1. [Executive Summary & The 5 Demo Touchpoints](#-executive-summary--the-5-demo-touchpoints)
2. [Architecture & Tech Stack Rationale](#-architecture--tech-stack-rationale)
3. [Repository Structure](#-repository-structure)
4. [2-Developer Work Split & Milestones](#-2-developer-work-split--milestones)
5. [API Contract & WebSocket Protocol](#-api-contract--websocket-protocol)
6. [PostgreSQL Database Schema](#-postgresql-database-schema)
7. [Developer Setup & Quickstart](#-developer-setup--quickstart)
8. [Judge Defense Cheat Sheet](#-judge-defense-cheat-sheet)

---

## ?? Executive Summary & The 5 Demo Touchpoints

Traditional visa processing and international travel logistics are plagued by fragmented email threads, manual document scrutiny, unexpected embassy rejections due to subtle formatting or balance shortfalls, and chaotic agency back-offices.

**TravelForge** re-imagines this experience through a dual-interface AI platform:
1. **Intelligent Client Portal (`/client`)**: Multimodal conversational intake (handling Nigerian English & natural phrasing), automated document verification via GPT-4o Vision, instant compliance audits, and live status syncing.
2. **Agency Control Center (`/dashboard`)**: Human-in-the-Loop (HITL) gatekeeper dashboard. Agency consultants review AI discrepancy audits, execute side-by-side OCR diff checks, and resolve queries or authorize submissions in real-time.

### The 5 Things That ARE The Demo:
1. **Chat Intake**: Client types natural relocation intent ? AI parses intent ? generates structured interactive checklist.
2. **Document Upload & AI Vision**: Client uploads passport/CoS/bank statements ? GPT-4o Vision extracts fields & flags discrepancies.
3. **Deterministic Compliance Check**: Rules engine validates passport expiry, maintenance funds (in GBP/NGN), CoS validity against official visa immigration rules.
4. **Staff Dashboard (HITL)**: Agency consultant views live audit cards, reviews side-by-side OCR diffs, resolves discrepancies or queries the client.
5. **Real-time Bi-directional Sync**: Instant WebSocket communication between Client and Consultant views.

---

## ??? Architecture & Tech Stack Rationale

```
??????????????????????????????????????????????????????????
?               FRONTEND: React + Vite (Port 5173)       ?
?                                                        ?
?   ???????????????????????????  ??????????????????????  ?
?   ?  Client Portal          ?  ?  Agency Dashboard  ?  ?
?   ?  (/client)              ?  ?  (/dashboard)      ?  ?
?   ?  ? Chat & Intent NLU    ?  ?  ? Pipeline View   ?  ?
?   ?  ? Live Doc Audit       ?  ?  ? HITL Audit Cards?  ?
?   ?  ? Status Checklist     ?  ?  ? Form Diff Modal ?  ?
?   ?  ? Flight Options       ?  ?  ? Live Query Tool ?  ?
?   ???????????????????????????  ??????????????????????  ?
??????????????????????????????????????????????????????????
            ? REST (HTTP)                  ? WebSocket
            ?                              ?
??????????????????????????????????????????????????????????
?               BACKEND: Python FastAPI (Port 8000)      ?
?                                                        ?
?   ???????????????????????      ??????????????????????  ?
?   ? FastAPI REST API    ?      ? Socket.io Server   ?  ?
?   ? ? /api/chat         ?      ? (python-socketio)  ?  ?
?   ? ? /api/documents    ?      ? ? doc_processed    ?  ?
?   ? ? /api/applications ?      ? ? staff_action     ?  ?
?   ? ? /api/staff        ?      ? ? room-based pubsub?  ?
?   ? ? /api/flights      ?      ??????????????????????  ?
?   ???????????????????????                              ?
?                                                        ?
?   ??????????????????????????????????????????????????   ?
?   ? Service Layer                                  ?   ?
?   ? ? ChatService (GPT-4o Slot-Filling)            ?   ?
?   ? ? DocumentService (GPT-4o Vision OCR)          ?   ?
?   ? ? ComplianceEngine (Deterministic Rule Checks) ?   ?
?   ? ? ApplicationService (State Lifecycle)         ?   ?
?   ? ? FlightService (Mock GDS Flight Engine)       ?   ?
?   ??????????????????????????????????????????????????   ?
?                                                        ?
?   ??????????????????????????????????????????????????   ?
?   ? Data Layer                                     ?   ?
?   ? ? PostgreSQL 16 (Relational + JSONB indexes)   ?   ?
?   ? ? Redis 7 (Socket.io message pub/sub adapter)  ?   ?
?   ? ? Local / S3 File Storage                      ?   ?
?   ??????????????????????????????????????????????????   ?
??????????????????????????????????????????????????????????
```

### Why React + Python FastAPI is THE Right Choice

| Layer | Technology | Why This Specifically |
|---|---|---|
| **Frontend** | React (Vite) | Component-based dual views (client portal + staff dashboard). Instant HMR. Pure CSS design system for maximum control & visual wow factor. |
| **Backend API** | Python FastAPI | Async-native ASGI, non-blocking concurrent LLM & Vision API calls. Pydantic v2 automatic schema validation and OpenAPI docs. |
| **AI Pipeline** | OpenAI GPT-4o & Vision | Python has the premier AI/ML ecosystem. Async requests pre-process images/PDFs before multi-modal reasoning. |
| **Compliance** | Deterministic Python Rules | Pure, testable, deterministic rule verification. Prevents hallucinations on critical legal immigration thresholds. |
| **Real-time** | Socket.io (`python-socketio`) | Persistent WebSockets with rooms per application. Instant push updates between Client and Staff. |
| **Database** | PostgreSQL 16 | Production-ready relational schema with JSONB columns for flexible OCR metadata and document extraction. |
| **Cache / Broker** | Redis 7 | Socket.io scale-out adapter and background job queuing. |

---

## ?? Repository Structure

```
travel/
??? frontend/                          # React + Vite (Dev A Lead)
?   ??? public/                        # Static assets & icons
?   ??? src/
?   ?   ??? components/
?   ?   ?   ??? chat/                  # ChatContainer, MessageBubble, ChecklistCard, ChatInput
?   ?   ?   ??? documents/             # UploadZone, DocumentCard, AuditBadge, IssueModal
?   ?   ?   ??? dashboard/             # ApplicationList, AuditCard, DiffViewerModal, StatsHeader
?   ?   ?   ??? visa/                  # VisaSummaryCard, ExtractedFieldsTable
?   ?   ?   ??? flights/               # FlightCards, BaggageBadge
?   ?   ?   ??? shared/                # Navbar, Badge, Button, LoadingSpinner
?   ?   ??? pages/
?   ?   ?   ??? ClientPortal.jsx       # Client chat + document audit + checklist
?   ?   ?   ??? StaffDashboard.jsx     # Staff HITL review & approval center
?   ?   ?   ??? Landing.jsx            # High-conversion hero page
?   ?   ??? hooks/
?   ?   ?   ??? useSocket.js           # Real-time WebSocket connection hook
?   ?   ?   ??? useApi.js              # API fetch hook with loading & error states
?   ?   ??? services/
?   ?   ?   ??? api.js                 # Axios / Fetch client for REST endpoints
?   ?   ?   ??? socket.js              # Socket.io client setup & room subscriptions
?   ?   ??? App.jsx                    # Routing configuration
?   ?   ??? main.jsx                   # Application entrypoint
?   ?   ??? index.css                  # Ultra-premium dark theme & glassmorphic design system
?   ??? package.json
?   ??? vite.config.js
?   ??? index.html
?   ??? .env.example
?
??? backend/                           # Python FastAPI (Dev B Lead + Dev A Support)
?   ??? app/
?   ?   ??? main.py                    # FastAPI app + Socket.io ASGI mount + CORS
?   ?   ??? api/
?   ?   ?   ??? __init__.py
?   ?   ?   ??? chat.py                # POST /api/chat
?   ?   ?   ??? documents.py           # POST /api/documents/upload, GET /api/documents/{id}
?   ?   ?   ??? applications.py        # GET /api/applications, GET /api/applications/{id}
?   ?   ?   ??? staff.py               # POST /api/staff/actions
?   ?   ?   ??? flights.py             # GET /api/flights
?   ?   ??? services/
?   ?   ?   ??? __init__.py
?   ?   ?   ??? chat_service.py        # LLM intake & slot-filling prompt engine
?   ?   ?   ??? document_service.py    # GPT-4o Vision OCR & field extraction
?   ?   ?   ??? compliance_engine.py   # Deterministic rules evaluation
?   ?   ?   ??? application_service.py # State machine & lifecycle management
?   ?   ?   ??? flight_service.py      # Mock GDS flight engine
?   ?   ??? models/
?   ?   ?   ??? __init__.py
?   ?   ?   ??? database.py            # SQLAlchemy async models & session factory
?   ?   ?   ??? schemas.py             # Pydantic v2 validation models
?   ?   ??? rules/
?   ?   ?   ??? uk_skilled_worker.json # UKVI Skilled Worker rule definitions
?   ?   ?   ??? us_b1_b2.json          # US B1/B2 Visitor Visa rules
?   ?   ?   ??? schengen_tourist.json  # Schengen Tourist Visa rules
?   ?   ??? core/
?   ?   ?   ??? __init__.py
?   ?   ?   ??? config.py              # Environment variables & Pydantic settings
?   ?   ?   ??? socket_manager.py      # Socket.io server instance & event handlers
?   ?   ??? data/
?   ?       ??? mock_flights.json      # GDS realistic flight routes & pricing
?   ??? uploads/                       # Document storage directory
?   ??? requirements.txt
?   ??? .env.example
?   ??? run.py
?
??? docker-compose.yml                 # PostgreSQL 16 + Redis 7
??? .gitignore
??? README.md
```

---

## ?? 2-Developer Work Split & Milestones

### Overview of Roles:
- **Dev A (Frontend Lead + Shared Backend)**: Owns the entire React (Vite) frontend, design system, real-time client experience, and agency dashboard. Also collaborates with Dev B on Backend tasks like **Compliance Rules configuration** (`rules/*.json`), **Flight service**, and **Mock seed data**.
- **Dev B (Backend Lead)**: Owns the FastAPI ASGI server, PostgreSQL database models, OpenAI GPT-4o slot-filling & Vision pipeline, and Socket.io event emissions.

```
M0: Foundation          ????????????????????  [1.5 hrs]  BOTH
M1: Chat Intake         ????????????????????  [2.5 hrs]  PARALLEL
M2: Document Intel      ????????????????????  [3.0 hrs]  PARALLEL (Dev A assists on Rules)
M3: Staff Dashboard     ????????????????????  [3.0 hrs]  PARALLEL
M4: Integration         ????????????????????  [2.0 hrs]  TOGETHER
M5: Polish + Demo       ????????????????????  [1.5 hrs]  BOTH
```

---

### MILESTONE 0: Foundation (1.5 Hours) ? BOTH
**Goal**: Database running, backend healthcheck passing, frontend rendering, WebSocket handshake confirmed.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev B** | Docker & DB Init | Run `docker-compose up -d` (Postgres + Redis). Configure SQLAlchemy async engine. | `docker-compose ps` shows healthy; DB connects. |
| **Dev B** | FastAPI + Socket.io | Scaffold `app/main.py`, CORS middleware, mount Socket.io ASGI app. | `curl http://localhost:8000/api/health` returns `{"status": "ok"}`. |
| **Dev A** | Vite + Design System | Setup React + Vite, router (`/`, `/client`, `/dashboard`), dark glassmorphic CSS tokens in `index.css`. | App runs on `http://localhost:5173` with dark styling. |
| **Dev A & B** | WebSocket Handshake | Connect `useSocket.js` to `http://localhost:8000`. | Terminal logs: `"Client connected: <sid>"`. |

---

### MILESTONE 1: Conversational Intake (2.5 Hours) ? PARALLEL
**Goal**: Client can chat natural language relocation plans; system extracts intent, creates application record, and returns structured checklist.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev B** | Chat Endpoint & NLU | Implement `POST /api/chat` with OpenAI GPT-4o system prompt for slot-filling (visa type, destination, employer, timeline). | Returns structured JSON with `application_id` and `checklist`. |
| **Dev A** | Chat Interface | Build `ChatContainer.jsx`, `MessageBubble.jsx`, interactive checklist cards, and typing indicators. | Natural conversation renders cleanly with auto-scroll and checklist updates. |

---

### MILESTONE 2: Document Intelligence & Compliance (3.0 Hours) ? PARALLEL
**Goal**: Client uploads passport/CoS/bank statement; GPT-4o Vision extracts fields; compliance engine flags rule violations; WebSocket emits status.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev B** | Upload API & Vision | Implement `POST /api/documents/upload`, base64 image parsing, GPT-4o Vision prompt for field extraction & confidence scoring. | Extracted fields saved to PostgreSQL `documents.extracted_data`. |
| **Dev B + Dev A** | Compliance Rules Engine | Dev B builds deterministic evaluation engine; Dev A crafts the rule definitions (`uk_skilled_worker.json`, `us_b1_b2.json`). | Discrepancies (e.g. balance < ?1,270, passport < 6 months validity) flagged deterministically. |
| **Dev A** | Upload & Audit UI | Build drag-and-drop `UploadZone.jsx`, document status cards (processing spinner, green check, red alert flag). | Real-time `document_processed` WebSocket event updates document card instantly. |

---

### MILESTONE 3: Staff Dashboard & HITL Gatekeeping (3.0 Hours) ? PARALLEL
**Goal**: Consultant can monitor applications in real-time, inspect discrepancy audits, view side-by-side OCR diffs, and approve/query.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev B** | Staff Actions API | Implement `GET /api/applications`, `GET /api/applications/{id}`, and `POST /api/staff/actions` with WebSocket broadcast. | Consultant action emits `staff_action` event to applicant room. |
| **Dev A** | Agency Dashboard UI | Build `StaffDashboard.jsx`, application pipeline table, audit issue cards with `Approve Query` and `Authorize Submission` buttons. | Consultant actions update the card and send instant notification to client view. |
| **Dev A** | Form Diff Modal | Side-by-side comparison modal showing applicant input vs OCR-extracted data with highlight on mismatches. | Modal cleanly renders field discrepancies. |

---

### MILESTONE 4: Flight Engine & Integration (2.0 Hours) ? TOGETHER
**Goal**: Complete end-to-end relocation flow including flight booking card, timeline tracker, and state machine transitions.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev A + Dev B** | Flight Service & UI | Dev B/A creates `GET /api/flights`; Dev A builds `FlightCards.jsx` with airline badges, baggage allowances, and NGN pricing. | Flights display upon visa approval or query resolution. |
| **Dev A & Dev B** | Bi-directional Sync | Dual-browser test: Client in left window, Consultant in right window. | Upload in Client reflects in Staff within 500ms; Staff action reflects in Client instantly. |

---

### MILESTONE 5: Polish & Demo Rehearsal (1.5 Hours) ? BOTH
**Goal**: Zero friction demo, flawless visuals, responsive layout, rehearsed pitch answers.

| Developer | Task | Description | Done When |
|---|---|---|---|
| **Dev A** | Micro-animations & Aesthetics | Smooth transitions, glassmorphic glows, Toast notifications, empty states. | UI looks breathtaking and premium. |
| **Dev B** | Seed Script & Fallbacks | Create deterministic seed data and offline fallback mocks for LLM in case of Wi-Fi latency. | 100% deterministic demo run without network drops. |
| **Both** | Pitch & Judge Dry-Run | Rehearse 3-minute pitch covering the 5 touchpoints and judge defense answers. | Smooth delivery under 3 minutes. |

---

## ?? API Contract & WebSocket Protocol

### 1. Conversational Intake: `POST /api/chat`
**Request Body**:
```json
{
  "application_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "message": "I'm relocating to London next month to join Bloomberg as a Senior Software Engineer. I need a Skilled Worker visa."
}
```
**Response (200 OK)**:
```json
{
  "application_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "reply": "Congratulations on the Bloomberg offer! For a UK Skilled Worker visa, we need to gather 4 mandatory documents to verify against UKVI requirements:",
  "extracted_intent": {
    "visa_type": "uk_skilled_worker",
    "destination": "United Kingdom",
    "purpose": "employment",
    "employer": "Bloomberg LP",
    "timeline": "next month"
  },
  "checklist": [
    {"id": "passport", "label": "International Passport", "status": "pending", "required": true},
    {"id": "cos", "label": "Certificate of Sponsorship (CoS)", "status": "pending", "required": true},
    {"id": "tb_test", "label": "IOM TB Test Certificate", "status": "pending", "required": true},
    {"id": "bank_statement", "label": "28-Day Bank Statement (?1,270 maintenance)", "status": "pending", "required": true}
  ],
  "stage": "intake"
}
```

---

### 2. Document Upload: `POST /api/documents/upload`
**Request**: `multipart/form-data`
- `application_id`: `"3fa85f64-5717-4562-b3fc-2c963f66afa6"`
- `doc_type`: `"passport" | "cos" | "tb_test" | "bank_statement"`
- `file`: `[Binary File (PDF, PNG, JPG)]`

**Immediate HTTP Response (202 Accepted)**:
```json
{
  "document_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "doc_type": "passport",
  "status": "processing",
  "message": "Document received. OCR extraction & compliance check in progress."
}
```

**Asynchronous WebSocket Emission**: `event: document_processed`
```json
{
  "document_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "application_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doc_type": "passport",
  "status": "flagged",
  "extracted_data": {
    "full_name": "Tunde Adeyemi",
    "passport_number": "A12345678",
    "expiry_date": "2027-02-14",
    "nationality": "Nigerian"
  },
  "confidence": 0.96,
  "issues": [
    {
      "rule": "passport_validity_period",
      "passed": false,
      "detail": "Passport has less than 6 months validity remaining from intended travel date."
    }
  ]
}
```

---

### 3. Application Detail: `GET /api/applications/{id}`
**Response (200 OK)**:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "client_name": "Tunde Adeyemi",
  "visa_type": "uk_skilled_worker",
  "destination": "United Kingdom",
  "employer": "Bloomberg LP",
  "stage": "document_audit",
  "compliance_result": {
    "passed": false,
    "total_checks": 6,
    "passed_checks": 4,
    "issues": [
      {
        "rule": "funds_check",
        "document": "bank_statement",
        "detail": "Closing balance of ?14,500,000 does not satisfy the 28-day continuous threshold (?1,270 @ ?1,950/? = ?2,476,500 for dependent + applicant)."
      }
    ]
  },
  "created_at": "2026-10-23T20:00:00Z"
}
```

---

### 4. Staff Action: `POST /api/staff/actions`
**Request Body**:
```json
{
  "application_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "action": "override_issue",
  "issue_id": "funds_check",
  "note": "Maintenance certified by employer under section A2 of Certificate of Sponsorship."
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "updated_stage": "ready_for_submission",
  "client_message": "Your immigration consultant has verified your employer maintenance guarantee. Compliance cleared!"
}
```

---

### 5. Flight Options: `GET /api/flights?application_id={id}`
**Response (200 OK)**:
```json
{
  "flights": [
    {
      "id": "fl_001",
      "airline": "British Airways",
      "flight_no": "BA76",
      "route": "LOS (Lagos) ? LHR (London Heathrow)",
      "departure": "2026-11-15T22:30:00Z",
      "arrival": "2026-11-16T05:15:00Z",
      "cabin": "Economy",
      "price_ngn": 1850000,
      "baggage": "2 ? 23kg standard allowance",
      "stops": 0
    },
    {
      "id": "fl_002",
      "airline": "Virgin Atlantic",
      "flight_no": "VS412",
      "route": "LOS (Lagos) ? LHR (London Heathrow)",
      "departure": "2026-11-16T10:15:00Z",
      "arrival": "2026-11-16T17:00:00Z",
      "cabin": "Economy",
      "price_ngn": 1795000,
      "baggage": "2 ? 23kg standard allowance",
      "stops": 0
    }
  ]
}
```

---

## ??? PostgreSQL Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    visa_type VARCHAR(50) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    employer VARCHAR(255),
    travel_timeline VARCHAR(100),
    stage VARCHAR(50) NOT NULL DEFAULT 'intake',
    compliance_passed BOOLEAN DEFAULT FALSE,
    compliance_summary JSONB DEFAULT '{}',
    extracted_profile JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(50),
    file_size_bytes INTEGER,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    extracted_data JSONB DEFAULT '{}',
    ai_confidence FLOAT,
    issues JSONB DEFAULT '[]',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user' | 'assistant' | 'system'
    content TEXT NOT NULL,
    message_type VARCHAR(30) DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Audit Trail
CREATE TABLE staff_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    staff_id UUID,
    action_type VARCHAR(50) NOT NULL,
    target_document_id UUID REFERENCES documents(id),
    target_issue_type VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ?? Developer Setup & Quickstart

### Prerequisites
- **Docker & Docker Compose** (for PostgreSQL 16 & Redis 7)
- **Node.js 18+ & npm** (for React Vite)
- **Python 3.10+** (for FastAPI backend)

---

### Step 1: Start Infrastructure (PostgreSQL & Redis)
In root directory:
```bash
docker-compose up -d
```
Verify both containers are running:
```bash
docker-compose ps
```
*(PostgreSQL running on `localhost:5432`, Redis running on `localhost:6379`)*

---

### Step 2: Backend Setup (Dev B Lead + Dev A Support)
In a new terminal:
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
# Fill in OPENAI_API_KEY if testing live LLM

# Run the FastAPI server
python run.py
```
Backend runs at: **`http://localhost:8000`**  
Swagger API Docs: **`http://localhost:8000/docs`**

---

### Step 3: Frontend Setup (Dev A Lead)
In a separate terminal:
```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```
Frontend runs at: **`http://localhost:5173`**  
- **Client Portal**: `http://localhost:5173/client`  
- **Agency Staff Dashboard**: `http://localhost:5173/dashboard`  
- **Landing Page**: `http://localhost:5173/`

---

## ??? Judge Defense Cheat Sheet

### 1. "Why not just use an all-in-one AI agent to submit the visa?"
> *"Visas carry severe legal and irreversible financial consequences; a single AI hallucination leads to an immediate 10-year ban under UKVI Section 320. TravelForge uses AI for ingestion, OCR extraction, and synthesis, but pairs it with a deterministic Python compliance rules engine and Human-in-the-Loop approval gates. AI accelerates 80% of the busywork; licensed agency consultants make the final call."*

### 2. "Why React + Python FastAPI instead of Next.js for everything?"
> *"The heavy lifting of this system is asynchronous AI document processing, OCR computer vision, and structured rule evaluation. Python is the unmatched industry standard for AI SDKs and async data processing. FastAPI gives us native ASGI concurrency so long-running LLM vision calls never block HTTP threads or WebSocket handshakes. React Vite gives us a responsive, reactive dual-screen operational interface."*

### 3. "How does this scale to millions of travelers?"
> *"Our architecture decouples ingestion from compute. File uploads stream directly to object storage with presigned URLs. Document processing jobs run on decoupled Celery/Redis workers. Our WebSocket server uses Redis Pub/Sub adapters so connections scale horizontally across nodes. PostgreSQL JSONB indexes ensure sub-10ms lookup speeds even under millions of application records."*

### 4. "Why PostgreSQL from day one instead of SQLite?"
> *"Production AI document platforms store heterogeneous OCR outputs and compliance trees alongside relational audit trails. PostgreSQL gives us strict relational ACID guarantees for compliance audits plus native JSONB indexing for flexible document extractions. We don't write toy prototypes that need rewriting on day two."*

---

*Built for the PAU Hackathon ? Re-imagining the AI-Native Digital Universe.*
