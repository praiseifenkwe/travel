import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Upload } from 'lucide-react';

export const ChecklistCard = ({ items = [], onSelectDocType }) => {
  return (
    <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Mandatory Relocation Checklist</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Required documents for UKVI compliance audit</p>
        </div>
        <span className="badge badge-processing">Active Intake</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.5)',
                border: isFlagged 
                  ? '1px solid rgba(245, 158, 11, 0.4)' 
                  : isUploaded 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isFlagged ? (
                  <AlertCircle size={18} color="#fbbf24" />
                ) : isUploaded ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : (
                  <Clock size={18} color="#94a3b8" />
                )}
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: isFlagged ? '#fbbf24' : isUploaded ? '#34d399' : 'var(--text-muted)' }}>
                    {isFlagged ? 'Discrepancy Flagged for HITL Review' : isUploaded ? 'Uploaded & Verified' : 'Awaiting Upload'}
                  </div>
                </div>
              </div>

              {!isUploaded && onSelectDocType && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectDocType(item.id)}
                  style={{ gap: 6 }}
                >
                  <Upload size={14} />
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
