# 🎯 Execution Plan — Milestone-Based

> **Current time:** ~8:45 PM  
> **Estimated remaining build time:** ~12 hours  
> **Team:** Dev A (Frontend/React) + Dev B (Backend/Python)  
> **Database:** PostgreSQL (production-grade, no shortcuts)

---

## Overview: 6 Milestones

```
M0: Foundation          ██░░░░░░░░░░░░░░░░░░  [1.5 hrs]  BOTH
M1: Chat Intake         ████░░░░░░░░░░░░░░░░  [2.5 hrs]  PARALLEL
M2: Document Intel      ████████░░░░░░░░░░░░  [3.0 hrs]  PARALLEL
M3: Staff Dashboard     ████████████░░░░░░░░  [3.0 hrs]  PARALLEL
M4: Integration         ████████████████░░░░  [2.0 hrs]  TOGETHER
M5: Polish + Demo       ████████████████████  [1.5 hrs]  BOTH
                        ────────────────────
                        Total: ~13.5 hrs (buffer included)
```

---

## MILESTONE 0: Foundation
**Duration:** 1.5 hours  
**Goal:** Both projects running, database connected, WebSocket handshake confirmed  
**Both devs work on this together before splitting**

### Dev B (Backend) Tasks:

| # | Task | Detail | Done When |
|---|------|--------|-----------|
| B0.1 | Create project directory | `mkdir hackathon && cd hackathon && mkdir backend frontend` | Directory exists |
| B0.2 | Init Python project | `cd backend && python -m venv venv && pip install fastapi uvicorn python-socketio sqlalchemy asyncpg alembic openai python-multipart python-dotenv pydantic` | All packages installed, `requirements.txt` generated |
| B0.3 | FastAPI app scaffold | Create `app/main.py` with FastAPI app, CORS middleware (allow `localhost:5173`), health check endpoint `GET /api/health` | `curl localhost:8000/api/health` returns `{"status": "ok"}` |
| B0.4 | Socket.io mount | Integrate `python-socketio` AsyncServer with FastAPI ASGI app. Add `connect`/`disconnect` event handlers that log connections. | Frontend can connect to `ws://localhost:8000` and see "connected" log on backend |
| B0.5 | PostgreSQL setup | Create database `travelforge` in local PostgreSQL. Configure SQLAlchemy async engine with `asyncpg`. Create `app/models/database.py` with engine + session factory. | `SELECT 1` works through SQLAlchemy |
| B0.6 | Database schema + migration | Define all SQLAlchemy models (see schema below). Run initial Alembic migration to create tables. | All tables exist in PostgreSQL |
| B0.7 | Create `.env` | `DATABASE_URL`, `OPENAI_API_KEY`, `CORS_ORIGIN` | Environment loads correctly |

### Dev A (Frontend) Tasks:

| # | Task | Detail | Done When |
|---|------|--------|-----------|
| A0.1 | Init React project | `cd frontend && npm create vite@latest . -- --template react` | Vite dev server runs on `localhost:5173` |
| A0.2 | Install dependencies | `npm install socket.io-client react-router-dom axios react-dropzone lucide-react` | All packages in `package.json` |
| A0.3 | Project structure | Create folder structure: `components/`, `pages/`, `hooks/`, `services/`, `styles/` | Folders exist |
| A0.4 | Design system | Create `index.css` with CSS custom properties: color palette (dark theme), typography (Inter font), spacing scale, component base styles | Root styles render correctly |
| A0.5 | Router setup | React Router with 3 routes: `/` (Landing), `/client` (ClientPortal), `/dashboard` (StaffDashboard) | Navigation between routes works |
| A0.6 | Socket.io hook | Create `useSocket.js` hook that connects to `ws://localhost:8000`, handles connect/disconnect/reconnect | Console shows "connected" when navigating to any page |
| A0.7 | API service | Create `services/api.js` with axios instance pointed at `http://localhost:8000/api` | Ready for endpoint calls |

### 🔄 SYNC POINT (Both devs confirm):
- [ ] Frontend hits `GET /api/health` and gets `{"status": "ok"}`
- [ ] Frontend Socket.io connects and backend logs the connection
- [ ] PostgreSQL tables are created and visible

---

## PostgreSQL Schema (Production-Grade)

