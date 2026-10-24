import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plane, Sparkles, ShieldCheck, Compass } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto h-14 rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/70 shadow-sleek px-4 sm:px-6 flex items-center justify-between transition-all">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Travel<span className="text-brand-600 font-black">Forge</span>
          </span>
        </Link>

        {/* Minimalist Segmented Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
          <Link
            to="/"
            className={
              "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 " +
              (location.pathname === "/"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            Explore
          </Link>

          <Link
            to="/client"
            className={
              "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 " +
              (location.pathname === "/client"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Trip Assistant</span>
          </Link>

          <Link
            to="/dashboard"
            className={
              "px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 " +
              (location.pathname === "/dashboard"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span>Agency Review</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-600">
              Staff
            </span>
          </Link>
        </nav>

        {/* Right Status Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Concierge</span>
          </span>
        </div>
      </div>
    </header>
  );
};
