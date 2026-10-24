import React, { useState } from 'react';
import { 
  Compass, 
  Briefcase, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  Banknote,
  Globe2
} from 'lucide-react';

export const VisaComparisonCard = ({ onSelectRoute, onSelectVisa, initialCountry = "GB" }) => {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry); // "GB" or "US"
  const [selectedRouteId, setSelectedRouteId] = useState("visitor");

  const ukRoutes = [
    {
      id: "uk_visitor",
      country: "United Kingdom",
      country_code: "GB",
      flag: "🇬🇧",
      name: "UK Standard Visitor Visa",
      title: "UK Standard Visitor Visa",
      currency_symbol: "£",
      currency_code: "GBP",
      fee_foreign: 115,
      fee_gbp: 115,
      fee_ngn: 241500,
      feeNgn: 241500,
      purpose: "Tourism, Vacation, Family Visits, Medical & Short Business",
      duration: "6 Months (Multiple Entry)",
      processing: "3–4 Weeks",
      workPermitted: "No employment permitted in the UK",
      fundsReq: "£1,270 (~₦2.66M) average balance",
      icon: Compass,
      tag: "Most Popular",
      recommendedFor: "Holidays, tourism, conferences, family visit"
    },
    {
      id: "uk_skilled_worker",
      country: "United Kingdom",
      country_code: "GB",
      flag: "🇬🇧",
      name: "UK Skilled Worker Visa",
      title: "UK Skilled Worker Visa",
      currency_symbol: "£",
      currency_code: "GBP",
      fee_foreign: 719,
      fee_gbp: 719,
      fee_ngn: 1509900,
      feeNgn: 1509900,
      purpose: "Full-Time Long-Term Employment & Permanent Relocation ('Japa')",
      duration: "Up to 5 Years (Route to Indefinite Leave / PR)",
      processing: "3–8 Weeks",
      workPermitted: "Full legal employment with licensed UK sponsor",
      fundsReq: "£1,270 maintenance + Certificate of Sponsorship (CoS)",
      icon: Briefcase,
      tag: "Relocation Pathway",
      recommendedFor: "Software engineers, healthcare, finance, relocation"
    },
    {
      id: "uk_student",
      country: "United Kingdom",
      country_code: "GB",
      flag: "🇬🇧",
      name: "UK Student Visa",
      title: "UK Student Visa",
      currency_symbol: "£",
      currency_code: "GBP",
      fee_foreign: 490,
      fee_gbp: 490,
      fee_ngn: 1029000,
      feeNgn: 1029000,
      purpose: "Undergraduate / Postgraduate University Studies",
      duration: "Course Duration + 2 Years Post-Study Graduate Work",
      processing: "3–4 Weeks",
      workPermitted: "20 hours/week during term time",
      fundsReq: "Tuition + £1,023/month (£1,334 in London) living costs",
      icon: GraduationCap,
      tag: "Academic Route",
      recommendedFor: "Degree programs with confirmed CAS"
    }
  ];

  const usRoutes = [
    {
      id: "us_b1_b2",
      country: "United States",
      country_code: "US",
      flag: "🇺🇸",
      name: "US B1/B2 Visitor Visa",
      title: "US B1/B2 Visitor Visa",
      currency_symbol: "$",
      currency_code: "USD",
      fee_foreign: 185,
      fee_gbp: 145,
      fee_ngn: 285000,
      feeNgn: 285000,
      purpose: "Tourism, Vacation, Family Visits, Conferences & Business",
      duration: "Up to 2–5 Years Multiple Entry (180 Days per Stay)",
      processing: "Interview Appointment Wait Time",
      workPermitted: "Strictly no employment allowed in the US",
      fundsReq: "Sufficient liquid balance covering US stay expenses",
      icon: Compass,
      tag: "Most Popular",
      recommendedFor: "Tourism, holidays, family visits, business meetings"
    },
    {
      id: "us_f1_student",
      country: "United States",
      country_code: "US",
      flag: "🇺🇸",
      name: "US F-1 Academic Student Visa",
      title: "US F-1 Academic Student Visa",
      currency_symbol: "$",
      currency_code: "USD",
      fee_foreign: 185,
      fee_gbp: 145,
      fee_ngn: 285000,
      feeNgn: 285000,
      purpose: "Full-Time Accredited University / College Degree Studies",
      duration: "Duration of Status (D/S) + 1–3 Years OPT Work",
      processing: "2–4 Weeks (Priority scheduling)",
      workPermitted: "On-campus 20 hrs/week; Curricular/OPT practical training",
      fundsReq: "Full 1st year tuition + living costs on Form I-20",
      icon: GraduationCap,
      tag: "Degree Studies",
      recommendedFor: "College admission with issued Form I-20"
    },
    {
      id: "us_h1b_worker",
      country: "United States",
      country_code: "US",
      flag: "🇺🇸",
      name: "US H-1B Specialty Occupation Visa",
      title: "US H-1B Specialty Occupation Visa",
      currency_symbol: "$",
      currency_code: "USD",
      fee_foreign: 205,
      fee_gbp: 160,
      fee_ngn: 315000,
      feeNgn: 315000,
      purpose: "Specialty Skilled Employment & Dual Intent Relocation",
      duration: "3 Years Initial (Extendable up to 6 Years; Green Card Path)",
      processing: "USCIS Petition Approval Required",
      workPermitted: "Full-time employment with sponsoring US employer",
      fundsReq: "Certified LCA (Labor Condition Application) + Form I-797",
      icon: Briefcase,
      tag: "Dual Intent Relocation",
      recommendedFor: "Tech, healthcare, research specialists with approved petition"
    }
  ];

  const currentRoutes = selectedCountry === "US" ? usRoutes : ukRoutes;

  const handleSelect = (route) => {
    setSelectedRouteId(route.id);
    if (onSelectVisa) onSelectVisa(route);
    if (onSelectRoute) onSelectRoute(route);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sleek text-xs space-y-4">
      {/* Top Bar with Destination Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {selectedCountry === "US" 
                ? "FX Benchmark: $1.00 = ₦1,540.00 (Official Consular MRV Rate)" 
                : "FX Benchmark: £1.00 = ₦2,100.00 (Statutory Central Bank Rate)"}
            </span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            Select Visa Category for {selectedCountry === "US" ? "United States 🇺🇸" : "United Kingdom 🇬🇧"}
          </div>
        </div>

        {/* Destination Country Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedCountry("GB")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCountry === "GB"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🇬🇧</span>
            <span>United Kingdom</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCountry("US")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCountry === "US"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🇺🇸</span>
            <span>United States</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {currentRoutes.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRouteId === r.id;
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
                    {r.duration}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {r.purpose}
                </p>

                {/* Fees in Foreign Currency and NGN */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-subtle space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Statutory Consular Fee</div>
                  <div className="text-sm font-black text-slate-900">
                    {r.currency_symbol}{r.fee_foreign.toLocaleString()}{" "}
                    <span className="text-xs font-bold text-emerald-600">(₦{r.fee_ngn.toLocaleString('en-NG')})</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/50">
                  <div>• <strong>Work Rights:</strong> {r.workPermitted}</div>
                  <div>• <strong>Prerequisite:</strong> {r.fundsReq}</div>
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
                <span>{isSelected ? `Selected (₦${r.fee_ngn.toLocaleString()}) ✓` : `Select Route`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
