import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck, Compass, LogIn, LogOut, User, Globe2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, openAuthModal, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              Travel<span className="text-indigo-600 font-black">Forge</span>
            </span>

          </div>
        </Link>

        {/* Minimalist Segmented Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shrink-0">
          <Link
            to="/"
            className={
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
              (location.pathname === "/"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            Explore
          </Link>

          <Link
            to="/client"
            className={
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 " +
              (location.pathname === "/client"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Trip Assistant</span>
            <span className="sm:hidden">Assistant</span>
          </Link>

          <Link
            to="/dashboard"
            className={
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 " +
              (location.pathname === "/dashboard"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Agency Review</span>

          </Link>
        </nav>

        {/* Right Auth / Account Area */}
        <div className="flex items-center gap-2 shrink-0">
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-800 text-xs font-medium">
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-extrabold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[140px] truncate font-bold text-slate-900">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
