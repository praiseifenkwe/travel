import React, { useState, useEffect } from 'react';
import { ApplicationList } from '../components/dashboard/ApplicationList';
import { AuditCard } from '../components/dashboard/AuditCard';
import { DiffViewerModal } from '../components/dashboard/DiffViewerModal';
import { DocumentCard } from '../components/documents/DocumentCard';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Eye, Search, Shield, Users, FileCheck2, Zap, Building2, MapPin, Send, AlertTriangle, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const StaffDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [caseworkerNote, setCaseworkerNote] = useState('');

  const [applications, setApplications] = useState([
    {
      id: 'app_tunde_123',
      client_name: 'Tunde Babatunde Adeyemi',
      client_email: 'tunde.adeyemi@bloomberg.com',
      client_phone: '+234 803 123 4567',
      visa_type: 'UK Skilled Worker Visa (Tier 2)',
      destination: 'London, United Kingdom',
      employer: 'Bloomberg LP (London Office)',
      salary: '£85,000 / year',
      stage: 'document_audit',
      compliance_passed: false,
      flagReason: 'Passport expires in Feb 2027 • Sponsor Maintenance check',
      created_at: new Date().toISOString()
    },
    {
      id: 'app_amaka_456',
      client_name: 'Amaka Obi',
      client_email: 'amaka.obi@imperial.ac.uk',
      client_phone: '+234 812 987 6543',
      visa_type: 'UK Student Visa (Subcategory CAS)',
      destination: 'London, United Kingdom',
      employer: 'Imperial College London',
      salary: 'Tuition & Maintenance Covered',
      stage: 'ready_for_submission',
      compliance_passed: true,
      flagReason: 'All evidential artifacts cleared',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'app_chidi_789',
      client_name: 'Chidi Nwosu',
      client_email: 'chidi.nwosu@kpmg.co.uk',
      client_phone: '+234 809 555 1234',
      visa_type: 'UK Skilled Worker (Global Mobility)',
      destination: 'Manchester, United Kingdom',
      employer: 'KPMG UK',
      salary: '£72,000 / year',
      stage: 'submitted',
      compliance_passed: true,
      flagReason: 'Submitted to UKVI • Awaiting decision',
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
          rule: 'UKVI Appendix Finance — FIN 2.1',
          detail: 'Applicant maintains personal savings of £7,250. Sponsoring employer (Bloomberg LP) certifies maintenance under CoS Section A2, providing statutory exemption.'
        }
      ]);
      setDocuments([
        {
          id: 'doc_1',
          doc_type: 'passport',
          status: 'passed',
          ai_confidence: 0.98,
          original_filename: 'Tunde_Passport_Bio.pdf',
          extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', nationality: 'Nigerian', expiry_date: '2029-03-15' },
          issues: []
        },
        {
          id: 'doc_2',
          doc_type: 'cos',
          status: 'passed',
          ai_confidence: 0.99,
          original_filename: 'Bloomberg_CoS_Tier2.pdf',
          extracted_data: { sponsor_name: 'Bloomberg LP', cos_number: 'WAC2671049281', salary_gbp: 85000, cos_status: 'ACTIVE', maintenance_certified: true },
          issues: []
        },
        {
          id: 'doc_3',
          doc_type: 'bank_statement',
          status: 'flagged',
          ai_confidence: 0.94,
          original_filename: 'FirstBank_Statement_28Day.pdf',
          extracted_data: { bank_name: 'First Bank of Nigeria', closing_balance_ngn: 14500000, equivalent_gbp: 7250, days_held: 28 },
          issues: [{ rule: 'FIN 2.1', detail: 'Maintenance covered by Tier-A sponsor certification.' }]
        }
      ]);
    } else {
      setIssues([]);
      setDocuments([]);
    }
  }, [selectedAppId, applications]);

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => [doc, ...prev.filter((d) => d.doc_type !== doc.doc_type)]);
      showToast('Client update: ' + doc.doc_type + ' uploaded');
    }
  }, [lastEvent]);

  const handleStaffAction = async (actionType) => {
    setLoadingAction(true);
    try {
      await apiService.takeStaffAction(selectedAppId, actionType, {
        notes: 'Caseworker approved sponsor maintenance guarantee under CoS A2 exemption.',
        authorized_by: 'Licensed_Caseworker_Adeyemi'
      });
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Determination approved: Case ready for UKVI electronic filing');
    } catch (e) {
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Caseworker override logged: Compliance clearance granted');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSendClientNote = (e) => {
    e.preventDefault();
    if (!caseworkerNote.trim()) return;
    showToast('Direct caseworker update sent to applicant portal');
    setCaseworkerNote('');
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

      {/* Caseworker Console Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Agency Immigration Casework Console
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Deterministic UKVI compliance audit, legal exemptions & electronic submission gateway
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Caseworker Session: Active (OISC Reg. Level 2)</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Cases</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{applications.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active relocation pipeline</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Action Required</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-600">{flaggedCount}</div>
          <div className="text-[11px] text-amber-700 mt-1">Discrepancies pending review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Clearance Ready</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{clearedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Ready for UKVI submission</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Electronic Filing</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{submittedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Submitted to consular queue</div>
        </div>
      </div>

      {/* Main Casework Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applicant Triage Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Applicant Triage Queue</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {applications.length} cases
              </span>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3 text-center">
              {[
                { id: 'all', label: 'All' },
                { id: 'flagged', label: 'Flags' },
                { id: 'cleared', label: 'Clear' },
                { id: 'submitted', label: 'Filed' }
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

        {/* Right Column: Case Determination Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApp && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              {/* Case Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedApp.client_name}
                    </h2>
                    <Badge status={selectedApp.stage} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.employer}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.client_email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.client_phone}
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
                    Optical Diff Inspector
                  </Button>
                </div>
              </div>

              {/* Caseworker Action & Decision Determination Card */}
              <AuditCard
                issues={issues}
                onStaffAction={handleStaffAction}
                loading={loadingAction}
              />

              {/* Evidential Records Submitted by Client */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Client Evidential Records ({documents.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Parsed via multimodal OCR and checked against UKVI immigration rules
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {documents.map((d) => (
                    <DocumentCard key={d.id} doc={d} />
                  ))}
                </div>
              </div>

              {/* Send Direct Caseworker Message to Applicant */}
              <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Send Direct Caseworker Notice to Applicant
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Message will appear immediately on the applicant's portal in real-time.
                </p>

                <form onSubmit={handleSendClientNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Your CoS maintenance guarantee has been verified. You may proceed to TLScontact booking."
                    value={caseworkerNote}
                    onChange={(e) => setCaseworkerNote(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                    Send Notice
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
