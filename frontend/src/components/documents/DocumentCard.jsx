import React, { useState } from 'react';
import { FileCheck, AlertTriangle, Eye, X } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';

export const DocumentCard = ({ doc }) => {
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const isFlagged = doc.status === 'flagged';

  return (
    <>
      <div
        className="tf-card"
        style={{
          padding: 14,
          marginBottom: 10,
          border: isFlagged ? '1px solid var(--warning-border)' : '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isFlagged ? (
              <AlertTriangle size={16} color="#fbbf24" />
            ) : (
              <FileCheck size={16} color="#10b981" />
            )}
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.86rem', textTransform: 'capitalize' }}>
                {doc.doc_type?.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                {doc.original_filename || 'Uploaded Document'} ? Confidence: {Math.round((doc.ai_confidence || 0.95) * 100)}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Badge status={doc.status} />
            <button
              onClick={() => setInspectModalOpen(true)}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 8px',
                borderRadius: 4,
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              Inspect OCR
            </button>
          </div>
        </div>

        {/* Extracted Data Row */}
        {doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '8px 10px',
            borderRadius: 6,
            fontSize: '0.76rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 6
          }}>
            {Object.entries(doc.extracted_data).slice(0, 4).map(([k, v]) => (
              <div key={k}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}:</span>{' '}
                <strong style={{ color: '#fff' }}>{String(v)}</strong>
              </div>
            ))}
          </div>
        )}

        {/* Issues */}
        {doc.issues && doc.issues.length > 0 && (
          <div style={{
            background: 'var(--warning-subtle)',
            border: '1px solid var(--warning-border)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: '0.74rem',
            color: '#fbbf24',
            marginTop: 8
          }}>
            {doc.issues.map((issue, idx) => (
              <div key={idx}>?? {issue.detail}</div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect OCR Modal */}
      {inspectModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 20
        }}>
          <div className="tf-card" style={{ width: '100%', maxWidth: 540, padding: 22, position: 'relative', background: '#0e1017' }}>
            <button
              onClick={() => setInspectModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#8e94a4', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 2 }}>
              Raw OCR Extraction Metadata
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              {doc.doc_type?.toUpperCase()} ? Extracted with {Math.round((doc.ai_confidence || 0.95) * 100)}% model confidence
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              {doc.extracted_data && Object.entries(doc.extracted_data).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-subtle)', borderRadius: 4, fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                  <span className="mono" style={{ color: '#fff' }}>{String(v)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="sm" onClick={() => setInspectModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
