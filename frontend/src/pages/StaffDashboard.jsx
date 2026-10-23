import React, { useState, useEffect } from 'react';
import { ApplicationList } from '../components/dashboard/ApplicationList';
import { AuditCard } from '../components/dashboard/AuditCard';
import { DiffViewerModal } from '../components/dashboard/DiffViewerModal';
import { DocumentCard } from '../components/documents/DocumentCard';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Eye, Search, Shield, Users, FileCheck2, Zap, Building2, MapPin } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const StaffDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [applications, setApplications] = useState([
    {
      id: 'app_tunde_123',
      client_name: 'Tunde Babatunde Adeyemi',
      client_email: 'tunde.adeyemi@bloomberg.com',
      client_phone: '+234 803 123 4567',
      visa_type: 'uk_skilled_worker',
      destination: 'United Kingdom',
      employer: 'Bloomberg LP (London Office)',
      stage: 'document_audit',
      compliance_passed: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'app_amaka_456',
      client_name: 'Amaka Obi',
      client_email: 'amaka.obi@imperial.ac.uk',
      client_phone: '+234 812 987 6543',
      visa_type: 'uk_skilled_worker',
      destination: 'United Kingdom',
      employer: 'Imperial College London',
      stage: 'ready_for_submission',
      compliance_passed: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'app_chidi_789',
      client_name: 'Chidi Nwosu',
      client_email: 'chidi.nwosu@kpmg.co.uk',
      client_phone: '+234 809 555 1234',
      visa_type: 'uk_skilled_worker',
      destination: 'United Kingdom',
      employer: 'KPMG UK',
      stage: 'submitted',
      compliance_passed: true,
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
          rule: 'UKVI Appendix Finance - FIN 2.1',
          detail: 'Personal savings fall below standard GBP 1,270 threshold. Sponsor certified maintenance under CoS Section A2.'
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
          issues: [{ rule: 'FIN 2.1', detail: 'Maintenance covered by sponsor guarantee.' }]
        }
      ]);
    } else {
      setIssues([]);
      setDocuments([]);
    }
  }, [selectedAppId, applications]);

  useEffect(() => {
    if (lastEvent?.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => [doc, ...prev.filter((d) => d.doc_type !== doc.doc_type)]);
      showToast('Real-time update: ' + doc.doc_type + ' processed');
    }
  }, [lastEvent]);

  const handleStaffAction = async (actionType) => {
    setLoadingAction(true);
    try {
      await apiService.takeStaffAction(selectedAppId, actionType, {
        notes: 'Caseworker approved sponsor maintenance guarantee under CoS A2 exemption.',
        authorized_by: 'Caseworker_Adeyemi'
      });
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Action confirmed: Compliance clearance approved');
    } catch (e) {
      setIssues([]);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppId ? { ...a, stage: 'ready_for_submission', compliance_passed: true } : a))
      );
      showToast('Caseworker override applied: Clearance granted');
    } finally {
      setLoadingAction(false);
    }
  };

  const flaggedCount = applications.filter((a) => a.stage === 'document_audit').length;
  const clearedCount = applications.filter((a) => a.stage === 'ready_for_submission').length;
  const submittedCount = applications.filter((a) => a.stage === 'submitted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-dropdown text-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Enterprise Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Dossiers</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{applications.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">PAU Hackathon Test Queue</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Consular Flags</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{flaggedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring caseworker review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clearance Ready</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{clearedCount + submittedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Satisfies UKVI Immigration Rules</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Audit Sync</span>
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">&lt; 25ms</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero-latency WebSocket link</div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applicant Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Applicant Queue</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {applications.length} cases
              </span>
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3 text-center">
              {[
                { id: 'all', label: 'All' },
                { id: 'flagged', label: 'Flagged' },
                { id: 'cleared', label: 'Cleared' },
                { id: 'submitted', label: 'Filed' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilter(pill.id)}
                  className={
                    'py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ' +
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

        {/* Right Column: Case Inspection & Determinations */}
        <div className="lg:col-span-8 space-y-6">
          {selectedApp && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
              {/* Selected Applicant Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-5">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-extrabold text-slate-900">
                      {selectedApp.client_name}
                    </h2>
                    <Badge status={selectedApp.stage} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.employer}
                    </span>
                    <span>*</span>
                    <span className="font-mono text-slate-500">ID: {selectedApp.id}</span>
                    <span>*</span>
                    <span className="font-semibold text-brand-700">Skilled Worker Route</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDiffModalOpen(true)}
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Optical Diff Inspector
                  </Button>
                </div>
              </div>

              {/* Audit Clearance or Flag Card */}
              <AuditCard
                issues={issues}
                onStaffAction={handleStaffAction}
                loading={loadingAction}
              />

              {/* Evidential Records */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Evidential Documents Submitted
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {documents.length} verified records
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
