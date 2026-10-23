import React from 'react';
import { Badge } from '../shared/Badge';
import { AlertCircle, CheckCircle2, ChevronRight, Building2, Clock } from 'lucide-react';

export const ApplicationList = ({
  applications = [],
  selectedAppId,
  onSelectApplication,
  filter = 'all'
}) => {
  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return app.stage === 'document_audit';
    if (filter === 'cleared') return app.stage === 'ready_for_submission';
    if (filter === 'submitted') return app.stage === 'submitted';
    return true;
  });

  return (
    <div className="space-y-2">
      {filteredApps.map((app) => {
        const isSelected = selectedAppId === app.id;
        const isFlagged = app.stage === 'document_audit';
        const isSubmitted = app.stage === 'submitted';

        return (
          <div
            key={app.id}
            onClick={() => onSelectApplication(app.id)}
            className={
              'p-3.5 rounded-xl border transition-all cursor-pointer ' +
              (isSelected
                ? 'border-brand-500 bg-brand-50/50 shadow-subtle ring-1 ring-brand-400/30'
                : 'border-slate-200 hover:border-slate-300 bg-white shadow-subtle')
            }
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {isFlagged ? (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                ) : isSubmitted ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
                <span className="text-xs font-bold text-slate-900 truncate">
                  {app.client_name}
                </span>
              </div>
              <Badge status={app.stage} />
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{app.employer}</span>
            </div>

            {app.flagReason && (
              <div className="text-[10px] text-slate-500 mt-1.5 bg-slate-50 p-1.5 rounded border border-slate-100 truncate">
                {app.flagReason}
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>{app.id}</span>
              <span className="text-brand-600 font-semibold flex items-center gap-0.5">
                Review <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        );
      })}

      {filteredApps.length === 0 && (
        <div className="text-center py-8 text-xs text-slate-400">
          No applications in this category.
        </div>
      )}
    </div>
  );
};
