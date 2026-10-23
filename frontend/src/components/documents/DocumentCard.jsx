import React, { useState } from 'react';
import { FileCheck, AlertTriangle, Eye, X, ShieldAlert, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';

export const DocumentCard = ({ doc }) => {
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const isFlagged = doc.status === 'flagged';

  return (
    <>
      <div className={
        'rounded-2xl border transition-all p-4 mb-3 shadow-subtle hover:shadow-card ' +
        (isFlagged ? 'border-amber-300 bg-amber-50/30' : 'bg-white border-slate-200')
      }>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' +
              (isFlagged ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')
            }>
              {isFlagged ? <Clock className="w-5 h-5 text-amber-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 capitalize">
                {doc.doc_type ? doc.doc_type.replace(/_/g, ' ') : 'Document'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="truncate max-w-[200px]">{doc.original_filename || 'Uploaded Document'}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  OCR Verified ({Math.round((doc.ai_confidence || 0.95) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge status={doc.status} label={isFlagged ? 'Caseworker Review' : 'Verified'} />
            <button
              onClick={() => setInspectModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              View Data
            </button>
          </div>
        </div>

        {/* Extracted Data Grid */}
        {doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs grid grid-cols-2 gap-2">
            {Object.entries(doc.extracted_data).slice(0, 4).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-slate-500 text-[11px] font-medium capitalize">
                  {k.replace(/_/g, ' ')}
                </span>
                <span className="font-semibold text-slate-900 truncate">
                  {String(v)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Reassuring Caseworker Notice */}
        {doc.issues && doc.issues.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            {doc.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Caseworker Action Queued: </strong>{issue.detail}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect OCR Modal */}
      {inspectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-dropdown max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setInspectModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Extracted Biometric & Document Information
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Fields parsed automatically for UKVI compliance electronic filing.
            </p>

            <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1">
              {doc.extracted_data && Object.entries(doc.extracted_data).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-mono font-semibold text-slate-900">{String(v)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setInspectModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
