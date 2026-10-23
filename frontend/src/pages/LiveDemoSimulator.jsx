import React, { useState } from 'react';
import { ClientPortal } from './ClientPortal';
import { StaffDashboard } from './StaffDashboard';
import { JudgeScenarioBar } from '../components/shared/JudgeScenarioBar';
import { SplitSquareVertical, Sparkles, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const LiveDemoSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState('bloomberg');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100/60 pb-16">
      {/* Top Banner Guide for Judges & Reviewers */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 shadow-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <SplitSquareVertical className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">
                Real-Time Dual View Simulator
              </div>
              <div className="text-slate-500">
                Experience how applicant actions in Lagos synchronize with agency caseworkers in real time
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live WebSocket Room: #app_tunde_123</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-slate-200">
        {/* Left Screen: Client Portal */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="mb-4 flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-subtle">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-600" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                  Screen 1: Relocating Applicant
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  What Tunde sees on mobile/desktop during intake
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              /client
            </span>
          </div>
          <ClientPortal />
        </div>

        {/* Right Screen: Staff Dashboard */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-140px)] bg-slate-50/50">
          <div className="mb-4 flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-subtle">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  Screen 2: Licensed Caseworker
                </span>
                <span className="text-[11px] text-slate-400 block font-normal">
                  Agency audit & legal determinations console
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              /dashboard
            </span>
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
