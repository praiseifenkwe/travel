import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Upload, ArrowUpRight } from 'lucide-react';

export const ChecklistCard = ({ items = [], onSelectDocType }) => {
  return (
    <div className="tf-card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Required Evidential Checklist</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mandatory artifacts for UKVI Skilled Worker clearance</div>
        </div>
        <span className="badge badge-processing">Active Intake</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => {
          const isUploaded = item.status === 'uploaded' || item.status === 'passed' || item.status === 'flagged';
          const isFlagged = item.status === 'flagged';

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 6,
                background: isFlagged ? 'var(--warning-subtle)' : isUploaded ? 'var(--success-subtle)' : 'var(--bg-subtle)',
                border: isFlagged ? '1px solid var(--warning-border)' : isUploaded ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isFlagged ? (
                  <AlertCircle size={15} color="#fbbf24" />
                ) : isUploaded ? (
                  <CheckCircle2 size={15} color="#10b981" />
                ) : (
                  <Clock size={15} color="#64748b" />
                )}
                <div>
                  <span style={{ fontWeight: 500, color: '#fff' }}>{item.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    {isFlagged ? 'Flagged for Consular Review' : isUploaded ? 'Verified' : 'Pending upload'}
                  </span>
                </div>
              </div>

              {!isUploaded && onSelectDocType && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectDocType(item.id)}
                  style={{ padding: '3px 8px', fontSize: '0.72rem', height: 24 }}
                >
                  Upload
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
