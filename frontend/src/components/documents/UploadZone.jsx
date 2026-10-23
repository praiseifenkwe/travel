import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../shared/Button';

export const UploadZone = ({ onUpload, selectedDocType = 'passport', onTypeChange }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const docTypes = [
    { id: 'passport', label: 'International Passport', hint: 'Bio page with photo & validity' },
    { id: 'cos', label: 'Certificate of Sponsorship', hint: 'Issued by Bloomberg LP' },
    { id: 'bank_statement', label: '28-Day Bank Statement', hint: 'Personal savings / salary proof' },
    { id: 'tb_test', label: 'IOM TB Certificate', hint: 'IOM Lagos Medical Clearance' }
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

  const currentHint = docTypes.find((d) => d.id === selectedDocType)?.hint || '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Upload Supporting Document</h3>
          <p className="text-xs text-slate-500">Instant AI verification against UKVI requirements</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          UKVI Compliant
        </span>
      </div>

      {/* Select Document Type */}
      <div className="mb-3">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Select Document Type to Upload:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {docTypes.map((dt) => {
            const isSelected = selectedDocType === dt.id;
            return (
              <button
                key={dt.id}
                type="button"
                onClick={() => onTypeChange(dt.id)}
                className={
                  'text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ' +
                  (isSelected
                    ? 'bg-brand-50 text-brand-800 border-brand-300 ring-1 ring-brand-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200')
                }
              >
                <div>{dt.label}</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">{dt.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ' +
          (dragActive
            ? 'border-brand-500 bg-brand-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/60')
        }
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
                ? 'Scanning document & validating compliance...'
                : file
                ? file.name
                : 'Drop document here or click to browse'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Supports PDF, PNG, JPG up to 15MB
            </div>
          </div>
        </div>
      </div>

      {file && !uploading && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
            Remove
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartUpload}
            icon={<FileText className="w-4 h-4" />}
          >
            Scan & Verify
          </Button>
        </div>
      )}
    </div>
  );
};
