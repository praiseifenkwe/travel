import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles,
  CreditCard
} from 'lucide-react';

export const BankStatementCard = ({ 
  onVerified, 
  onProceedToPayment,
  requiredGbp = 1270, 
  exchangeRate = 2100.0,
  initialAverage = 8850000 
}) => {
  const [statementData] = useState({
    bankName: "Guaranty Trust Bank (GTBank)",
    accountName: "Tunde Babatunde Adeyemi",
    accountNumber: "0248910284",
    period: "May 2026 – Oct 2026 (6 Months)",
    monthlyBalances: [
      { month: "May 2026", balance: 8200000 },
      { month: "Jun 2026", balance: 8650000 },
      { month: "Jul 2026", balance: 9100000 },
      { month: "Aug 2026", balance: 8750000 },
      { month: "Sep 2026", balance: 9450000 },
      { month: "Oct 2026", balance: 8950000 }
    ],
    averageBalance: 8850000,
    requiredThresholdNgn: Math.round(requiredGbp * exchangeRate),
    isApproved: true
  });

  const [hasApproved, setHasApproved] = useState(false);

  const handleConfirm = () => {
    setHasApproved(true);
    if (onProceedToPayment) onProceedToPayment(statementData);
    if (onVerified) onVerified(statementData);
  };

  const reqFormatted = `£${requiredGbp.toLocaleString()} (₦${statementData.requiredThresholdNgn.toLocaleString('en-NG')})`;
  const avgFormatted = `₦${statementData.averageBalance.toLocaleString('en-NG')}`;
  const marginFormatted = `₦${(statementData.averageBalance - statementData.requiredThresholdNgn).toLocaleString('en-NG')}`;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sleek text-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold shadow-subtle shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900">
              6-Month Bank Statement Audit
            </div>
            <div className="text-[11px] text-slate-500">
              {statementData.bankName} • {statementData.period} • 28-Day Statutory Rule
            </div>
          </div>
        </div>

        <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Statutory Sufficiency Pass ✓</span>
        </span>
      </div>

      {/* 6-Month Balances Table */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {statementData.monthlyBalances.map((m, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
            <span className="text-[10px] text-slate-400 block font-medium">{m.month}</span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              ₦{(m.balance / 1000000).toFixed(2)}M
            </span>
          </div>
        ))}
      </div>

      {/* Calculated Analysis Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 space-y-2 text-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium text-xs">Calculated 6-Month Average:</span>
          <span className="font-mono font-black text-slate-900 text-sm">{avgFormatted}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium text-xs">UKVI Statutory Maintenance Requirement:</span>
          <span className="font-mono font-bold text-slate-700 text-xs">{reqFormatted}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
          <span className="text-emerald-900 font-extrabold text-xs">Financial Safety Surplus Margin:</span>
          <span className="font-mono font-black text-emerald-700 text-sm">+{marginFormatted} (+232%)</span>
        </div>
      </div>

      {/* Integrity Badges */}
      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Official bank digital stamp, QR verification, and no irregular deposit spikes detected.</span>
      </div>

      {!hasApproved ? (
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirm Statement & Pay Visa Fee via Paystack (₦380,000)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bank Statement Verified & Attached to Consular Dossier</span>
        </div>
      )}
    </div>
  );
};
