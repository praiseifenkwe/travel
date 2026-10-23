import React from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Building2, Plane, Sparkles } from 'lucide-react';

export const RelocationTimeline = () => {
  const steps = [
    {
      title: 'Document OCR & Rules Engine Check',
      desc: 'Verify Passport, CoS, Bank Statement & TB Certificate',
      date: 'Oct 23, 2026',
      status: 'completed'
    },
    {
      title: 'Agency Staff Consular Sign-Off',
      desc: 'Legal caseworker approval & Section 320 discrepancy clearance',
      date: 'Oct 24, 2026',
      status: 'current'
    },
    {
      title: 'TLScontact Biometrics Appointment',
      desc: 'Enrol fingerprints & facial bio at Victoria Island, Lagos',
      date: 'Nov 02, 2026',
      status: 'upcoming'
    },
    {
      title: 'UKVI Electronic Decision Issued',
      desc: '3-5 business days expedited priority visa issuance',
      date: 'Nov 07, 2026',
      status: 'upcoming'
    },
    {
      title: 'Corporate Flight Departure',
      desc: 'LOS -> LHR British Airways BA074 (Corporate Relocation Tier)',
      date: 'Nov 14, 2026',
      status: 'upcoming'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">30-Day Relocation Roadmap</h3>
          <p className="text-xs text-slate-500">Synchronized across UKVI consular dates and flight holds</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          Schedule On Track
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={idx} className="relative flex items-start gap-3.5">
              <div className={
                'absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ' +
                (isDone
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-brand-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-500')
              }>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={
                    'text-xs font-bold ' +
                    (isCurrent ? 'text-brand-700' : 'text-slate-900')
                  }>
                    {step.title}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0 font-mono">
                    {step.date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
