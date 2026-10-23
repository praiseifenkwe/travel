import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../shared/Button';

export const UploadZone = ({ onUpload, selectedDocType = 'passport', onTypeChange }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const docTypes = [
    { id: 'passport', label: 'Passport' },
    { id: 'flight_ticket', label: 'Flight Ticket' },
    { id: 'hotel_booking', label: 'Hotel Booking' },
    { id: 'bank_statement', label: 'Bank Statement' }
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Upload Trip Document</h3>
        <span className="text-xs text-slate-400">PDF, JPG, PNG (Max 15MB)</span>
      </div>

      {/* Document Type Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {docTypes.map((dt) => {
          const isSelected = selectedDocType === dt.id;
          return (
            <button
              key={dt.id}
              type="button"
              onClick={() => onTypeChange(dt.id)}
              className={
                'py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ' +
                (isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200')
              }
            >
              {dt.label}
            </button>
          );
        })}
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ' +
          (dragActive
            ? 'border-brand-500 bg-brand-50/40'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/60')
        }
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center gap-1.5">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-slate-400" />
          )}

          <div className="text-xs font-semibold text-slate-700 mt-1">
            {uploading
              ? 'Scanning document with AI...'
              : file
              ? file.name
              : 'Choose file or drag & drop'}
          </div>
        </div>
      </div>

      {file && !uploading && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartUpload}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Scan & Save
          </Button>
        </div>
      )}
    </div>
  );
};
