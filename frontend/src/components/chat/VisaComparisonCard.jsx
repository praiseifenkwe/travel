import React, { useState } from 'react';
import { 
  Compass, 
  Briefcase, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  HelpCircle,
  Currency
} from 'lucide-react';

export const VisaComparisonCard = ({ onSelectRoute }) => {
  const [selectedRoute, setSelectedRoute] = useState("visitor");

  const routes = [
    {
      id: "visitor",
      title: "UK Standard Visitor Visa",
      purpose: "Tourism, Vacation, Family Visits & Short Business",
      duration: "6 Months (Multi-Entry)",
      feeGbp: 115,
      feeNgn: 241500,
      processing: "3–4 Weeks",
      workPermitted: "No employment allowed in the UK",
      fundsReq: "£1,270 (~₦2.66M) average balance",
      icon: Compass,
      recommendedFor: "Holidays, tourism, visiting relatives, conferences"
    },
    {
      id: "skilled_worker",
      title: "UK Skilled Worker Visa",
      purpose: "Full-Time Long-Term Employment & Relocation (Japa)",
      duration: "Up to 5 Years (Route to Indefinite Leave / PR)",
      feeGbp: 719,
      feeNgn: 1509900,
      processing: "3–8 Weeks",
      workPermitted: "Full legal employment with licensed sponsor",
      fundsReq: "£1,270 maintenance + CoS (Certificate of Sponsorship)",
      icon: Briefcase,
      recommendedFor: "Tech specialists, healthcare, engineering, relocation"
    },
    {
      id: "student",
      title: "UK Student Visa",
      purpose: "Undergraduate / Postgraduate Degree Studies",
      duration: "Course Duration + 2 Years Graduate Work Visa",
      feeGbp: 516,
      feeNgn: 1083600,
      processing: "3–4 Weeks",
      workPermitted: "20 hours/week during term time",
      fundsReq: "Tuition + £1,023/month (£1,334 in London) living costs",
      icon: GraduationCap,
      recommendedFor: "University admission with CAS"
    }
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sleek text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
            CONVERSION BENCHMARK: £1.00 = ₦2,100.00
          </span>
          <div className="text-xs font-black text-slate-900">
            Compare UK Visa Pathways Matching Your Profile
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
          Official UKVI Rates
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRoute === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRoute(r.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-brand-50/50 border-brand-600 shadow-sm ring-2 ring-brand-500/20"
                  : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-700 shadow-sm">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    {r.duration}
                  </span>
                </div>

                <div className="font-extrabold text-slate-900 text-xs">
                  {r.title}
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {r.purpose}
                </p>

                {/* Fees in GBP and NGN */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Official Statutory Fee</div>
                  <div className="text-sm font-black text-slate-900">
                    £{r.feeGbp.toLocaleString()} <span className="text-xs font-bold text-emerald-600">(~₦{r.feeNgn.toLocaleString('en-NG')})</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 space-y-1 pt-1">
                  <div>• <strong>Work Rights:</strong> {r.workPermitted}</div>
                  <div>• <strong>Funds Check:</strong> {r.fundsReq}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRoute(r.id);
                  if (onSelectRoute) onSelectRoute(r);
                }}
                className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSelected ? "Selected Pathway" : "Select Route"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
