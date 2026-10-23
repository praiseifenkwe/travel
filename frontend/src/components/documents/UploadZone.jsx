import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Document Ingestion & OCR Extraction</h3>
          <p className="text-xs text-slate-500">Automated field mapping & compliance check</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          GPT-4o Vision
        </span>
      </div>

      {/* Doc Type Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {docTypes.map((dt) => {
          const isSelected = selectedDocType === dt.id;
          return (
            <button
              key={dt.id}
              type="button"
              onClick={() => onTypeChange(dt.id)}
              className="	ext-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer "
            >
              {dt.label}
            </button>
          );
        })}
      </div>

      {/* Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="
elative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer "
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-subtle flex items-center justify-center text-slate-600">
              <UploadCloud className="w-5 h-5 text-brand-600" />
            </div>
          )}

          <div>
            <div className="text-sm font-semibold text-slate-800">
              {uploading
                ? 'Processing OCR & running compliance engine...'
                : file
                ? file.name
                : 'Upload document or drag and drop'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              PDF, PNG, JPG up to 15MB
            </div>
          </div>
        </div>
      </div>

      {file && !uploading && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartUpload}
            icon={<FileText className="w-4 h-4" />}
          >
            Analyze Document
          </Button>
        </div>
      )}
    </div>
  );
};
