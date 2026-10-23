import React from 'react';
import { Badge } from '../shared/Badge';
import { ChevronRight, MapPin, Calendar, Luggage } from 'lucide-react';

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

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'document_audit':
        return 'Reviewing';
      case 'ready_for_submission':
        return 'Approved';
      case 'submitted':
        return 'Completed';
      default:
        return 'Active';
    }
  };

  return (
    <div className="space-y-2">
      {filteredApps.map((app) => {
        const isSelected = selectedAppId === app.id;
        const isReview = app.stage === 'document_audit';

        return (
          <div
            key={app.id}
            onClick={() => onSelectApplication(app.id)}
            className={
              "p-3.5 rounded-2xl border transition-all cursor-pointer " +
              (isSelected
                ? "border-brand-500 bg-brand-50/50 shadow-subtle ring-1 ring-brand-400/30"
                : "border-slate-200 hover:border-slate-300 bg-white shadow-subtle")
            }
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={"w-2 h-2 rounded-full shrink-0 " + (isReview ? "bg-amber-500" : "bg-emerald-500")} />
                <span className="text-xs font-bold text-slate-900 truncate">
                  {app.client_name}
                </span>
              </div>
              <Badge status={app.stage} label={app.stageLabel || getStageLabel(app.stage)} />
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{app.destination} • {app.trip_type}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>{app.travel_dates || app.id}</span>
              <span className="text-brand-600 font-semibold flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        );
      })}

      {filteredApps.length === 0 && (
        <div className="text-center py-6 text-xs text-slate-400">
          No bookings in this category.
        </div>
      )}
    </div>
  );
};
