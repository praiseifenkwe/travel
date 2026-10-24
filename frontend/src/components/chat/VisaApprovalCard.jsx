import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Ticket
} from 'lucide-react';

export const VisaApprovalCard = ({ onProceedToFlights }) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-float space-y-5 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              OFFICIAL ENTRY CLEARANCE VIGNETTE
            </span>
            <span className="font-extrabold text-sm text-white">
              UK Standard Visitor Visa Approved
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          VISA GRANTED
        </span>
      </div>

      {/* Foil Vignette Representation */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs space-y-2">
        <div className="flex justify-between text-slate-300 text-[11px]">
          <span>PASSPORT: <strong>A12345678 (TUNDE ADEBAYO)</strong></span>
          <span>CATEGORY: <strong>C - VISIT</strong></span>
        </div>
        <div className="flex justify-between text-slate-300 text-[11px]">
          <span>VALID FROM: <strong>14 NOV 2026</strong></span>
          <span>EXPIRES: <strong>14 MAY 2027</strong></span>
        </div>
        <div className="flex justify-between text-slate-300 text-[11px]">
          <span>ENTRIES: <strong>MULTIPLE</strong></span>
          <span>ISSUED AT: <strong>UKVI SHEFFIELD / LAGOS</strong></span>
        </div>
      </div>

      {/* Next Step Transition */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          Congratulations! Your visa is officially stamped. You are cleared to proceed with your flight booking and hotel arrangements.
        </span>
      </div>

      <button
        onClick={onProceedToFlights}
        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Plane className="w-4 h-4" />
        <span>Proceed to Step 7: Flight Preferences & Booking</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
