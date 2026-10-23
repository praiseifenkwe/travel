import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Check, HelpCircle, Send } from 'lucide-react';
import { Button } from '../shared/Button';

export const AuditCard = ({ issues = [], onStaffAction, loading }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 20, textAlign: 'center', marginBottom: 20 }}>
        <CheckCircle2 size={36} color="#34d399" style={{ margin: '0 auto 10px' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>Immigration Compliance Cleared</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
          All mandatory documents meet UKVI Skilled Worker criteria. Ready for formal submission.
        </p>
        <div style={{ marginTop: 14 }}>
          <Button
            variant="success"
            size="sm"
            onClick={() => onStaffAction('authorize_submit')}
            loading={loading}
            icon={<Send size={14} />}
          >
            Authorize UKVI Submission
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: 20, marginBottom: 20, border: '1px solid rgba(245, 158, 11, 0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={20} color="#fbbf24" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
            Human-in-the-Loop Audit Required
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Deterministic compliance engine detected rule deviations
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {issues.map((issue, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: 14,
              borderRadius: 10,
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fef08a', marginBottom: 4 }}>
              Rule: {issue.rule.replace(/_/g, ' ').toUpperCase()} ({issue.document})
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
              {issue.detail}
            </div>

            {/* Consultant HITL Action Buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="success"
                size="sm"
                onClick={() => onStaffAction('override_issue', issue.rule, 'Employer confirms maintenance guarantee under CoS section A2')}
                loading={loading}
                icon={<Check size={14} />}
              >
                Approve Under Employer Guarantee
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => onStaffAction('query_client', issue.rule, 'Please provide alternative 28-day statement with closing balance >= ?1,270')}
                loading={loading}
                icon={<HelpCircle size={14} />}
              >
                Query Applicant
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