```sql
-- applications: core entity, one per visa request
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    visa_type VARCHAR(100) NOT NULL,        -- 'uk_skilled_worker', 'us_b1_b2', etc.
    destination VARCHAR(100) NOT NULL,
    purpose VARCHAR(50) NOT NULL,           -- 'employment', 'study', 'tourism'
    employer VARCHAR(255),
    timeline VARCHAR(100),
    
    stage VARCHAR(50) NOT NULL DEFAULT 'intake',  
    -- stages: intake → documents → audit → review → approved → submitted
    
    intake_data JSONB DEFAULT '{}',         -- raw parsed intent from chat
    compliance_result JSONB,                -- latest compliance check result
    
    assigned_staff_id UUID,
    agency_id UUID,                         -- multi-tenant support
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- documents: one per uploaded file
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL,          -- 'passport', 'cos', 'tb_test', 'bank_statement'
    file_path VARCHAR(500) NOT NULL,        -- local path (hack) / S3 URL (prod)
    original_filename VARCHAR(255),
    mime_type VARCHAR(50),
    file_size_bytes INTEGER,
    
    status VARCHAR(30) NOT NULL DEFAULT 'pending',  
    -- statuses: pending → processing → passed → flagged → failed
    
    extracted_data JSONB,                   -- AI-extracted fields
    ai_confidence FLOAT,                    -- overall confidence 0.0-1.0
    issues JSONB DEFAULT '[]',             -- [{type, detail, severity}]
    
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- chat_messages: conversation history
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,              -- 'client', 'assistant', 'system', 'staff'
    content TEXT NOT NULL,
    message_type VARCHAR(30) DEFAULT 'text', -- 'text', 'checklist', 'status_card', 'summary'
    metadata JSONB,                         -- structured data for card messages
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- staff_actions: audit trail of every human decision
CREATE TABLE staff_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    staff_id UUID,
    action_type VARCHAR(50) NOT NULL,       -- 'approve_query', 'override_issue', 'authorize_submit'
    target_document_id UUID REFERENCES documents(id),
    target_issue_type VARCHAR(50),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_applications_stage ON applications(stage);
CREATE INDEX idx_applications_agency ON applications(agency_id);
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_chat_messages_application ON chat_messages(application_id);
CREATE INDEX idx_staff_actions_application ON staff_actions(application_id);
```

**Why this schema specifically:**
- **UUIDs** not auto-increment integers: prevents ID enumeration attacks, works with distributed systems
- **JSONB columns** for `extracted_data`, `compliance_result`, `issues`: semi-structured data that varies per visa type — JSONB is queryable AND flexible
- **Indexes** on `stage`, `status`, `application_id`: the three most common query patterns (staff filtering by stage, document status queries, per-application lookups)
- **Foreign keys with CASCADE**: delete an application → all its documents, messages, and actions cascade. Data integrity guaranteed at database level.
- **`agency_id`**: multi-tenant ready from day one. Row-level security can be added on top.

---

## MILESTONE 1: Chat Intake System
**Duration:** 2.5 hours  
**Goal:** Client can type a message, AI parses intent, returns structured checklist  
**Devs work in parallel**

### Dev B (Backend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| B1.1 | Chat schemas | B0.6 | Pydantic models: `ChatRequest(application_id, message)`, `ChatResponse(application_id, reply, extracted_intent, checklist, stage)` | Schemas validate correctly |
| B1.2 | Chat service | B0.7 | `services/chat_service.py`: Takes user message → calls OpenAI GPT-4o with system prompt → extracts visa type, destination, employer, timeline → returns structured response. System prompt must handle Nigerian English and Pidgin. | Given "I need UK work visa for Bloomberg", returns structured intent with visa_type="uk_skilled_worker" |
| B1.3 | Chat API endpoint | B1.1, B1.2 | `POST /api/chat`: receives message, calls chat service, saves message + AI response to `chat_messages` table, creates application if first message, returns response | Postman/curl returns structured JSON with parsed intent |
| B1.4 | Application creation | B1.3 | When first message in a conversation → create application row in DB with parsed intent data, return `application_id` | Application row exists in PostgreSQL after first chat |
| B1.5 | Chat history endpoint | B1.4 | `GET /api/chat/{application_id}` — returns all messages for an application in order | Returns message array |

