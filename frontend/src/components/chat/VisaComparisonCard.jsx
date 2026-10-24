import React, { useState } from 'react';
import { 
  Compass, 
  Briefcase, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  Sparkles,
  Banknote
} from 'lucide-react';

export const VisaComparisonCard = ({ onSelectRoute, onSelectVisa }) => {
  const [selectedRoute, setSelectedRoute] = useState("visitor");

  const handleSelect = (route) => {
    setSelectedRoute(route.id);
    if (onSelectVisa) onSelectVisa(route);
    if (onSelectRoute) onSelectRoute(route);
  };

  const routes = [
    {
      id: "visitor",
      name: "UK Standard Visitor Visa",
      title: "UK Standard Visitor Visa",
      fee_gbp: 115,
      feeGbp: 115,
      feeNgn: 241500,
      purpose: "Tourism, Vacation, Family Visits & Business",
      duration: "6 Months (Multi-Entry)",
      processing: "3–4 Weeks",
      workPermitted: "No employment permitted in the UK",
      fundsReq: "£1,270 (~₦2.66M) average balance",
      icon: Compass,
      tag: "Most Popular",
      recommendedFor: "Holidays, tourism, visiting relatives, conferences"
    },
    {
      id: "skilled_worker",
      name: "UK Skilled Worker Visa",
      title: "UK Skilled Worker Visa",
      fee_gbp: 719,
      feeGbp: 719,
      feeNgn: 1509900,
      purpose: "Full-Time Skilled Employment & Permanent Relocation ('Japa')",
      duration: "Up to 5 Years (Route to Indefinite Leave)",
      processing: "3–8 Weeks",
      workPermitted: "Full legal employment with licensed sponsor",
      fundsReq: "£1,270 maintenance + Certificate of Sponsorship (CoS)",
      icon: Briefcase,
      tag: "Relocation Pathway",
      recommendedFor: "Tech specialists, healthcare, engineering, relocation"
    },
    {
      id: "student",
      name: "UK Student Visa",
      title: "UK Student Visa",
      fee_gbp: 516,
      feeGbp: 516,
      feeNgn: 1083600,
      purpose: "Undergraduate / Postgraduate Degree Studies",
      duration: "Course Duration + 2 Years Post-Study Work",
      processing: "3–4 Weeks",
      workPermitted: "20 hours/week during term time",
      fundsReq: "Tuition + £1,023/month (£1,334 in London) living costs",
      icon: GraduationCap,
      tag: "Academic Pathway",
      recommendedFor: "University admission with CAS"
    }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sleek text-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>FX Benchmark: £1.00 = ₦2,100.00 (Statutory Central Bank Rate)</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            Compare UK Visa Pathways Matching Your Intent
          </div>
        </div>

        <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Official UKVI Rates</span>
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
              onClick={() => handleSelect(r)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-brand-50/60 border-brand-500 shadow-sm ring-2 ring-brand-500/20"
                  : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 shadow-subtle">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {r.tag}
                  </span>
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 text-xs">
                    {r.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {r.duration} • {r.processing}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {r.purpose}
                </p>

                {/* Fees in GBP and NGN */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-subtle space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Statutory Visa Fee</div>
                  <div className="text-sm font-black text-slate-900">
                    £{r.feeGbp.toLocaleString()}{" "}
                    <span className="text-xs font-bold text-emerald-600">(₦{r.feeNgn.toLocaleString('en-NG')})</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/50">
                  <div>• <strong>Work Rights:</strong> {r.workPermitted}</div>
                  <div>• <strong>Maintenance:</strong> {r.fundsReq}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(r);
                }}
                className={`mt-3.5 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSelected ? "Selected Pathway ✓" : "Select Route"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
