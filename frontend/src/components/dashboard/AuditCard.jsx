import React from 'react';
import { ShieldCheck, AlertTriangle, Check, HelpCircle, Send } from 'lucide-react';
import { Button } from '../shared/Button';

export const AuditCard = ({ issues = [], onStaffAction, loading }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="bg-emerald-50/70 border-l-4 border-l-emerald-500 border border-emerald-200 rounded-2xl p-4 mb-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">All Travel Documents Approved</h4>
              <p className="text-[11px] text-emerald-800">
                Passport validity, return flight reservation, and accommodation proof are fully compliant.
              </p>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => onStaffAction('authorize_submit')}
            loading={loading}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Issue Official Travel Itinerary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200 rounded-2xl p-4 mb-5 shadow-subtle">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-amber-950">
            Document Verification Note
          </h4>
          <p className="text-[11px] text-amber-800">
            Please verify the applicant's travel document details before issuing the final pack.
          </p>
        </div>
      </div>

      <div className="space-y-2 my-3">
        {issues.map((iss, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 text-xs shadow-subtle">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-slate-900">{iss.rule}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Agent Review
              </span>
            </div>
            <p className="text-slate-600">{iss.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onStaffAction('approve_subsistence')}
          loading={loading}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          Approve Funds & Document Pack
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStaffAction('request_statement')}
          loading={loading}
          icon={<HelpCircle className="w-3.5 h-3.5" />}
        >
          Request Updated Bank Record
        </Button>
      </div>
    </div>
  );
};