### Dev A (Frontend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| A1.1 | Chat layout | A0.4 | ClientPortal page with left sidebar (application status) + main chat area + input bar at bottom. Dark theme, premium feel. | Layout renders, responsive |
| A1.2 | Message bubbles | A1.1 | Component for client messages (right-aligned, accent color) and AI messages (left-aligned, darker bg). Support text + structured card types. | Both bubble types render |
| A1.3 | Chat input | A1.2 | Text input with send button. Shift+Enter for newline. Send on Enter. Typing indicator when waiting for AI response. | Can type and "send" (local state for now) |
| A1.4 | Checklist card | A1.2 | Special message component for the document checklist the AI returns. Shows icons (📄🏥🏦), document names, status indicators (pending/uploaded/passed/failed). | Renders a checklist with mock data |
| A1.5 | Connect to API | A0.7, B1.3 ready | Wire chat input → `POST /api/chat` → display response. Handle loading state. Store `application_id` from first response. | Type a message → get real AI response → see it in chat |

### 🔄 SYNC POINT:
- [ ] Client types "I need a UK work visa for Bloomberg" → sees AI response with parsed intent + document checklist
- [ ] Application exists in PostgreSQL
- [ ] Chat history persists on page reload (via GET endpoint)

---

## MILESTONE 2: Document Intelligence Pipeline
**Duration:** 3 hours  
**Goal:** Client uploads documents, AI analyzes them, flags issues, compliance engine validates  
**Devs work in parallel**

### Dev B (Backend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| B2.1 | Document upload endpoint | B0.6 | `POST /api/documents/upload`: receives multipart file + application_id + doc_type. Saves file to `./uploads/{app_id}/{doc_type}_{timestamp}.ext`. Creates document row with status="pending". | File saved, DB row created, returns document_id |
| B2.2 | Document analysis service | B0.7 | `services/document_service.py`: Takes file path → reads file → sends to GPT-4o Vision API with doc-type-specific prompt → extracts fields → returns structured data with confidence scores. Separate prompts for passport, bank statement, CoS, TB test. | Given a passport image, extracts name, number, expiry, nationality with confidence scores |
| B2.3 | Analysis trigger | B2.1, B2.2 | After upload, call document analysis service (async — use `asyncio.create_task`). Update document row: status → "processing" → "passed"/"flagged"/"failed". Emit WebSocket event `document_processed` to the application room. | Upload → processing → result appears, WebSocket event fires |
| B2.4 | Compliance engine | — | `services/compliance_engine.py`: Loads visa rules from JSON config. Takes application + all documents → checks every rule → returns pass/fail per rule with details. Pure Python logic, NO AI. | Given parsed documents for UK Skilled Worker, correctly identifies funds gap and flags it |
| B2.5 | Compliance trigger | B2.3, B2.4 | After ALL required documents for a visa type are processed → auto-run compliance engine → save result to application.compliance_result → update stage to "audit" → emit WebSocket event `compliance_complete` | After 4th document processed, compliance runs automatically |
| B2.6 | Visa rules config | — | Create `rules/uk_skilled_worker.json` with real UKVI requirements: passport validity, funds thresholds (£1,270 main, £285 dependent), document requirements, TB test validity, CoS status | JSON file with accurate rules |

### Dev A (Frontend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| A2.1 | Upload zone | A0.2 | Drag-and-drop area (react-dropzone) inside chat. When checklist is shown, each document has an upload button. Accepts PDF, JPG, PNG. Shows file preview + progress bar. | Can drag file, see preview, shows uploading state |
| A2.2 | Document status card | A2.1 | After upload, show a card in chat for each document: icon + filename + status (processing spinner → result). Green check for passed, yellow warning for flagged, red X for failed. | Status card updates from "processing" to result |
| A2.3 | Issue detail cards | A2.2 | When a document is flagged, show expandable issue details: what's wrong, what's needed, severity. E.g., "⚠️ Bank balance ₦14.5M is ₦2.1M below required threshold" | Issue cards render with clear, actionable text |
| A2.4 | WebSocket listeners | A0.6 | Listen for `document_processed` and `compliance_complete` events. Update chat with new status cards automatically. | Upload doc → see spinner → automatically see result card appear without refreshing |
| A2.5 | Compliance summary | A2.4 | After all docs processed, show a compliance summary card in chat: overall pass/fail + per-rule breakdown. If failed, show what client needs to do. | Summary card appears automatically after all docs uploaded |

