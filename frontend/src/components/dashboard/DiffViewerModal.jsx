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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-dropdown max-w-2xl w-full p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Optical Diff Verification
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Side-by-side reconciliation between applicant intake declaration and passport biometric data
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Field Attribute</th>
                <th className="p-3">Client Declared</th>
                <th className="p-3">OCR Biometric Extracted</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((f, i) => {
                const isMatch = f.client.toLowerCase() === f.ocr.toLowerCase() || f.ocr.includes(f.client);
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{f.label}</td>
                    <td className="p-3 text-slate-600">{f.client}</td>
                    <td className="p-3 font-mono text-slate-900 font-medium">{f.ocr}</td>
                    <td className="p-3 text-right">
                      {isMatch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Diff
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Accept Bio Variance & Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
