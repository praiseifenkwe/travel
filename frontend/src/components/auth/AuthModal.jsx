import React, { useState, useEffect } from "react";
import { Compass, X, Lock, Mail, User, AlertCircle, Check, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AuthModal = () => {
  const {
    authModalOpen,
    authMode,
    authError,
    submitting,
    closeAuthModal,
    openAuthModal,
    login,
    signup,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (authModalOpen) {
      setEmail("");
      setName("");
      setPassword("");
      setLocalError(null);
    }
  }, [authModalOpen, authMode]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const isSignup = authMode === "signup";
  const isPasswordValid = password.length >= 12 && password.length <= 128;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError("Please enter your email address.");
      return;
    }

    if (isSignup && !name.trim()) {
      setLocalError("Please enter your full legal name.");
      return;
    }

    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    if (password.length < 12) {
      setLocalError("Password must be at least 12 characters as required by consular security.");
      return;
    }

    try {
      if (isSignup) {
        await signup(trimmedEmail, name.trim(), password);
      } else {
        await login(trimmedEmail, password);
      }
    } catch (err) {
      // Handled by AuthContext state
    }
  };

  const activeError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-float border border-slate-200/80 transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md mb-3">
            <Compass className="w-6 h-6 text-brand-400" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isSignup ? "Create Your Travel Account" : "Sign In to TravelForge"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {isSignup
              ? "Access AI-verified visa intelligence, live flight reservations, and certified dossiers."
              : "Continue your verified consular consultation and manage active trip clearances."}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex p-1 bg-slate-100/90 rounded-full border border-slate-200/60 mb-6">
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className={
              "flex-1 py-1.5 text-xs font-bold rounded-full transition-all " +
              (!isSignup
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800")
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className={
              "flex-1 py-1.5 text-xs font-bold rounded-full transition-all " +
              (isSignup
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800")
            }
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {activeError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{activeError}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Adeyemi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <span className={
                "text-[10px] font-semibold flex items-center gap-1 transition-colors " +
                (isPasswordValid ? "text-emerald-600" : "text-slate-400")
              }>
                {isPasswordValid && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                Min. 12 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : isSignup ? (
              <>
                <span>Create Account & Start</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to TravelForge</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security / Cookie Notice */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Secured via HttpOnly credentials session (7-day validity)</span>
        </div>
      </div>
    </div>
  );
};
