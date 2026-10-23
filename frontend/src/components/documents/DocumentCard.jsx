import React from 'react';
import { FileCheck, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '../shared/Badge';

export const DocumentCard = ({ doc }) => {
  const isFlagged = doc.status === 'flagged';
  const isPassed = doc.status === 'passed';

  return (
    <div
      className="glass-panel"
      style={{
        padding: 16,
        marginBottom: 12,
        border: isFlagged ? '1px solid rgba(245, 158, 11, 0.4)' : undefined
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: isFlagged ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isFlagged ? (
              <AlertTriangle size={18} color="#fbbf24" />
            ) : (
              <FileCheck size={18} color="#34d399" />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
              {doc.doc_type}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {doc.original_filename || 'Uploaded Document'} ? Confidence: {Math.round((doc.ai_confidence || 0.95) * 100)}%
            </div>
          </div>
        </div>

        <Badge status={doc.status} />
      </div>

      {/* Extracted Fields Summary */}
      {doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          padding: 10,
          borderRadius: 8,
          fontSize: '0.78rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 6,
          marginBottom: 8
        }}>
          {Object.entries(doc.extracted_data).slice(0, 4).map(([k, v]) => (
            <div key={k}>
              <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {k.replace(/_/g, ' ')}:
              </span>{' '}
              <strong style={{ color: '#fff' }}>{String(v)}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Issues if any */}
      {doc.issues && doc.issues.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.75rem',
          color: '#fef08a'
        }}>
          {doc.issues.map((issue, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span>??</span>
              <span>{issue.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
