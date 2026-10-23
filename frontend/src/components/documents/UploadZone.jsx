import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Scan, ShieldAlert } from 'lucide-react';
import { Button } from '../shared/Button';

export const UploadZone = ({ onUpload, selectedDocType = 'passport', onTypeChange }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const docTypes = [
    { id: 'passport', label: 'Passport (Bio Page)' },
    { id: 'cos', label: 'Certificate of Sponsorship (CoS)' },
    { id: 'bank_statement', label: '28-Day Bank Statement' },
    { id: 'tb_test', label: 'IOM TB Test Certificate' }
  ];

  const scanSteps = [
    'Scanning Machine Readable Zone (MRZ)...',
    'Extracting security watermark & biometric seal...',
    'Evaluating UKVI compliance rule matrices...'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!file) return;
    setUploading(true);
    setScanStep(0);

    // Simulated OCR stepper
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 600);

    try {
      await onUpload(selectedDocType, file);
      setFile(null);
    } finally {
      clearInterval(stepInterval);
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 22, marginBottom: 20, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scan size={18} color="#06b6d4" />
            Multimodal OCR Document Ingestion
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Instant computer vision field extraction & deterministic rule audit
          </p>
        </div>
        <span className="badge badge-processing">GPT-4o Vision</span>
      </div>

      {/* Doc Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
        {docTypes.map((dt) => (
          <button
            key={dt.id}
            type="button"
            onClick={() => onTypeChange(dt.id)}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedDocType === dt.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: selectedDocType === dt.id ? 'rgba(6, 182, 212, 0.16)' : 'rgba(15, 23, 42, 0.45)',
              color: selectedDocType === dt.id ? '#ffffff' : 'var(--text-secondary)',
              textAlign: 'left',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{dt.label}</span>
            {selectedDocType === dt.id && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} />}
          </button>
        ))}
      </div>

      {/* Drop Area with Laser Scanner Animation */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed var(--accent-cyan)' : '2px dashed var(--border-subtle)',
          borderRadius: 14,
          padding: '28px 18px',
          textAlign: 'center',
          background: dragActive ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.35)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        {uploading && (
          <div className="scanner-overlay">
            <div className="scanner-beam" />
          </div>
        )}

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={uploading}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            zIndex: 10
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: uploading ? 'rgba(6, 182, 212, 0.2)' : 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}>
            <UploadCloud size={26} color={uploading ? '#06b6d4' : '#818cf8'} />
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
              {uploading
                ? scanSteps[scanStep]
                : file
                ? file.name
                : 'Click to upload document or drag & drop'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {uploading
                ? 'Emits real-time document_processed WebSocket payload'
                : file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB ? Ready for AI Audit`
                : 'Supports PDF, JPEG, PNG ? Up to 25MB'}
            </div>
          </div>
        </div>
      </div>

      {file && !uploading && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFile(null)}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={handleStartUpload}
            loading={uploading}
            icon={<FileText size={16} />}
          >
            Analyze {selectedDocType.replace('_', ' ').toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  );
};
