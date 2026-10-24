import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck, Compass, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { user, openAuthModal, logout, loading } = useAuth();

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto h-14 sm:h-16 rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-sleek px-3 sm:px-6 flex items-center justify-between transition-all">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
            Travel<span className="text-brand-600 font-black">Forge</span>
          </span>
        </Link>

        {/* Responsive Segmented Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/60 overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className={
              "px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 " +
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
              "px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 " +
              (location.pathname === "/client"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">Trip Assistant</span>
            <span className="sm:hidden">Assistant</span>
          </Link>

          <Link
            to="/dashboard"
            className={
              "px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 " +
              (location.pathname === "/dashboard"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Agency Review</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
              Staff
            </span>
          </Link>
        </nav>

        {/* Right Auth / Account Area */}
        <div className="flex items-center gap-2 shrink-0">
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-medium">
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[100px] truncate font-semibold text-slate-900">
                  {user.name || user.email}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 uppercase">
                  {user.user_type || "Client"}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all hover:scale-105 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-600" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