### 🔄 SYNC POINT:
- [ ] Upload a passport image → see "processing" → see extracted fields (name, number, expiry) appear
- [ ] Upload a bank statement → AI detects funds gap → issue card shows in chat
- [ ] After all 4 docs uploaded → compliance engine runs → summary card appears
- [ ] All updates happen via WebSocket (no page refresh)

---

## MILESTONE 3: Staff Dashboard + HITL Gates
**Duration:** 3 hours  
**Goal:** Staff sees all applications, reviews AI-flagged issues, takes actions that update client in real-time  
**Devs work in parallel**

### Dev B (Backend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| B3.1 | Applications list endpoint | B0.6 | `GET /api/applications` — returns all applications with latest status, document count, issue count. Supports filtering by stage. | Returns array of application summaries |
| B3.2 | Application detail endpoint | B3.1 | `GET /api/applications/{id}` — returns full application with all documents, compliance result, chat history, staff actions | Returns complete application object |
| B3.3 | Staff action endpoint | B3.2 | `POST /api/staff/actions` — staff can: approve_query (ask client for clarification), override_issue (mark a flagged issue as resolved), authorize_submit (approve final submission). Each action: saves to staff_actions table, updates application/document status, emits WebSocket event to client. | Staff action saves to DB and triggers client-side update |
| B3.4 | Staff → Client message | B3.3 | When staff approves a query → generate a structured message (from template + AI) → save to chat_messages → emit WebSocket to client room | Staff clicks "query" → client sees new message in chat |
| B3.5 | Visa form auto-fill | B2.3 | `GET /api/applications/{id}/visa-form` — aggregates all extracted document data → maps to visa form fields → returns structured form data with source tracking (which document each field came from) | Returns 20+ form fields with source attribution |

### Dev A (Frontend) Tasks:

| # | Task | Depends On | Detail | Done When |
|---|------|-----------|--------|-----------|
| A3.1 | Dashboard layout | A0.4 | StaffDashboard page: left sidebar (filters by stage), main content (application cards grid), right panel (selected application detail) | Layout renders, responsive, premium dark theme |
| A3.2 | Application cards | A3.1 | Card component showing: client name, visa type, destination, stage badge, document progress (3/4 uploaded), issue count, timestamp. Click to select. | Cards render with mock data |
| A3.3 | Discrepancy audit card | A3.2 | When an application has flagged issues: prominent card showing each issue with severity, detail, and action buttons (Approve Query / Override). This is the HITL interface. | Audit card shows issues with clear actions |
| A3.4 | Diff view | A3.3 | Side-by-side comparison: left column = raw extracted data, right column = visa form fields. Highlights mismatches or low-confidence fields. Staff can verify correctness. | Diff view renders with real extracted data |
| A3.5 | Action integration | A0.6, B3.3 | Wire action buttons → `POST /api/staff/actions` → update local state. Listen for WebSocket events from other staff. | Click "Approve Query" → API call → success feedback → client gets message |
| A3.6 | Real-time dashboard updates | A0.6 | Dashboard updates when new applications arrive, documents get processed, stages change. All via WebSocket. | Open dashboard → upload doc on client portal → dashboard card updates automatically |

### 🔄 SYNC POINT:
- [ ] Staff dashboard shows application cards with real data from PostgreSQL
- [ ] Click an application → see documents, compliance results, issues
- [ ] Click "Approve Query" → client chat shows the query message in real-time
- [ ] Client responds → staff dashboard updates
- [ ] Diff view shows extracted data vs form fields

---

## MILESTONE 4: Full Flow Integration
**Duration:** 2 hours  
**Goal:** Complete end-to-end demo flow works without errors  
**Both devs work together**

