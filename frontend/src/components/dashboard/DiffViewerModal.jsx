import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../shared/Button';

export const DiffViewerModal = ({ isOpen, onClose, clientData = {}, ocrData = {} }) => {
  if (!isOpen) return null;

  const fields = [
    { label: 'Full Legal Name', client: clientData.client_name || 'Tunde Adeyemi', ocr: ocrData.full_name || 'Tunde Babatunde Adeyemi' },
    { label: 'Nationality', client: 'Nigerian', ocr: ocrData.nationality || 'Nigerian' },
    { label: 'Passport Number', client: 'A12345678', ocr: ocrData.passport_number || 'A12345678' },
    { label: 'Sponsoring Employer', client: clientData.employer || 'Bloomberg LP', ocr: 'Bloomberg LP' },
    { label: 'Passport Expiry Date', client: '2029-03-15', ocr: ocrData.expiry_date || '2029-03-15' }
  ];

  return (
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
      <div className="tf-card" style={{ width: '100%', maxWidth: 640, padding: 22, position: 'relative', background: '#0e1017' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#8e94a4', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 2 }}>
          Optical Diff Verification (Applicant vs Machine Extraction)
        </h3>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Side-by-side reconciliation between applicant intake declaration and passport biometric data
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {fields.map((f, i) => {
            const isMatch = f.client.toLowerCase() === f.ocr.toLowerCase();
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 2fr 0.4fr',
                  gap: 10,
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: isMatch ? 'var(--bg-subtle)' : 'var(--warning-subtle)',
                  border: isMatch ? '1px solid var(--border-subtle)' : '1px solid var(--warning-border)',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{f.label}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{f.client}</div>
                <div style={{ fontWeight: 600, color: isMatch ? '#34d399' : '#fbbf24' }}>{f.ocr}</div>
                <div>{isMatch ? <Check size={14} color="#34d399" /> : <AlertTriangle size={14} color="#fbbf24" />}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Acknowledge & Reconcile
          </Button>
        </div>
      </div>
    </div>
  );
};
