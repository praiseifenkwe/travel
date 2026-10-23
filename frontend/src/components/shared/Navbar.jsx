import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Compass, User, FileText, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
            <Plane className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            Travel<span className="text-brand-600">Forge</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <Link
            to="/client"
            className={
              'px-4 py-1.5 rounded-lg text-xs font-bold transition-all ' +
              (location.pathname === '/client'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900')
            }
          >
            Traveler Portal
          </Link>

          <Link
            to="/dashboard"
            className={
              'px-4 py-1.5 rounded-lg text-xs font-bold transition-all ' +
              (location.pathname === '/dashboard'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900')
            }
          >
            Agent Desk
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/client"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
          >
            <span>My Trip</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
