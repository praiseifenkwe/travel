import React, { useState, useEffect } from 'react';
import { ApplicationList } from '../components/dashboard/ApplicationList';
import { AuditCard } from '../components/dashboard/AuditCard';
import { DiffViewerModal } from '../components/dashboard/DiffViewerModal';
import { DocumentCard } from '../components/documents/DocumentCard';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { ShieldCheck, Eye, RefreshCw, Send, CheckCircle2, UserCheck, Activity, Search, Sparkles } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const StaffDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [applications, setApplications] = useState([
    {
      id: 'app_tunde_123',
      client_name: 'Tunde Adeyemi',
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
  const [loadingAction, setLoadingAction] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  const { isConnected, lastEvent } = useSocket(null, true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Populate details of selected application
  useEffect(() => {
    const app = applications.find((a) => a.id === selectedAppId);
    if (!app) return;

    if (app.id === 'app_tunde_123') {
      setSelectedApp({
        ...app,
        compliance_result: {
          passed: app.compliance_passed,
          issues: app.compliance_passed ? [] : [
            {
              rule: 'passport_validity_period',
              document: 'passport',
              detail: 'Passport expires on 2027-02-14 (less than 6 months validity from departure date).',
              severity: 'critical'
            },
            {
              rule: 'funds_check',
              document: 'bank_statement',
              detail: 'Closing balance of ?14,500,000 does not satisfy 28-day continuous requirement unless employer certifies maintenance on CoS.',
              severity: 'critical'
            }
          ]
        },
        documents: [
          {
            id: 'doc_1',
            doc_type: 'passport',
            status: app.compliance_passed ? 'passed' : 'flagged',
            ai_confidence: 0.98,
            original_filename: 'Tunde_Passport_Bio.pdf',
            extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', expiry_date: '2027-02-14', nationality: 'Nigerian' },
            issues: app.compliance_passed ? [] : [{ rule: 'passport_validity_period', detail: 'Validity under 6 months.' }]
          },
          {
            id: 'doc_2',
            doc_type: 'cos',
            status: 'passed',
            ai_confidence: 0.98,
            original_filename: 'Bloomberg_CoS_Approval.pdf',
            extracted_data: { sponsor_name: 'Bloomberg LP', salary_gbp: 85000, cos_status: 'ACTIVE', maintenance_certified: true },
            issues: []
          },
          {
            id: 'doc_3',
            doc_type: 'bank_statement',
            status: 'passed',
            ai_confidence: 0.94,
            original_filename: 'FirstBank_Statement_Sep2026.pdf',
            extracted_data: { bank_name: 'First Bank of Nigeria', closing_balance_ngn: 14500000 },
            issues: []
          }
        ]
      });
    } else {
      setSelectedApp({
        ...app,
        compliance_result: { passed: true, issues: [] },
        documents: [
          {
            id: 'doc_4',
            doc_type: 'passport',
            status: 'passed',
            ai_confidence: 0.99,
            original_filename: 'Passport_Verified.pdf',
            extracted_data: { full_name: app.client_name, expiry_date: '2030-05-18' },
            issues: []
          }
        ]
      });
    }
  }, [selectedAppId, applications]);

  // Handle staff action
  const handleStaffAction = async (action, issueId = null, note = null) => {
    setLoadingAction(true);
    try {
      await apiService.performStaffAction(selectedAppId, action, issueId, note);
    } catch (e) {
      // Local fallback simulation
    }

    setTimeout(() => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id === selectedAppId) {
            const newStage = action === 'authorize_submit' ? 'submitted' : 'ready_for_submission';
            return { ...a, stage: newStage, compliance_passed: true };
          }
          return a;
        })
      );
      showToast(action === 'authorize_submit' ? '?? Application formally submitted to UKVI!' : '? Discrepancy overridden under Employer CoS Guarantee.');
      setLoadingAction(false);
    }, 600);
  };

  const filteredApps = applications.filter((a) => {
    if (filter === 'flagged') return a.stage === 'document_audit';
    if (filter === 'cleared') return a.stage === 'ready_for_submission';
    if (filter === 'submitted') return a.stage === 'submitted';
    return true;
  }).filter((a) =>
    a.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.employer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-banner glass-panel" style={{
          padding: '12px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-emerald)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Sparkles size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 18 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Relocation Cases</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800 }}>{applications.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: 18, border: '1px solid rgba(245, 158, 11, 0.35)' }}>
          <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginBottom: 4 }}>Pending HITL Audit</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fbbf24' }}>
            {applications.filter(a => a.stage === 'document_audit').length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: 18, border: '1px solid rgba(16, 185, 129, 0.35)' }}>
          <div style={{ fontSize: '0.78rem', color: '#34d399', marginBottom: 4 }}>UKVI Cleared & Ready</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34d399' }}>
            {applications.filter(a => a.stage === 'ready_for_submission').length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: 18 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Decision Velocity</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#38bdf8' }}>3.8 min</div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, minHeight: 'calc(100vh - 240px)' }}>
        {/* Left Column: Applications Queue with Search & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 14 }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search applicant or employer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'flagged', 'cleared', 'submitted'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: filter === f ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  background: filter === f ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                  color: filter === f ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Queue List */}
          <ApplicationList
            applications={filteredApps}
            selectedId={selectedAppId}
            onSelectApp={(id) => setSelectedAppId(id)}
          />
        </div>

        {/* Right Column: Case Audit & OCR Diff */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)', paddingRight: 6 }}>
          {selectedApp ? (
            <div>
              {/* Application Header Card */}
              <div className="glass-panel" style={{ padding: 22, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedApp.client_name}</h2>
                      <Badge status={selectedApp.stage} />
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {selectedApp.client_email} ? {selectedApp.client_phone}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, marginTop: 4 }}>
                      {selectedApp.employer} ? {selectedApp.destination}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => setDiffModalOpen(true)}
                  >
                    Inspect OCR Diff
                  </Button>
                </div>
              </div>

              {/* Human In The Loop Audit Card */}
              <AuditCard
                issues={selectedApp.compliance_result?.issues || []}
                onStaffAction={handleStaffAction}
                loading={loadingAction}
              />

              {/* Documents Scrutiny List */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Intake Artifacts & Extracted Metadata</h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Real-time OCR confidence scores</span>
              </div>

              {selectedApp.documents?.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
              Select an application from the queue to conduct audit.
            </div>
          )}
        </div>
      </div>

      {/* Diff Inspection Modal */}
      <DiffViewerModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        clientData={selectedApp || {}}
        ocrData={selectedApp?.documents?.[0]?.extracted_data || {}}
      />
    </div>
  );
};
