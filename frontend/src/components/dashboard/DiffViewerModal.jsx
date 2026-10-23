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
    { label: 'Passport Expiry Date', client: '2027-02-14', ocr: ocrData.expiry_date || '2027-02-14' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 20
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: 700, padding: 24, position: 'relative' }}>
        <button
          onClick={onClose}
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

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>
          OCR vs Applicant Form Diff Verification
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Side-by-side reconciliation between applicant self-declaration and automated Vision OCR
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fields.map((f, i) => {
            const isMatch = f.client.toLowerCase() === f.ocr.toLowerCase();
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 2fr 0.5fr',
                  gap: 12,
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: isMatch ? 'rgba(15, 23, 42, 0.4)' : 'rgba(245, 158, 11, 0.1)',
                  border: isMatch ? '1px solid var(--border-subtle)' : '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontSize: '0.84rem' }}>{f.client}</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isMatch ? '#34d399' : '#fef08a' }}>{f.ocr}</div>
                <div>{isMatch ? <Check size={16} color="#34d399" /> : <AlertTriangle size={16} color="#fbbf24" />}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Approve OCR Match
          </Button>
        </div>
      </div>
    </div>
  );
};
