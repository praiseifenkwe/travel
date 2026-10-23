import React from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Plane, Sparkles, Luggage, Hotel, ShieldCheck } from 'lucide-react';

export const RelocationTimeline = () => {
  const steps = [
    {
      title: 'Trip Planning & Entry Rules',
      desc: 'Check UK standard visitor entry guidelines & return flight options',
      date: 'Oct 23, 2026',
      status: 'completed'
    },
    {
      title: 'Travel Documents Vault Verification',
      desc: 'Validate passport validity (>6 mos), hotel booking & proof of funds',
      date: 'Oct 24, 2026',
      status: 'current'
    },
    {
      title: 'Visa Biometrics & Document Drop-off',
      desc: 'Attend appointment at TLScontact Victoria Island, Lagos',
      date: 'Nov 02, 2026',
      status: 'upcoming'
    },
    {
      title: 'Visa Decision & Passport Collection',
      desc: 'Collect passport with approved visitor vignette sticker',
      date: 'Nov 08, 2026',
      status: 'upcoming'
    },
    {
      title: 'Flight Departure & Vacation Starts',
      desc: 'LOS -> LHR British Airways BA074 (2 x 23kg baggage included)',
      date: 'Nov 14, 2026',
      status: 'upcoming'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Trip Preparation Roadmap</h3>
          <p className="text-xs text-slate-500">Key dates from document preparation to departure</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          Trip On Schedule
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
