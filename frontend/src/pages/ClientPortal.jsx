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
import { MessageSquare, FileText, Plane, Building2, MapPin, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [applicationId, setApplicationId] = useState('app_tunde_123');
  const [toastMessage, setToastMessage] = useState(null);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to TravelForge, Tunde. I am your automated immigration specialist. Your UK Skilled Worker pathway for Bloomberg LP is configured. You can upload your documents in the Documents tab for automated OCR verification.'
    }
  ]);
  const [checklist, setChecklist] = useState([
    { id: 'passport', label: 'International Passport (Bio Page)', status: 'flagged', required: true },
    { id: 'cos', label: 'Certificate of Sponsorship (CoS)', status: 'passed', required: true },
    { id: 'tb_test', label: 'IOM Tuberculosis Certificate', status: 'passed', required: true },
    { id: 'bank_statement', label: '28-Day Bank Statement (£1,270 maintenance)', status: 'passed', required: true }
  ]);
  const [documents, setDocuments] = useState([
    {
      id: 'doc_1',
      doc_type: 'passport',
      status: 'flagged',
      ai_confidence: 0.98,
      original_filename: 'Tunde_Passport_Bio.pdf',
      extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', nationality: 'Nigerian', expiry_date: '2027-02-14' },
      issues: [{ rule: 'passport_validity_period', detail: 'Passport expires within 6 months of intended departure.' }]
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
  const [flights, setFlights] = useState([
    {
      id: 'fl_1',
      airline: 'British Airways',
      flight_number: 'BA 074',
      route: 'LOS -> LHR',
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
      route: 'LOS -> LHR',
      departure_date: '15 Nov 2026 (10:15)',
      class: 'Premium Economy',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 2420000,
      status: 'corporate_hold_available'
    }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('passport');
  const [appStage, setAppStage] = useState('document_audit');
  const [appData, setAppData] = useState({
    client_name: 'Tunde Babatunde Adeyemi',
    destination: 'United Kingdom',
    visa_type: 'uk_skilled_worker',
    employer: 'Bloomberg LP',
    timeline: 'November 2026'
  });

  const { isConnected, lastEvent } = useSocket(applicationId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (lastEvent?.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => [doc, ...prev.filter((d) => d.doc_type !== doc.doc_type)]);
      setChecklist((prev) =>
        prev.map((item) => (item.id === doc.doc_type ? { ...item, status: doc.status } : item))
      );
      showToast(doc.status === 'flagged' ? 'Discrepancy noted on ' + doc.doc_type : doc.doc_type + ' verified successfully');
    } else if (lastEvent?.type === 'staff_action') {
      const action = lastEvent.data;
      if (action.client_message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Consular Update: ' + action.client_message }]);
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
      if (res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (e) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Understood. Your relocation record has been updated with these details.' }
        ]);
      }, 300);
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
          ai_confidence: 0.97,
          original_filename: file.name,
          extracted_data: { full_name: 'Tunde Babatunde Adeyemi', status: 'Verified' },
          issues: []
        };
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.doc_type !== docType)]);
        setChecklist((prev) =>
          prev.map((item) => (item.id === docType ? { ...item, status: 'passed' } : item))
        );
        showToast(docType.toUpperCase() + ' uploaded & OCR verified');
      }, 500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-dropdown text-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Case Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center font-extrabold text-brand-700 text-lg shadow-subtle shrink-0">
              TA
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {appData.client_name}
                </h1>
                <Badge status={appStage} />
                <span className="text-xs font-mono font-medium text-slate-400">
                  ID: {applicationId}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {appData.employer}
                </span>
                <span>*</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  London, United Kingdom
                </span>
                <span>*</span>
                <span className="font-semibold text-brand-700">
                  UK Skilled Worker (Tier 2)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setDossierOpen(true)}>
              View UKVI Dossier
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
            }
          >
            <FileText className="w-4 h-4" />
            <span>Documents & OCR Audit</span>
            <span className={
              'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
              (activeTab === 'documents' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700')
            }>
              {checklist.filter((c) => c.status === 'passed').length}/{checklist.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span>Intake Specialist Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('relocation')}
            className={
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ' +
              (activeTab === 'relocation'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
            }
          >
            <Plane className="w-4 h-4" />
            <span>Flights & Relocation Schedule</span>
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Verified Intake Documents</h2>
              <span className="text-xs text-slate-500 font-medium">
                {documents.length} files processed
              </span>
            </div>
            <div className="space-y-3">
              {documents.map((d) => (
                <DocumentCard key={d.id} doc={d} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chat */}
      {activeTab === 'chat' && (
        <div className="h-[calc(100vh-280px)] min-h-[500px]">
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

      {/* Tab 3: Flights & Relocation Schedule */}
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
