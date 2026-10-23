import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, SplitSquareVertical, FileCheck2, Plane } from 'lucide-react';
import { DossierModal } from './DossierModal';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const [dossierOpen, setDossierOpen] = useState(false);

  const navLinks = [
    { path: '/client', label: 'Client Portal', icon: <User className="w-4 h-4" /> },
    { path: '/dashboard', label: 'Agency Console', icon: <Shield className="w-4 h-4" /> },
    { path: '/demo', label: 'Dual View', icon: <SplitSquareVertical className="w-4 h-4" /> }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Tabs */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  TravelForge
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Visa OS
                </span>
              </div>
            </Link>

            {/* Segmented Navigation Bar */}
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ' +
                      (isActive
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50')
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDossierOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-subtle transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Generate</span> UKVI Dossier
            </button>

            {/* WebSocket Connection Pill */}
            <div
              className={
                'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ' +
                (isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200')
              }
            >
              <span
                className={
                  'w-2 h-2 rounded-full ' +
                  (isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')
                }
              />
              <span className="font-medium">
                {isConnected ? 'Real-time Sync' : 'Reconnecting...'}
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
