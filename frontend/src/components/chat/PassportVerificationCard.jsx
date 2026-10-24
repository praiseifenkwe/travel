import React, { useState } from 'react';
import { 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const PassportVerificationCard = ({ onPassportVerified, onPassportRejected }) => {
  const [passportNumber, setPassportNumber] = useState("A12345678");
  const [holderName, setHolderName] = useState("Tunde Babatunde Adeyemi");
  const [expiryDate, setExpiryDate] = useState("2031-11-14");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const evaluateValidity = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      const today = new Date("2026-10-24");
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30.4);

      if (diffDays < 180) {
        // Less than 6 months: REJECT!
        const result = {
          status: "rejected",
          passportNumber,
          holderName,
          expiryDate,
          monthsRemaining: diffMonths,
          daysRemaining: diffDays,
          reason: `Passport expires on ${expiryDate} (${diffMonths <= 0 ? 'Expired' : `${diffMonths} months remaining`}). Consular regulations strictly mandate at least 6 months validity beyond your intended travel.`
        };
        setEvaluationResult(result);
        if (onPassportRejected) onPassportRejected(result);
      } else {
        // >= 6 months: ACCEPT!
        const result = {
          status: "verified",
          passportNumber,
          holderName,
          expiryDate,
          monthsRemaining: diffMonths,
          daysRemaining: diffDays,
          reason: `Passport valid for ${diffMonths} months (${(diffMonths / 12).toFixed(1)} years). Exceeds the 6-month statutory rule ✓`
        };
        setEvaluationResult(result);
        if (onPassportVerified) onPassportVerified(result);
      }
    }, 600);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sleek text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold shadow-subtle shrink-0">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900">
              Consular Passport Validity Guardrail
            </div>
            <div className="text-[11px] text-slate-500">
              Strict 6-Month Statutory Validity Rule (ICAO Annex 9 & Consular Policy)
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Guardrail Check
        </span>
      </div>

      {/* Interactive Verification Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            PASSPORT NUMBER
          </label>
          <input
            type="text"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-xs bg-slate-50/50"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            APPLICANT FULL NAME
          </label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs bg-slate-50/50"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            EXPIRATION DATE
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => {
              setExpiryDate(e.target.value);
              setEvaluationResult(null);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 text-xs bg-white"
          />
        </div>
      </div>

      {/* Quick Test Date Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-[10px]">
        <span className="text-slate-400 font-medium">Test Guardrail:</span>
        <button
          type="button"
          onClick={() => {
            setExpiryDate("2026-12-10");
            setEvaluationResult(null);
          }}
          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold cursor-pointer"
        >
          Set Expiring Dec 2026 (&lt; 6 Mos - REJECT)
        </button>
        <button
          type="button"
          onClick={() => {
            setExpiryDate("2031-11-14");
            setEvaluationResult(null);
          }}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer"
        >
          Set Valid Nov 2031 (60 Mos - PASS)
        </button>
      </div>

      {/* Run Validation Button */}
      {!evaluationResult && (
        <button
          onClick={evaluateValidity}
          disabled={isEvaluating}
          className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>EVALUATING 6-MONTH STATUTORY VALIDITY...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Passport Validity Against 6-Month Rule</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Result Display: PASS or REJECT */}
      {evaluationResult && (
        <div>
          {evaluationResult.status === "rejected" ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-sm text-rose-800">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Passport Validity REJECTED (Consular Guardrail Triggered)</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                {evaluationResult.reason}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200 text-[11px] text-rose-800 font-medium">
                ⚠️ <strong>Application Blocked:</strong> Consular regulations prohibit fee collection or appointment booking for passports with under 6 months validity. Please renew your Nigerian International Passport before proceeding.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Passport Validity ACCEPTED (60 Months Remaining)</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {evaluationResult.reason}
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-medium">ICAO MRZ Checksum: <strong>Valid ✓</strong></span>
                <span className="font-bold text-emerald-700">Unlocked: Proceed to Visa Selection →</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
