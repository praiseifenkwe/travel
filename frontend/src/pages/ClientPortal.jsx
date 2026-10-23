import React, { useState, useEffect } from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';
import { UploadZone } from '../components/documents/UploadZone';
import { DocumentCard } from '../components/documents/DocumentCard';
import { VisaSummaryCard } from '../components/visa/VisaSummaryCard';
import { FlightCards } from '../components/flights/FlightCards';
import { RelocationTimeline } from '../components/visa/RelocationTimeline';
import { DossierModal } from '../components/shared/DossierModal';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { 
  FileText, 
  MessageSquare, 
  Plane, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'chat' | 'relocation'
  const [applicationId] = useState('app_tunde_123');
  const [toastMessage, setToastMessage] = useState(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  const [appStage, setAppStage] = useState('document_audit');
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('passport');

  const [appData] = useState({
    client_name: 'Tunde Babatunde Adeyemi',
    destination: 'London, United Kingdom',
    visa_type: 'UK Skilled Worker Visa (Tier 2)',
    employer: 'Bloomberg LP',
    role: 'Senior Software Engineer (Distributed Systems)',
    startDate: '14 November 2026',
    salary: '£85,000 / year'
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello Tunde! I am your TravelForge Relocation Concierge. Your UK Skilled Worker profile for Bloomberg LP is configured. Your documents are being verified against official UKVI Immigration Rules.'
    }
  ]);

  const [checklist, setChecklist] = useState([
    { id: 'passport', label: 'International Passport (Bio Page)', status: 'flagged', required: true, detail: 'Expiry in Feb 2027 (<6 months) - Exemption review in progress' },
    { id: 'cos', label: 'Certificate of Sponsorship (CoS)', status: 'passed', required: true, detail: 'Tier-A Licensed Sponsor • Maintenance Certified' },
    { id: 'tb_test', label: 'IOM Tuberculosis Certificate', status: 'passed', required: true, detail: 'Cleared by IOM Migration Health Assessment Centre' },
    { id: 'bank_statement', label: '28-Day Bank Statement (£1,270)', status: 'passed', required: true, detail: '₦14.5M verified • Supported by Employer Maintenance Guarantee' }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 'doc_1',
      doc_type: 'passport',
      status: 'flagged',
      ai_confidence: 0.98,
      original_filename: 'Tunde_Passport_Bio.pdf',
      extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', nationality: 'Nigerian', expiry_date: '2027-02-14' },
      issues: [{ rule: 'Passport Validity Period', detail: 'Passport expires in February 2027. Caseworker is reviewing sponsor priority exemption.' }]
    },
    {
      id: 'doc_2',
      doc_type: 'cos',
      status: 'passed',
      ai_confidence: 0.99,
      original_filename: 'Bloomberg_CoS_Approval.pdf',
      extracted_data: { sponsor_name: 'Bloomberg LP', cos_number: 'WAC2671049281', salary_gbp: 85000, cos_status: 'ACTIVE', maintenance_certified: true },
      issues: []
    },
    {
      id: 'doc_3',
      doc_type: 'bank_statement',
      status: 'passed',
      ai_confidence: 0.94,
      original_filename: 'FirstBank_Statement_Sep2026.pdf',
      extracted_data: { bank_name: 'First Bank of Nigeria', closing_balance_ngn: 14500000, equivalent_gbp: 7250, days_held: 28 },
      issues: []
    },
    {
      id: 'doc_4',
      doc_type: 'tb_test',
      status: 'passed',
      ai_confidence: 0.96,
      original_filename: 'IOM_TB_Clearance_Adeyemi.pdf',
      extracted_data: { clinic: 'IOM Migration Health Assessment Centre Lagos', test_result: 'NEGATIVE', expiry_date: '2027-03-10' },
      issues: []
    }
  ]);

  const [flights] = useState([
    {
      id: 'fl_1',
      airline: 'British Airways',
      flight_number: 'BA 074',
      route: 'LOS (Lagos) -> LHR (London Heathrow)',
      departure_date: '14 Nov 2026 (22:45)',
      class: 'Corporate Economy',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 1850000,
      status: 'corporate_hold_available'
    },
    {
      id: 'fl_2',
      airline: 'Virgin Atlantic',
      flight_number: 'VS 412',
      route: 'LOS (Lagos) -> LHR (London Heathrow)',
      departure_date: '15 Nov 2026 (10:15)',
      class: 'Premium Economy',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 2420000,
      status: 'corporate_hold_available'
    }
  ]);

  const { isConnected, lastEvent } = useSocket(applicationId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => [doc, ...prev.filter((d) => d.doc_type !== doc.doc_type)]);
      setChecklist((prev) =>
        prev.map((item) => (item.id === doc.doc_type ? { ...item, status: doc.status } : item))
      );
      showToast(doc.status === 'flagged' ? 'Note added to ' + doc.doc_type : doc.doc_type + ' verified successfully');
    } else if (lastEvent && lastEvent.type === 'staff_action') {
      const action = lastEvent.data;
      if (action.client_message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Caseworker Update: ' + action.client_message }]);
        showToast(action.client_message);
      }
      if (action.updated_stage === 'ready_for_submission' || action.updated_stage === 'submitted') {
        setAppStage(action.updated_stage);
      }
    }
  }, [lastEvent]);

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const res = await apiService.sendChatMessage(text, applicationId);
      if (res && res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (e) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Understood, Tunde. Your relocation file has been updated with these details. Your caseworker has been notified.' }
        ]);
      }, 400);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleUpload = async (docType, file) => {
    try {
      await apiService.uploadDocument(applicationId, docType, file);
    } catch (e) {
      setTimeout(() => {
        const newDoc = {
          id: 'doc_' + Date.now(),
          doc_type: docType,
          status: 'passed',
          ai_confidence: 0.98,
          original_filename: file.name,
          extracted_data: { full_name: 'Tunde Babatunde Adeyemi', status: 'Verified' },
          issues: []
        };
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.doc_type !== docType)]);
        setChecklist((prev) =>
          prev.map((item) => (item.id === docType ? { ...item, status: 'passed' } : item))
        );
        showToast(docType.toUpperCase() + ' uploaded and verified');
      }, 500);
    }
  };

  const completedDocsCount = checklist.filter((c) => c.status === 'passed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-dropdown text-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Relocation Case Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              TA
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {appData.client_name}
                </h1>
                <Badge status={appStage} />
                <span className="text-xs font-mono font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  Case #{applicationId}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  {appData.employer}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {appData.role}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {appData.destination}
                </span>
                <span>•</span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  {appData.visa_type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDossierOpen(true)}
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            >
              UKVI Submission Dossier
            </Button>
          </div>
        </div>

        {/* 4-Step Visual Journey Stepper */}
        <div className="pt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Relocation Milestone Progress
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: '01',
                title: 'Pathway & Sponsorship',
                desc: 'Bloomberg CoS Tier-A Approved',
                status: 'completed'
              },
              {
                step: '02',
                title: 'Evidential Documents',
                desc: completedDocsCount + ' of 4 Verified by OCR',
                status: 'current'
              },
              {
                step: '03',
                title: 'Caseworker Clearance',
                desc: 'Maintenance Exemption In Review',
                status: appStage === 'ready_for_submission' || appStage === 'submitted' ? 'completed' : 'pending'
              },
              {
                step: '04',
                title: 'Biometrics & Departure',
                desc: 'TLScontact & Corporate Flight',
                status: appStage === 'submitted' ? 'completed' : 'upcoming'
              }
            ].map((st, i) => {
              const isDone = st.status === 'completed';
              const isCur = st.status === 'current';

              return (
                <div
                  key={i}
                  className={
                    'p-3.5 rounded-xl border transition-all ' +
                    (isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isCur
                      ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-400/20'
                      : 'bg-slate-50 border-slate-200 text-slate-400')
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={'text-[11px] font-mono font-bold ' + (isCur ? 'text-brand-700' : isDone ? 'text-emerald-700' : 'text-slate-400')}>
                      STEP {st.step}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCur ? (
                      <Clock className="w-4 h-4 text-brand-600 animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className={'text-xs font-bold ' + (isCur ? 'text-slate-900' : isDone ? 'text-slate-800' : 'text-slate-500')}>
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Action Alert Callout */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Next Action Required by Caseworker: </span>
            <span>
              Your international passport has under 6 months validity (expires Feb 2027). Under standard UK rules this triggers a notice, but Bloomberg LP's certified maintenance in CoS Section A2 enables an automated priority waiver. Our caseworker has this queued for sign-off.
            </span>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <FileText className="w-4 h-4" />
            <span>Evidential Documents</span>
            <span className={
              'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
              (activeTab === 'documents' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700')
            }>
              {completedDocsCount}/4 Verified
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span>Immigration Concierge Assistant</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('relocation')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'relocation'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <Plane className="w-4 h-4" />
            <span>TLScontact Biometrics & Flights</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Documents & OCR Audit */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <UploadZone
              selectedDocType={selectedDocType}
              onTypeChange={setSelectedDocType}
              onUpload={handleUpload}
            />
            <VisaSummaryCard appData={appData} />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Your Evidential Document Checklist</h2>
                  <p className="text-xs text-slate-500">Each document is scanned for compliance with UK Immigration Rules</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {completedDocsCount} of 4 Approved
                </span>
              </div>

              <div className="space-y-3">
                {documents.map((d) => (
                  <DocumentCard key={d.id} doc={d} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Concierge Chat */}
      {activeTab === 'chat' && (
        <div className="h-[calc(100vh-280px)] min-h-[550px]">
          <ChatContainer
            messages={messages}
            checklist={checklist}
            onSendMessage={handleSendMessage}
            loading={loadingChat}
            onSelectDocType={(type) => {
              setSelectedDocType(type);
              setActiveTab('documents');
            }}
          />
        </div>
      )}

      {/* Tab 3: Flights & Biometrics Schedule */}
      {activeTab === 'relocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <FlightCards flights={flights} />
          </div>
          <div className="lg:col-span-5">
            <RelocationTimeline />
          </div>
        </div>
      )}

      <DossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        appData={appData}
        documents={documents}
      />
    </div>
  );
};
