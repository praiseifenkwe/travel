import React from 'react';
import { ShieldCheck, AlertTriangle, Check, HelpCircle, Send } from 'lucide-react';
import { Button } from '../shared/Button';

export const AuditCard = ({ issues = [], onStaffAction, loading }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="tf-card" style={{ padding: 18, marginBottom: 14, border: '1px solid var(--success-border)', background: 'var(--success-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={20} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34d399' }}>Immigration Compliance Cleared</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                All mandatory evidential requirements satisfy UKVI Skilled Worker Immigration Rules.
              </div>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => onStaffAction('authorize_submit')}
            loading={loading}
            icon={<Send size={13} />}
          >
            Authorize UKVI Filing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tf-card" style={{ padding: 18, marginBottom: 14, border: '1px solid var(--warning-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <AlertTriangle size={16} color="#fbbf24" />
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fbbf24' }}>
            Consular Discrepancy Flagged
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Deterministic rule check requires licensed immigration consultant intervention
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {issues.map((issue, idx) => (
          <div key={idx} style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fef08a', marginBottom: 2 }}>
              Rule: {issue.rule.replace(/_/g, ' ').toUpperCase()} ({issue.document})
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 10 }}>
              {issue.detail}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="success"
                size="sm"
                onClick={() => onStaffAction('override_issue', issue.rule, 'Employer confirms maintenance guarantee under CoS section A2')}
                loading={loading}
                icon={<Check size={13} />}
              >
                Approve Under CoS Section A2
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onStaffAction('query_client', issue.rule, 'Request additional 28-day continuous statement')}
                loading={loading}
                icon={<HelpCircle size={13} />}
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
