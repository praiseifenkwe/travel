import React from 'react';
import { ShieldCheck, AlertTriangle, Check, HelpCircle, Send } from 'lucide-react';
import { Button } from '../shared/Button';

export const AuditCard = ({ issues = [], onStaffAction, loading }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="bg-emerald-50/70 border-l-4 border-l-emerald-500 border border-emerald-200 rounded-2xl p-5 mb-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-subtle">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Compliance Clearance Granted</h4>
              <p className="text-xs text-emerald-800">
                All evidential requirements satisfy official UKVI Immigration Rules without Section 320 refusals.
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
            Authorize UKVI Submission
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200 rounded-2xl p-5 mb-5 shadow-subtle">
      <div className="flex items-center gap-2.5 mb-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-950">
            Consular Discrepancy Flagged
          </h4>
          <p className="text-xs text-amber-800">
            {issues.length} item(s) require licensed caseworker determination prior to submission.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 my-4">
        {issues.map((iss, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs shadow-subtle">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-slate-900 font-mono">{iss.rule}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Requires Determination
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{iss.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onStaffAction('approve_sponsor_guarantee')}
          loading={loading}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          Approve CoS Maintenance Guarantee
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStaffAction('request_fresh_doc')}
          loading={loading}
          icon={<HelpCircle className="w-3.5 h-3.5" />}
        >
          Request Updated Bank Statement
        </Button>
      </div>
    </div>
  );
};
