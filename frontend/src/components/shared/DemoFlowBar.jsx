import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  Hotel, 
  CreditCard, 
  FileCheck, 
  Calendar, 
  Building2, 
  Award,
  Sparkles
} from 'lucide-react';

export const DemoFlowBar = ({ activeStep = 1, onSelectStep }) => {
  const steps = [
    { num: 1, label: "Passport", desc: ">=6m validity" },
    { num: 2, label: "Travel Reason", desc: "Vacation/work" },
    { num: 3, label: "Visa Options", desc: "£ vs ₦ rate" },
    { num: 4, label: "Bank Statement", desc: "6-mo average" },
    { num: 5, label: "Paystack Visa", desc: "₦380,000 fee" },
    { num: 6, label: "VFS Interview", desc: "Book & email" },
    { num: 7, label: "Visa Approved", desc: "Foil stamped" },
    { num: 8, label: "Flight Pref", desc: "Direct route" },
    { num: 9, label: "Paystack Flight", desc: "Ticket PNR" },
    { num: 10, label: "Hotel & Paystack", desc: "Proof of stay" },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 overflow-x-auto shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-[850px]">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 pr-2 border-r border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Demo Flow:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-between">
          {steps.map((s) => {
            const isCurrent = activeStep === s.num;
            const isCompleted = activeStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => onSelectStep && onSelectStep(s.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  isCurrent
                    ? "bg-brand-400 text-slate-900"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {isCompleted ? "✓" : s.num}
                </span>

                <div className="leading-tight">
                  <div className="text-[11px] font-bold truncate max-w-[85px]">{s.label}</div>
                  <div className={`text-[9px] truncate max-w-[85px] ${isCurrent ? "text-slate-300" : "text-slate-400"}`}>
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
