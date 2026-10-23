import React from 'react';
import { Briefcase, Plane, Globe, Luggage } from 'lucide-react';

export const JudgeScenarioBar = ({ onSelectScenario, currentScenario }) => {
  const scenarios = [
    { id: 'london_tourist', label: 'Tunde (London Holiday)', sub: '6-Mo Tourist Visa', icon: <Luggage className="w-3.5 h-3.5 text-brand-600" /> },
    { id: 'dubai_vacation', label: 'Amaka (Dubai Vacation)', sub: '30-Day e-Visa', icon: <Plane className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'paris_business', label: 'Chidi (Paris Conference)', sub: 'Schengen Business', icon: <Globe className="w-3.5 h-3.5 text-amber-600" /> }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200 shadow-dropdown rounded-full px-4 py-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-3 border-r border-slate-200 hidden sm:block">
        Trip Scenarios:
      </div>

      <div className="flex items-center gap-1.5">
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ' +
                (isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
              }
            >
              {sc.icon}
              <span>{sc.label}</span>
              <span className={
                'text-[10px] hidden md:inline px-1.5 py-0.5 rounded font-medium ' +
                (isActive ? 'bg-slate-800 text-slate-300' : 'text-slate-400')
              }>
                {sc.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
