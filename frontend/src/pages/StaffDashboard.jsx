import React, { useState, useEffect } from 'react';
import { ApplicationList } from '../components/dashboard/ApplicationList';
import { AuditCard } from '../components/dashboard/AuditCard';
import { DiffViewerModal } from '../components/dashboard/DiffViewerModal';
import { DocumentCard } from '../components/documents/DocumentCard';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Shield, Eye, Search, Check, AlertTriangle, UserCheck, ArrowUpRight } from 'lucide-react';
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
    setTimeout(() => setToastMessage(null), 3500);
  };

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
              rule: 'funds_check',
              document: 'bank_statement',
              detail: 'Personal balance does not meet ?1,270 threshold without sponsor certification under CoS Section A2.',
              severity: 'critical'
            }
          ]
        },
        documents: [
          {
            id: 'doc_1',
            doc_type: 'passport',
            status: 'passed',
            ai_confidence: 0.98,
            original_filename: 'Tunde_Passport_Bio.pdf',
            extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', expiry_date: '2029-03-15', nationality: 'Nigerian' },
            issues: []
          },
          {
            id: 'doc_2',
            doc_type: 'cos',
            status: 'passed',
            ai_confidence: 0.99,
            original_filename: 'Bloomberg_CoS_Approval.pdf',
            extracted_data: { sponsor_name: 'Bloomberg LP', salary_gbp: 85000, cos_status: 'ACTIVE', maintenance_certified: true },
            issues: []
          },
          {
            id: 'doc_3',
            doc_type: 'bank_statement',
            status: app.compliance_passed ? 'passed' : 'flagged',
            ai_confidence: 0.94,
            original_filename: 'FirstBank_Statement_Sep2026.pdf',
            extracted_data: { bank_name: 'First Bank of Nigeria', closing_balance_ngn: 14500000 },
            issues: app.compliance_passed ? [] : [{ rule: 'funds_check', detail: 'Requires sponsor maintenance certification check.' }]
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
            original_filename: 'Passport_Bio.pdf',
            extracted_data: { full_name: app.client_name, expiry_date: '2030-05-18' },
            issues: []
          }
        ]
      });
    }
  }, [selectedAppId, applications]);

  const handleStaffAction = async (action, issueId = null, note = null) => {
    setLoadingAction(true);
    try {
      await apiService.performStaffAction(selectedAppId, action, issueId, note);
    } catch (e) {
      // Local fallback
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
      showToast(action === 'authorize_submit' ? 'Application authorized for UKVI electronic filing.' : 'Discrepancy resolved under CoS Section A2 guarantee.');
      setLoadingAction(false);
    }, 400);
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
        <div className="toast-banner tf-card" style={{
          padding: '8px 16px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Consular Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <div className="tf-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Active Cases
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{applications.length}</div>
        </div>
        <div className="tf-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Pending Consular Review
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fbbf24', marginTop: 2 }}>
            {applications.filter(a => a.stage === 'document_audit').length}
          </div>
        </div>
        <div className="tf-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            UKVI Cleared
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', marginTop: 2 }}>
            {applications.filter(a => a.stage === 'ready_for_submission').length}
          </div>
        </div>
        <div className="tf-card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Turnaround Velocity
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa', marginTop: 2 }}>3.8 min</div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18, minHeight: 'calc(100vh - 220px)' }}>
        {/* Left Column: Applications Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#8e94a4" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              className="input-field"
              placeholder="Filter applicant or sponsor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 34, fontSize: '0.82rem', height: 36 }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'flagged', 'cleared', 'submitted'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: filter === f ? '1px solid var(--border-medium)' : '1px solid transparent',
                  background: filter === f ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text-muted)'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Queue List */}
          <div className="tf-card" style={{ padding: 8, flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredApps.map((app) => {
                const isSelected = app.id === selectedAppId;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                      border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.86rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                        {app.client_name}
                      </span>
                      <Badge status={app.stage} />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {app.employer} ? {app.destination}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Audit Workspace */}
        <div style={{ overflowY: 'auto' }}>
          {selectedApp ? (
            <div>
              {/* Header Details */}
              <div className="tf-card" style={{ padding: 18, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selectedApp.client_name}</h2>
                      <Badge status={selectedApp.stage} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {selectedApp.client_email} ? {selectedApp.client_phone} ? Sponsoring Entity: <strong style={{ color: '#fff' }}>{selectedApp.employer}</strong>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Eye size={13} />}
                    onClick={() => setDiffModalOpen(true)}
                  >
                    OCR Diff View
                  </Button>
                </div>
              </div>

              {/* Audit Card */}
              <AuditCard
                issues={selectedApp.compliance_result?.issues || []}
                onStaffAction={handleStaffAction}
                loading={loadingAction}
              />

              {/* Verified Documents */}
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                Verified Evidential Artifacts
              </div>
              {selectedApp.documents?.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="tf-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Select an applicant from the queue.
            </div>
          )}
        </div>
      </div>

      <DiffViewerModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        clientData={selectedApp || {}}
        ocrData={selectedApp?.documents?.[0]?.extracted_data || {}}
      />
    </div>
  );
};
