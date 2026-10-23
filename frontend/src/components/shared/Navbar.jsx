import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, User, SplitSquareVertical, FileText, Plane, Luggage } from 'lucide-react';
import { DossierModal } from './DossierModal';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const [itineraryOpen, setItineraryOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Plane className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    TravelForge
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Smart Travel OS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Visas, Flights & Trips Made Simple
                </span>
              </div>
            </Link>

            {/* Navigation Switcher */}
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
                <Luggage className="w-3.5 h-3.5" />
                <span>My Trips & Visas</span>
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
                <Compass className="w-3.5 h-3.5" />
                <span>Travel Agency Desk</span>
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
                <span>Interactive Demo</span>
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setItineraryOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-subtle transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">View</span> Travel Itinerary
            </button>

            {/* Realtime Status */}
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
              <span className="font-semibold text-[11px] hidden sm:inline">
                {isConnected ? 'Flight & Visa Sync Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <DossierModal
        isOpen={itineraryOpen}
        onClose={() => setItineraryOpen(false)}
        appData={{
          client_name: 'Tunde Adeyemi',
          destination: 'London, United Kingdom',
          trip_type: 'Holiday & Tourism'
        }}
      />
    </>
  );
};
