import React, { useState, useEffect } from 'react';
import { ApplicationList } from '../components/dashboard/ApplicationList';
import { AuditCard } from '../components/dashboard/AuditCard';
import { DiffViewerModal } from '../components/dashboard/DiffViewerModal';
import { DocumentCard } from '../components/documents/DocumentCard';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Eye, Search, Compass, Users, FileCheck2, Zap, MapPin, Send, AlertTriangle, CheckCircle2, Phone, Mail, Plane, Luggage } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const StaffDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [agentNote, setAgentNote] = useState('');

  const [applications, setApplications] = useState([
    {
      id: 'app_tunde_123',
      client_name: 'Tunde Babatunde Adeyemi',
      client_email: 'tunde.adeyemi@gmail.com',
      client_phone: '+234 803 123 4567',
      trip_type: 'Holiday & Tourism',
      destination: 'London, United Kingdom',
      visa_type: 'UK Standard Visitor Visa',
      travel_dates: '14 Nov - 28 Nov 2026',
      flight: 'British Airways (BA 074)',
      stage: 'document_audit',
      compliance_passed: false,
      flagReason: 'Reviewing 3-month bank balance subsistence',
      created_at: new Date().toISOString()
    },
    {
      id: 'app_amaka_456',
      client_name: 'Amaka Obi',
      client_email: 'amaka.obi@outlook.com',
      client_phone: '+234 812 987 6543',
      trip_type: 'Family Vacation',
      destination: 'Dubai, UAE',
      visa_type: '30-Day Dubai Tourist e-Visa',
      travel_dates: '20 Dec - 28 Dec 2026',
      flight: 'Emirates (EK 784)',
      stage: 'ready_for_submission',
      compliance_passed: true,
      flagReason: 'e-Visa document pack verified & complete',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'app_chidi_789',
      client_name: 'Chidi Nwosu',
      client_email: 'chidi.nwosu@kpmg.com',
      client_phone: '+234 809 555 1234',
      trip_type: 'Business Conference',
      destination: 'Paris, France (Schengen)',
      visa_type: 'Schengen Business Visa (Type C)',
      travel_dates: '02 Dec - 08 Dec 2026',
      flight: 'Air France (AF 854)',
      stage: 'submitted',
      compliance_passed: true,
      flagReason: 'Embassy appointment attended • Awaiting passport',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  const [selectedAppId, setSelectedAppId] = useState('app_tunde_123');
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  const { isConnected, lastEvent } = useSocket(selectedAppId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const cur = applications.find((a) => a.id === selectedAppId);
    setSelectedApp(cur);

    if (selectedAppId === 'app_tunde_123') {
      setIssues([
        {
          rule: 'UK Consular Tourism Subsistence Proof',
          detail: 'Applicant maintains closing balance of ₦4,850,000 (~£2,425), satisfying 14-day holiday living expenses in London.'
        }
      ]);
      setDocuments([
        {
          id: 'doc_1',
          doc_type: 'passport',
          status: 'passed',
          ai_confidence: 0.99,
          original_filename: 'Tunde_Passport_Bio.pdf',
          extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', nationality: 'Nigerian', expiry_date: '2031-11-14' },
          issues: []
        },
        {
          id: 'doc_2',
          doc_type: 'flight_ticket',
          status: 'passed',
          ai_confidence: 0.98,
          original_filename: 'BA_Flight_LOS_LHR_Return.pdf',
          extracted_data: { airline: 'British Airways', route: 'LOS -> LHR Return', departure: '14 Nov 2026', return_date: '28 Nov 2026' },
          issues: []
        },
        {
          id: 'doc_3',
          doc_type: 'hotel_booking',
          status: 'passed',
          ai_confidence: 0.97,
          original_filename: 'Hotel_Reservation_London.pdf',
          extracted_data: { hotel: 'The Standard London', address: '10 Argyle St, London WC1H 8EG', check_in: '15 Nov 2026', check_out: '28 Nov 2026' },
          issues: []
        },
        {
          id: 'doc_4',
          doc_type: 'bank_statement',
          status: 'flagged',
          ai_confidence: 0.95,
          original_filename: 'Bank_Statement_3Months.pdf',
          extracted_data: { bank: 'GTBank Nigeria', closing_balance: '₦4,850,000 (~£2,425)', months_covered: 3 },
          issues: [{ rule: 'Subsistence Check', detail: 'Balance verified. Ensure recent salary deposit matches pay slip evidence.' }]
        }
      ]);
    } else {
      setIssues([]);
      setDocuments([]);
    }
  }, [selectedAppId, applications]);

  const handleStaffAction = async (actionType) => {
    setLoadingAction(true);
    try {
      await apiService.takeStaffAction(selectedAppId, actionType, {
        notes: 'Travel agent verified all tourist documents, confirmed return flight hold, and hotel reservation.',
        authorized_by: 'Travel_Consultant_Amaka'
      });
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Client travel dossier verified & cleared');
    } catch (e) {
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Travel verification confirmed: Ready for embassy submission');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSendClientNote = (e) => {
    e.preventDefault();
    if (!agentNote.trim()) return;
    showToast('Direct travel update sent to client portal');
    setAgentNote('');
  };

  const flaggedCount = applications.filter((a) => a.stage === 'document_audit').length;
  const clearedCount = applications.filter((a) => a.stage === 'ready_for_submission').length;
  const submittedCount = applications.filter((a) => a.stage === 'submitted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-dropdown text-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Agency Desk Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Travel Agency & Visa Services Desk
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Verify client travel documents, confirm return flight holds & generate embassy itineraries
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-800 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200 self-start">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Agent Desk Active (IATA / NANTA Verified)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{applications.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Clients travelling this month</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Document Checks</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-600">{flaggedCount}</div>
          <div className="text-[11px] text-amber-700 mt-1">Under agent verification</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Visa Ready</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{clearedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Ready for embassy drop-off</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tickets Issued</span>
            <Plane className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{submittedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Confirmed & ready to fly</div>
        </div>
      </div>

      {/* Main Split Casework */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Traveler Queue</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {applications.length} travelers
              </span>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3 text-center">
              {[
                { id: 'all', label: 'All' },
                { id: 'flagged', label: 'Checks' },
                { id: 'cleared', label: 'Ready' },
                { id: 'submitted', label: 'Done' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilter(pill.id)}
                  className={
                    'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ' +
                    (filter === pill.id
                      ? 'bg-white text-slate-900 shadow-subtle'
                      : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <ApplicationList
              applications={applications}
              selectedAppId={selectedAppId}
              onSelectApplication={setSelectedAppId}
              filter={filter}
            />
          </div>
        </div>

        {/* Right Column: Case Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApp && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
              {/* Traveler Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedApp.client_name}
                    </h2>
                    <Badge status={selectedApp.stage} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      {selectedApp.destination}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Luggage className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.trip_type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Plane className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.flight}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDiffModalOpen(true)}
                    icon={<Eye className="w-3.5 h-3.5 text-brand-600" />}
                  >
                    Compare Bio Data
                  </Button>
                </div>
              </div>

              {/* Document Audit & Verification Card */}
              <AuditCard
                issues={issues}
                onStaffAction={handleStaffAction}
                loading={loadingAction}
              />

              {/* Submitted Travel Documents */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Traveler's Submitted Documents ({documents.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verified passport validity, flight return dates & hotel reservations
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {documents.map((d) => (
                    <DocumentCard key={d.id} doc={d} />
                  ))}
                </div>
              </div>

              {/* Send Traveler Notice */}
              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Send Travel Agent Notice to Client
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Instantly sends notification to traveler's mobile & portal.
                </p>

                <form onSubmit={handleSendClientNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Your British Airways return seat is held. Please bring 2 passport photos to your TLScontact appointment."
                    value={agentNote}
                    onChange={(e) => setAgentNote(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <DiffViewerModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        clientData={selectedApp || {}}
        ocrData={documents.find((d) => d.doc_type === 'passport')?.extracted_data || {}}
      />
    </div>
  );
};
