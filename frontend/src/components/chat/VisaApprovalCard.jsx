import React from 'react';
import { Award, CheckCircle2, ArrowRight, Plane, Sparkles } from 'lucide-react';

export const VisaApprovalCard = ({
  countryCode = "GB",
  destination = "London, United Kingdom",
  onProceedToFlights,
  onProceedToTravel
}) => {
  const isUs = countryCode === "US" || (destination && destination.toLowerCase().includes("united states"));

  const handleProceed = () => {
    if (onProceedToTravel) onProceedToTravel();
    if (onProceedToFlights) onProceedToFlights();
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-float space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-emerald-500/20 to-transparent blur-2xl pointer-events-none"></div>
      <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/10">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Visa Adjudication Granted</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-[11px] text-slate-300">
              {isUs ? "U.S. Department of State • Machine Readable Visa (MRV)" : "UKVI Official Clearance • Vignette Stamped in Passport"}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
          STATUS: ISSUED ✓
        </span>
      </div>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">VISA VIGNETTE NO.</span>
            <span className="font-mono font-bold text-white text-xs">{isUs ? "US-MRV-948201-N" : "UKVI-948201-B"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">CATEGORY</span>
            <span className="font-bold text-emerald-300 text-xs">{isUs ? "B1/B2 Visitor / H-1B" : "Standard Visitor (C)"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">VALID FROM</span>
            <span className="font-mono text-slate-200 text-xs">14 Nov 2026</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">VALID UNTIL</span>
            <span className="font-mono text-slate-200 text-xs">14 May 2027</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isUs
              ? "Biometric identity verification certified. Primary entry point: New York (JFK / EWR). "
              : "Biometric identity verification certified. Primary entry point: London Heathrow (LHR)."}
          </span>
        </div>
      </div>
      <div className="relative z-10 pt-1">
        <button
          onClick={handleProceed}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plane className="w-4 h-4" />
          <span>Unlock Direct Flights & Consular Hotel Vouchers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
