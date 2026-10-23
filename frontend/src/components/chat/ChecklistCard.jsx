import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Upload } from 'lucide-react';

export const ChecklistCard = ({ items = [], onSelectDocType }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-4 my-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Required Evidential Checklist</h4>
          <p className="text-[11px] text-slate-500">Mandatory artifacts for UKVI Skilled Worker clearance</p>
        </div>
        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
          Active Intake
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const isUploaded = item.status === 'uploaded' || item.status === 'passed' || item.status === 'flagged';
          const isFlagged = item.status === 'flagged';

          return (
            <div
              key={item.id}
              className="lex items-center justify-between p-3 rounded-xl border text-xs transition-all "
            >
              <div className="flex items-center gap-2.5">
                {isFlagged ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : isUploaded ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500">
                    {isFlagged ? 'Flagged for Consular Review' : isUploaded ? 'Verified by OCR' : 'Pending upload'}
                  </div>
                </div>
              </div>

              {!isUploaded && onSelectDocType && (
                <button
                  type="button"
                  onClick={() => onSelectDocType(item.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-subtle transition-all cursor-pointer"
                >
                  Upload
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
