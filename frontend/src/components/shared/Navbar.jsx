import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, SplitSquareVertical, FileCheck2, Plane, Sparkles, HelpCircle } from 'lucide-react';
import { DossierModal } from './DossierModal';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    TravelForge
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    Relocation OS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  AI-Native Global Mobility Platform
                </span>
              </div>
            </Link>

            {/* Role-Based Navigation Switcher */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <Link
                to="/client"
                className={
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ' +
                  (location.pathname === '/client'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900')
                }
              >
                <User className="w-3.5 h-3.5" />
                <span>Applicant Portal</span>
              </Link>

              <Link
                to="/dashboard"
                className={
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ' +
                  (location.pathname === '/dashboard'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900')
                }
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Caseworker Console</span>
              </Link>

              <Link
                to="/demo"
                className={
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ' +
                  (location.pathname === '/demo'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900')
                }
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Dual Live Simulator</span>
              </Link>
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDossierOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-subtle transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Official UKVI Dossier</span>
            </button>

            {/* Connection Indicator */}
            <div
              className={
                'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ' +
                (isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200')
              }
              title={isConnected ? 'Live real-time WebSocket connection active' : 'Connecting to real-time events...'}
            >
              <span
                className={
                  'w-2 h-2 rounded-full ' +
                  (isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')
                }
              />
              <span className="font-semibold text-[11px] hidden sm:inline">
                {isConnected ? 'Real-time Linked' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <DossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        appData={{
          client_name: 'Tunde Babatunde Adeyemi',
          employer: 'Bloomberg LP (London Office)',
          visa_type: 'UK Skilled Worker'
        }}
      />
    </>
  );
};
