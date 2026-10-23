import React from 'react';
import { X, CheckCircle2, Download, Printer } from 'lucide-react';
import { Button } from './Button';

export const DossierModal = ({ isOpen, onClose, appData = {}, documents = [] }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: 20
    }}>
      <div className="tf-card" style={{
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 26,
        position: 'relative',
        background: '#0e1017'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#8e94a4', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 18 }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
            IMMIGRATION COMPLIANCE VERIFICATION RECORD
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
            UKVI Skilled Worker Compliance Dossier
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case Ref: <span className="mono" style={{ color: '#fff' }}>UKVI-LOS-2026-9921-TF</span> ? TravelForge Deterministic Audit
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          padding: 12,
          background: 'var(--bg-subtle)',
          borderRadius: 6,
          fontSize: '0.78rem',
          marginBottom: 18
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Applicant:</div>
            <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>{appData.client_name || 'Tunde Babatunde Adeyemi'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Nationality:</div>
            <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>Nigerian</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Sponsoring Entity:</div>
            <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>{appData.employer || 'Bloomberg LP (UK)'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>CoS Number:</div>
            <div className="mono" style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>WAC2671049281 (Active)</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Maintenance Status:</div>
            <div style={{ fontWeight: 600, color: '#10b981', marginTop: 1 }}>Certified (CoS Sec A2)</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Biometrics Facility:</div>
            <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>TLScontact Victoria Island</div>
          </div>
        </div>

        {/* Evidence Table */}
        <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
          Evidential Audit Items
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {[
            { name: 'International Passport (Bio Page)', doc: 'A12345678', desc: 'Valid with Consultant Expiry Extension Override', score: '98% OCR Match' },
            { name: 'Certificate of Sponsorship (CoS)', doc: 'WAC2671049281', desc: 'Role: Senior Software Engineer (?85,000/yr)', score: '99% Certainty' },
            { name: 'IOM Tuberculosis Medical Clearance', doc: 'IOM-LOS-2026-8819', desc: 'Normal / Negative Chest Radiograph', score: '100% Cleared' },
            { name: '28-Day Financial Statement', doc: 'First Bank Nigeria', desc: 'Closing Balance: ?14,500,000 (> ?1,270 UKVI threshold)', score: '94% Confidence' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 4,
                background: 'var(--bg-subtle)',
                fontSize: '0.76rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <div>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{item.desc}</span>
                </div>
              </div>
              <span className="mono" style={{ color: '#10b981', fontWeight: 500 }}>{item.score}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="secondary" size="sm" onClick={() => window.print()} icon={<Printer size={13} />}>
            Print
          </Button>
          <Button variant="primary" size="sm" onClick={onClose} icon={<Download size={13} />}>
            Export Verified PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
