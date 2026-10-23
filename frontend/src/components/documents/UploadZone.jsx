import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../shared/Button';

export const UploadZone = ({ onUpload, selectedDocType = 'passport', onTypeChange }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const docTypes = [
    { id: 'passport', label: 'Passport (Bio Page)' },
    { id: 'cos', label: 'Certificate of Sponsorship' },
    { id: 'bank_statement', label: '28-Day Bank Statement' },
    { id: 'tb_test', label: 'IOM TB Certificate' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
    try {
      await onUpload(selectedDocType, file);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="tf-card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>Document Ingestion & OCR Extraction</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Automated field mapping & compliance check</div>
        </div>
        <span className="badge badge-processing">GPT-4o Vision</span>
      </div>

      {/* Doc Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 12 }}>
        {docTypes.map((dt) => (
          <button
            key={dt.id}
            type="button"
            onClick={() => onTypeChange(dt.id)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: selectedDocType === dt.id ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
              background: selectedDocType === dt.id ? 'var(--bg-surface-elevated)' : 'var(--bg-subtle)',
              color: selectedDocType === dt.id ? '#ffffff' : 'var(--text-secondary)',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '1px dashed #3b82f6' : '1px dashed var(--border-medium)',
          borderRadius: 8,
          padding: '20px 14px',
          textAlign: 'center',
          background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-subtle)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
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
            height: '100%'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {uploading ? (
            <Loader2 size={22} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <UploadCloud size={22} color="#8e94a4" />
          )}

          <div style={{ fontSize: '0.84rem', fontWeight: 500 }}>
            {uploading ? 'Processing OCR & running compliance engine...' : file ? file.name : 'Upload file or drag and drop'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            PDF, PNG, JPG up to 15MB
          </div>
        </div>
      </div>

      {file && !uploading && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleStartUpload} icon={<FileText size={14} />}>
            Analyze Document
          </Button>
        </div>
      )}
    </div>
  );
};