| # | Task | Owner | Detail | Done When |
|---|------|-------|--------|-----------|
| 4.1 | Full flow test | BOTH | Run through the complete Tunde scenario: intake → 4 doc uploads → AI analysis → compliance check → staff review → query → client response → staff authorize | Every step works without errors |
| 4.2 | Error handling | BOTH | Add error states: API timeout → retry message, upload failure → retry button, WebSocket disconnect → reconnect banner | No unhandled errors in the flow |
| 4.3 | Flight options | A=UI, B=API | B: `GET /api/flights` returns mock flight data. A: Flight card with airline, route, price, baggage. Client can "select" a flight. | Flight cards appear after visa "approved" |
| 4.4 | Stage transitions | B | Ensure application stage progresses correctly: intake → documents → audit → review → approved. Each transition emits event. | Stage badges update correctly throughout flow |
| 4.5 | Demo data seeding | B | Create a script that pre-seeds one complete application in various stages (for backup demo if live flow fails) | Can demo from any stage if needed |
| 4.6 | Dual-screen setup | BOTH | Test with two browser windows: client portal on one, staff dashboard on the other. Confirm real-time updates flow both ways. | Both screens update simultaneously |

### 🔄 SYNC POINT:
- [ ] Complete Tunde scenario runs end-to-end in under 5 minutes
- [ ] No crashes, no unhandled errors
- [ ] Dual-screen demo is visually compelling

---

## MILESTONE 5: Polish + Demo Prep
**Duration:** 1.5 hours  
**Goal:** Demo is visually stunning, pitch is rehearsed, backup plan is ready  
**Both devs**

| # | Task | Owner | Detail | Done When |
|---|------|-------|--------|-----------|
| 5.1 | Visual polish | A | Smooth transitions between stages, loading skeletons, hover effects on cards, micro-animations on status changes. Make it feel PREMIUM. | UI looks world-class, not hackathon-grade |
| 5.2 | Landing page | A | Hero section: product name, one-line value prop, "Try Demo" button → client portal. Show key stats (3-week → 15 min). | Landing page makes judges want to see more |
| 5.3 | Demo rehearsal | BOTH | Run through the 5-minute demo script 2-3 times. Time each section. Know exactly what to click and say. | Can demo without hesitation |
| 5.4 | Backup demo | B | Pre-seeded application data so if the live AI fails, you can show the processed results. Have screenshots of each stage as last resort. | Backup covers every demo moment |
| 5.5 | Pitch prep | BOTH | Practice the judge Q&A answers: problem, user, tech stack, scalability, what's next. One-sentence answers for each. | Both devs can answer any question |

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| OpenAI API rate limit / downtime | Medium | Pre-seed demo data. Have mock responses as fallback. Show the architecture even if live AI fails. |
| PostgreSQL connection issues | Low | Test connection in M0. Have connection string ready. If Postgres fails to install, use Neon.tech (free hosted Postgres — 30 second setup). |
| WebSocket doesn't connect through CORS | Medium | Test in M0 sync point. `python-socketio` CORS config is tricky — set `cors_allowed_origins="*"` for hackathon. |
| Document analysis returns garbage | Medium | Craft specific prompts per document type with few-shot examples. Test with real passport/bank statement images before demo. |
| Run out of time | High | Milestones are priority-ordered. M0-M3 = functional demo. M4 = integration. M5 = polish. If M4 is tight, skip flight cards and polish. |

---

## Timeline Map

```
8:45 PM  ┬── M0: Foundation ──────────────────── 10:15 PM
         │   BOTH: project setup, DB, Socket.io
         │
10:15 PM ┬── M1: Chat Intake ─────────────────── 12:45 AM
         │   A: Chat UI    |    B: Chat API + LLM
         │
12:45 AM ┬── M2: Document Intelligence ───────── 3:45 AM
         │   A: Upload UI  |    B: Vision + Compliance
         │
 3:45 AM ┬── M3: Staff Dashboard ─────────────── 6:45 AM
         │   A: Dashboard  |    B: Staff API + HITL
         │
 6:45 AM ┬── M4: Integration ─────────────────── 8:45 AM
         │   BOTH: end-to-end flow, bugs, flights
         │
 8:45 AM ┬── M5: Polish + Demo ───────────────── 10:00 AM
         │   BOTH: visual polish, rehearsal, backup
         │
10:00 AM ─── DEMO TIME 🎤
```

---

> [!CAUTION]
> **Non-negotiable rule:** At each sync point, STOP and verify together. If something doesn't work at a sync point, fix it BEFORE moving to the next milestone. A broken foundation cascades into broken everything.
