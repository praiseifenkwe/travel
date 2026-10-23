import React, { useState, useEffect } from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';
import { UploadZone } from '../components/documents/UploadZone';
import { DocumentCard } from '../components/documents/DocumentCard';
import { VisaSummaryCard } from '../components/visa/VisaSummaryCard';
import { FlightCards } from '../components/flights/FlightCards';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Plane, FileText } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const ClientPortal = () => {
  const [applicationId, setApplicationId] = useState('app_tunde_123');
  const [toastMessage, setToastMessage] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to TravelForge! I am your AI Immigration Specialist. Tell me about your upcoming travel or relocation plans (destination, employer offer, timeline), and I will generate your live compliance checklist.'
    }
  ]);
  const [checklist, setChecklist] = useState([
    { id: 'passport', label: 'Valid International Passport', status: 'pending', required: true },
    { id: 'cos', label: 'Certificate of Sponsorship (CoS)', status: 'pending', required: true },
    { id: 'tb_test', label: 'IOM Tuberculosis Test Certificate', status: 'pending', required: true },
    { id: 'bank_statement', label: '28-Day Bank Statement (?1,270 maintenance)', status: 'pending', required: true }
  ]);
  const [documents, setDocuments] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('passport');
  const [appStage, setAppStage] = useState('intake');
  const [appData, setAppData] = useState({
    client_name: 'Tunde Adeyemi',
    destination: 'United Kingdom',
    visa_type: 'uk_skilled_worker',
    employer: 'Bloomberg LP',
    timeline: 'November 2026'
  });

  const { isConnected, lastEvent, joinAppRoom } = useSocket(applicationId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handle incoming real-time WebSocket events from backend
  useEffect(() => {
    if (lastEvent?.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.doc_type !== doc.doc_type);
        return [doc, ...filtered];
      });

      // Update checklist item
      setChecklist((prev) =>
        prev.map((item) =>
          item.id === doc.doc_type
            ? { ...item, status: doc.status }
            : item
        )
      );

      if (doc.status === 'flagged') {
        setAppStage('document_audit');
        showToast(`?? ${doc.doc_type.toUpperCase()} flagged for Consultant review.`);
      } else {
        showToast(`? ${doc.doc_type.toUpperCase()} successfully verified.`);
      }
    } else if (lastEvent?.type === 'staff_action') {
      const action = lastEvent.data;
      if (action.client_message) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `?? Consultant Verification: ${action.client_message}`
          }
        ]);
        showToast(`Consultant Action: ${action.client_message}`);
      }
      if (action.updated_stage === 'ready_for_submission' || action.updated_stage === 'submitted') {
        setAppStage(action.updated_stage);
        // Load flights automatically
        loadSampleFlights();
      }
    }
  }, [lastEvent]);

  const loadSampleFlights = () => {
    setFlights([
      {
        id: 'fl_001',
        airline: 'British Airways',
        flight_no: 'BA76',
        route: 'LOS (Lagos) ? LHR (London Heathrow)',
        departure: '2026-11-15T22:30:00Z',
        arrival: '2026-11-16T05:15:00Z',
        cabin: 'Club World / Economy',
        price_ngn: 1850000,
        baggage: '2 ? 23kg standard corporate allowance',
        stops: 0
      },
      {
        id: 'fl_002',
        airline: 'Virgin Atlantic',
        flight_no: 'VS412',
        route: 'LOS (Lagos) ? LHR (London Heathrow)',
        departure: '2026-11-16T10:15:00Z',
        arrival: '2026-11-16T17:00:00Z',
        cabin: 'Economy Delight',
        price_ngn: 1795000,
        baggage: '2 ? 23kg standard corporate allowance',
        stops: 0
      }
    ]);
  };

  // Send Chat Message
  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const res = await apiService.sendChatMessage(text, applicationId);
      if (res.application_id) {
        setApplicationId(res.application_id);
        joinAppRoom(res.application_id);
      }
      if (res.extracted_intent) setAppData(res.extracted_intent);
      if (res.checklist) setChecklist(res.checklist);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply }
      ]);
    } catch (err) {
      // High-fidelity fallback for offline demo resilience
      setTimeout(() => {
        const reply = "Congratulations on the Bloomberg LP offer in London! For your UK Skilled Worker visa, UKVI mandates verifying your identity, certificate of sponsorship, TB medical clearance, and financial maintenance. I've configured your live checklist below. Please upload your documents to trigger automated OCR and compliance auditing.";
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      }, 500);
    } finally {
      setLoadingChat(false);
    }
  };

  // Upload Document with dynamic mock feedback
  const handleUpload = async (docType, file) => {
    try {
      await apiService.uploadDocument(applicationId, docType, file);
    } catch (err) {
      // Realistic simulation for immediate visual demo
      setTimeout(() => {
        let fallbackDoc;
        if (docType === 'passport') {
          fallbackDoc = {
            document_id: 'doc_' + Date.now(),
            application_id: applicationId,
            doc_type: 'passport',
            status: 'flagged',
            ai_confidence: 0.96,
            original_filename: file.name,
            extracted_data: {
              full_name: 'Tunde Babatunde Adeyemi',
              passport_number: 'A12345678',
              nationality: 'Nigerian',
              expiry_date: '2027-02-14',
              issuing_authority: 'NIS Abuja'
            },
            issues: [
              {
                rule: 'passport_validity_period',
                document: 'passport',
                detail: 'Passport expires on 2027-02-14, which has less than 6 months validity from intended travel date.',
                severity: 'critical'
              }
            ]
          };
          setAppStage('document_audit');
          showToast('?? Passport flagged for 6-month validity rule check');
        } else if (docType === 'cos') {
          fallbackDoc = {
            document_id: 'doc_' + Date.now(),
            application_id: applicationId,
            doc_type: 'cos',
            status: 'passed',
            ai_confidence: 0.98,
            original_filename: file.name,
            extracted_data: {
              sponsor_name: 'Bloomberg LP',
              cos_number: 'WAC2671049281',
              job_title: 'Senior Software Engineer',
              salary_gbp: 85000,
              cos_status: 'ACTIVE',
              maintenance_certified: true
            },
            issues: []
          };
          showToast('? Certificate of Sponsorship verified with Tier-A Rating');
        } else if (docType === 'bank_statement') {
          fallbackDoc = {
            document_id: 'doc_' + Date.now(),
            application_id: applicationId,
            doc_type: 'bank_statement',
            status: 'passed',
            ai_confidence: 0.94,
            original_filename: file.name,
            extracted_data: {
              bank_name: 'First Bank of Nigeria',
              account_name: 'Tunde B. Adeyemi',
              closing_balance_ngn: 14500000,
              continuous_28_days_passed: true
            },
            issues: []
          };
          showToast('? 28-day maintenance funds threshold verified (?14.5M)');
        } else {
          fallbackDoc = {
            document_id: 'doc_' + Date.now(),
            application_id: applicationId,
            doc_type: 'tb_test',
            status: 'passed',
            ai_confidence: 0.97,
            original_filename: file.name,
            extracted_data: {
              issuing_authority: 'IOM Migration Health Assessment Centre, Lagos',
              test_result: 'Negative (Normal)',
              certificate_valid: true
            },
            issues: []
          };
          showToast('? IOM Tuberculosis Medical Certificate cleared');
        }

        setDocuments((prev) => [fallbackDoc, ...prev.filter((d) => d.doc_type !== docType)]);
        setChecklist((prev) =>
          prev.map((item) =>
            item.id === docType ? { ...item, status: fallbackDoc.status } : item
          )
        );
      }, 700);
    }
  };

  const steps = [
    { id: 'intake', label: '1. Conversational Intake', active: true, done: true },
    { id: 'document_audit', label: '2. Vision OCR & Audit', active: appStage === 'document_audit', done: documents.length > 0 },
    { id: 'ready_for_submission', label: '3. HITL Clearance', active: appStage === 'ready_for_submission', done: appStage === 'ready_for_submission' || appStage === 'submitted' },
    { id: 'submitted', label: '4. UKVI Submission & Flights', active: appStage === 'submitted', done: appStage === 'submitted' }
  ];

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner glass-panel" style={{
          padding: '12px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Sparkles size={18} color="#06b6d4" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Top Workflow Progress Stepper */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, overflowX: 'auto' }}>
          {steps.map((st, i) => (
            <React.Fragment key={st.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: st.done ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : st.active ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  boxShadow: st.active ? '0 0 12px rgba(6, 182, 212, 0.5)' : 'none'
                }}>
                  {st.done ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: st.active ? '#38bdf8' : st.done ? '#34d399' : 'var(--text-muted)' }}>
                    {st.label}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: st.done ? '#10b981' : 'rgba(255,255,255,0.08)', minWidth: 30 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Split Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 24, minHeight: 'calc(100vh - 200px)' }}>
        {/* Left Column: Multimodal Chat & Checklist */}
        <div style={{ height: 'calc(100vh - 200px)' }}>
          <ChatContainer
            messages={messages}
            checklist={checklist}
            onSendMessage={handleSendMessage}
            loading={loadingChat}
            onSelectDocType={(type) => setSelectedDocType(type)}
          />
        </div>

        {/* Right Column: Ingestion, Audit & Flights */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: 6 }}>
          <UploadZone
            selectedDocType={selectedDocType}
            onTypeChange={setSelectedDocType}
            onUpload={handleUpload}
          />

          {/* Uploaded Documents List */}
          {documents.map((d) => (
            <DocumentCard key={d.document_id || d.id} doc={d} />
          ))}

          {/* Visa Form Auto-Fill Preview */}
          {documents.length > 0 && <VisaSummaryCard appData={appData} />}

          {/* Relocation Flight Logistics */}
          <FlightCards flights={flights} />
        </div>
      </div>
    </div>
  );
};
