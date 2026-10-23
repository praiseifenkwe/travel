import React, { useState } from 'react';
import { FileCheck, AlertTriangle, ShieldCheck, Eye, X, CheckCircle2 } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';

export const DocumentCard = ({ doc }) => {
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const isFlagged = doc.status === 'flagged';
  const isPassed = doc.status === 'passed';

  return (
    <>
      <div
        className="glass-panel"
        style={{
          padding: 18,
          marginBottom: 14,
          border: isFlagged ? '1px solid rgba(245, 158, 11, 0.45)' : undefined,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: isFlagged ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 185, 129, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isFlagged ? (
                <AlertTriangle size={20} color="#fbbf24" />
              ) : (
                <FileCheck size={20} color="#34d399" />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {doc.doc_type?.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {doc.original_filename || 'Uploaded Document'} ? Confidence: {Math.round((doc.ai_confidence || 0.95) * 100)}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge status={doc.status} />
            <button
              onClick={() => setInspectModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                padding: '5px 10px',
                borderRadius: 6,
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Eye size={12} />
              Details
            </button>
          </div>
        </div>

        {/* Extracted Fields Summary */}
        {doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            padding: 12,
            borderRadius: 8,
            fontSize: '0.8rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            marginBottom: 10
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
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#fef08a'
          }}>
            {doc.issues.map((issue, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>??</span>
                <span>{issue.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect OCR Modal */}
      {inspectModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 20
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 600, padding: 24, position: 'relative' }}>
            <button
              onClick={() => setInspectModalOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>
              GPT-4o Vision OCR Extraction
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              {doc.doc_type?.toUpperCase()} ? Extracted with {Math.round((doc.ai_confidence || 0.95) * 100)}% model certainty
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {doc.extracted_data && Object.entries(doc.extracted_data).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.6)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {k.replace(/_/g, ' ')}
                  </span>
                  <span className="mono" style={{ color: '#38bdf8', fontWeight: 600 }}>
                    {String(v)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={() => setInspectModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
