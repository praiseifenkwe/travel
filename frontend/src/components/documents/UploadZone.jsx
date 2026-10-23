import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../shared/Button';

export const UploadZone = ({ onUpload, selectedDocType = 'passport', onTypeChange }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const docTypes = [
    { id: 'passport', label: 'Passport (Bio Page)' },
    { id: 'cos', label: 'Certificate of Sponsorship (CoS)' },
    { id: 'bank_statement', label: '28-Day Bank Statement' },
    { id: 'tb_test', label: 'IOM TB Test Certificate' }
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
    try {
      await onUpload(selectedDocType, file);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>AI Multimodal Document Ingestion</h4>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG (Max 15MB)</span>
      </div>

      {/* Doc Type Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
        {docTypes.map((dt) => (
          <button
            key={dt.id}
            type="button"
            onClick={() => onTypeChange(dt.id)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedDocType === dt.id ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
              background: selectedDocType === dt.id ? 'rgba(99, 102, 241, 0.18)' : 'rgba(15, 23, 42, 0.4)',
              color: selectedDocType === dt.id ? '#ffffff' : 'var(--text-secondary)',
              textAlign: 'left',
              transition: 'all 0.2s ease'
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
          border: dragActive ? '2px dashed var(--accent-cyan)' : '2px dashed var(--border-subtle)',
          borderRadius: 12,
          padding: '24px 16px',
          textAlign: 'center',
          background: dragActive ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.3)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UploadCloud size={24} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {file ? file.name : 'Click to upload or drag & drop'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB ready for GPT-4o OCR` : 'Emits instant WebSocket audit payload'}
            </div>
          </div>
        </div>
      </div>

      {file && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            onClick={handleStartUpload}
            loading={uploading}
            icon={<FileText size={16} />}
          >
            Analyze {selectedDocType.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  );
};
