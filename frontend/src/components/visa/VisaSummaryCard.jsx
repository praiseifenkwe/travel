import React from 'react';
import { FileText, CheckCircle, Shield } from 'lucide-react';

export const VisaSummaryCard = ({ appData = {} }) => {
  return (
    <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} color="#818cf8" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>UKVI Form Auto-Fill Preview</h4>
        </div>
        <span className="badge badge-passed">Ready For Electronic Submission</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: '0.8rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 10, borderRadius: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Visa Category:</span>
          <div style={{ fontWeight: 700, color: '#fff' }}>Skilled Worker (Tier 2 General)</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 10, borderRadius: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Sponsor / Employer:</span>
          <div style={{ fontWeight: 700, color: '#fff' }}>{appData.employer || 'Bloomberg LP'}</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 10, borderRadius: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Immigration Health Surcharge (IHS):</span>
          <div style={{ fontWeight: 700, color: '#38bdf8' }}>?3,105 (3-Year Coverage)</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 10, borderRadius: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>Biometrics Location:</span>
          <div style={{ fontWeight: 700, color: '#fff' }}>TLScontact Victoria Island, Lagos</div>
        </div>
      </div>
    </div>
  );
};
