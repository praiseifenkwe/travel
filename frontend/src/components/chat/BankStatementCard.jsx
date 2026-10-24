import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  QrCode,
  Sparkles,
  Download
} from 'lucide-react';

export const BankStatementCard = ({ 
  onVerified, 
  requiredGbp = 1270, 
  exchangeRate = 2100.0,
  initialAverage = 8450000 
}) => {
  const [statementData, setStatementData] = useState({
    bankName: "Guaranty Trust Bank (GTBank)",
    accountName: "Tunde Babatunde Adeyemi",
    accountNumber: "0248910284",
    period: "May 2026 – Oct 2026 (6 Months)",
    monthlyBalances: [
      { month: "May 2026", balance: 7800000 },
      { month: "Jun 2026", balance: 8150000 },
      { month: "Jul 2026", balance: 8900000 },
      { month: "Aug 2026", balance: 8400000 },
      { month: "Sep 2026", balance: 9200000 },
      { month: "Oct 2026", balance: 8850000 }
    ],
    averageBalance: 8550000,
    requiredThresholdNgn: Math.round(requiredGbp * exchangeRate),
    isApproved: true
  });

  const [hasApproved, setHasApproved] = useState(false);

  const handleConfirm = () => {
    setHasApproved(true);
    if (onVerified) {
      onVerified(statementData);
    }
  };

  const reqFormatted = `£${requiredGbp.toLocaleString()} (₦${statementData.requiredThresholdNgn.toLocaleString('en-NG', { minimumFractionDigits: 2 })})`;
  const avgFormatted = `₦${statementData.averageBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  const marginFormatted = `₦${(statementData.averageBalance - statementData.requiredThresholdNgn).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sleek text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900">
              6-Month Bank Statement Audit
            </div>
            <div className="text-[11px] text-slate-400">
              GTBank • {statementData.period} • 28-Day Threshold Check
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Statutory Pass</span>
        </span>
      </div>

      {/* 6-Month Monthly Inflow / Balance Table */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {statementData.monthlyBalances.map((m, idx) => (
          <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
            <span className="text-[10px] text-slate-400 block font-medium">{m.month}</span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              ₦{(m.balance / 1000000).toFixed(2)}M
            </span>
          </div>
        ))}
      </div>

      {/* Calculated Analysis Box */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5 text-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium text-[11px]">Calculated 6-Month Average:</span>
          <span className="font-mono font-black text-slate-900 text-sm">{avgFormatted}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium text-[11px]">UKVI Statutory Maintenance Threshold:</span>
          <span className="font-mono font-bold text-slate-700 text-xs">{reqFormatted}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
          <span className="text-emerald-800 font-bold text-[11px]">Financial Safety Surplus Margin:</span>
          <span className="font-mono font-black text-emerald-700 text-xs">+{marginFormatted}</span>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span>Official digital stamp, QR checksum, and no unexplained lump-sum deposits detected.</span>
      </div>

      {!hasApproved ? (
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sleek transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Confirm Statement & Proceed to Visa Fee Payment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="p-3 rounded-2xl bg-slate-100 text-slate-600 text-center font-bold text-xs">
          ✓ Bank Statement Certified and Attached to Consular Dossier
        </div>
      )}
    </div>
  );
};
