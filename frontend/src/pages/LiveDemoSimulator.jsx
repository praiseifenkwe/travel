import React, { useState } from 'react';
import { ClientPortal } from './ClientPortal';
import { StaffDashboard } from './StaffDashboard';
import { JudgeScenarioBar } from '../components/shared/JudgeScenarioBar';
import { SplitSquareVertical, Sparkles } from 'lucide-react';

export const LiveDemoSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState('bloomberg');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100/60">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-2.5 text-xs">
          <SplitSquareVertical className="w-4 h-4 text-brand-600" />
          <span className="font-bold text-slate-900">Synchronized Dual-Screen View:</span>
          <span className="text-slate-500 hidden sm:inline">Client Portal (Left) ⇄ Agency Caseworker Console (Right)</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Bidirectional WebSocket Synced
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-200">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="mb-3 flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Screen 1 • Client Relocation Experience
            </span>
            <span className="text-[11px] font-mono text-slate-400">/client</span>
          </div>
          <ClientPortal />
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] bg-slate-50/50">
          <div className="mb-3 flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-subtle">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Screen 2 • Licensed Caseworker Console
            </span>
            <span className="text-[11px] font-mono text-slate-400">/dashboard</span>
          </div>
          <StaffDashboard />
        </div>
      </div>

      <JudgeScenarioBar
        currentScenario={currentScenario}
        onSelectScenario={setCurrentScenario}
      />
    </div>
  );
};
