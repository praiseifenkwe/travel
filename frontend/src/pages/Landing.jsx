import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  FileText, 
  Sparkles,
  Luggage,
  Globe2,
  Fingerprint,
  Ticket,
  ChevronRight,
  Compass,
  Building2,
  Lock,
  Award,
  Zap,
  Check
} from "lucide-react";

export const Landing = () => {
  const [selectedDestination, setSelectedDestination] = useState("gb");

  const destinationDetails = {
    gb: {
      country: "United Kingdom",
      city: "London",
      flag: "🇬🇧",
      code: "LHR",
      primaryVisa: "UK Standard Visitor & Skilled Worker",
      feeDisplay: "£115 – £719 (~₦241,500 – ₦1,509,900)",
      threshold: "£1,270 (~₦2.66M Maintenance)",
      processing: "10 – 15 Working Days",
      flights: "British Airways (BA 76) & Virgin Atlantic (VS 412)",
      flightRoute: "Lagos (LOS) → London Heathrow (LHR) • Direct 6h 30m",
      luggage: "2 × 23kg Checked Bags Included",
      embassyCenters: "TLScontact Victoria Island, Lagos & Central Abuja",
      hotels: "Park Plaza Westminster Bridge & The Tower Hotel London",
      tagline: "Direct statutory route for London tourism, professional relocation, and Tier-4 studies."
    },
    us: {
      country: "United States",
      city: "New York",
      flag: "🇺🇸",
      code: "JFK",
      primaryVisa: "US B1/B2 Visitor & H-1B Specialty",
      feeDisplay: "$185 – $205 (~₦285,000 – ₦315,000)",
      threshold: "$2,500 (~₦3.85M Maintenance)",
      processing: "15 – 20 Working Days",
      flights: "Delta Air Lines (DL 55) & United Airlines (UA 613)",
      flightRoute: "Lagos (LOS) → New York JFK • Direct 11h 15m",
      luggage: "2 × 23kg Checked Bags Included",
      embassyCenters: "U.S. Consulate General Victoria Island, Lagos & U.S. Embassy Abuja",
      hotels: "New York Marriott Marquis & The Manhattan at Times Square",
      tagline: "Official immigration gateway for American tourism, tech employment, and university studies."
    }
  };

  const current = destinationDetails[selectedDestination];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 border-b border-slate-200/80">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-xs font-bold text-indigo-900 tracking-wide">
              Autonomous Consular & Travel Operating System
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Travel & Relocate Abroad. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 bg-clip-text text-transparent">
              Zero Consular Form-Filling Friction.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Experience complete end-to-end relocation: strict 6-month passport guardrails, statutory visa calculations for the UK and US, live Paystack fee settlement, physical embassy interview slips, and locked GDS flight & hotel vouchers.
          </p>

          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/client"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-900/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Launch AI Trip Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Agency Review Portal</span>
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">6-Month Guardrail</div>
                <div className="text-[11px] text-slate-500">Strict treaty compliance</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Paystack Live</div>
                <div className="text-[11px] text-slate-500">Dynamic fee checkout</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Physical Slips</div>
                <div className="text-[11px] text-slate-500">Lagos & Abuja embassy slips</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Direct Flights</div>
                <div className="text-[11px] text-slate-500">Wakanow GDS PNR holds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Destination Pathways Showcase (UK & US) */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">
            Certified Consular Corridors
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select Your Destination Pathway
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Explore live statutory consular requirements, airline flight manifests, and embassy interview venues.
          </p>

          {/* Corridor Switcher Pills */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setSelectedDestination("gb")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                selectedDestination === "gb"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              <span>United Kingdom (London)</span>
            </button>

            <button
              onClick={() => setSelectedDestination("us")}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                selectedDestination === "us"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-lg">🇺🇸</span>
              <span>United States (New York)</span>
            </button>
          </div>
        </div>

        {/* Detailed Corridor Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{current.flag}</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {current.city}, {current.country}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{current.tagline}</p>
              </div>
            </div>

            <Link
              to="/client"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer shrink-0"
            >
              <span>Begin {current.country} Intake</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Visa & Statutory Fees */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Statutory Visa Pathways</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1.5">
                <div>Route: <strong>{current.primaryVisa}</strong></div>
                <div>Statutory Fee: <strong className="text-emerald-700 font-mono">{current.feeDisplay}</strong></div>
                <div>Maintenance Rule: <strong>{current.threshold}</strong></div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Processing: {current.processing}
                </div>
              </div>
            </div>

            {/* 2. Direct Flights */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <Plane className="w-4 h-4 text-emerald-600" />
                <span>Direct Flights from Lagos</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1.5">
                <div>Airlines: <strong>{current.flights}</strong></div>
                <div className="text-[11px] text-slate-600">{current.flightRoute}</div>
                <div>Baggage: <strong className="text-indigo-700">{current.luggage}</strong></div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  GDS Instant PNR Locking Active
                </div>
              </div>
            </div>

            {/* 3. Physical Embassy Biometrics */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Physical Embassy Venues</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1.5">
                <div>Centers: <strong>{current.embassyCenters}</strong></div>
                <div>Slip Output: <strong>Official Barcoded PDF Slip</strong></div>
                <div>Hotel Stays: <strong>{current.hotels}</strong></div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Certified Consular Proof-of-Stay
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4-Step Autonomous Journey */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Autonomous Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How TravelForge Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Passport Guardrail</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your international passport data page. Our AI verifies compliance with the statutory 6-month validity rule before fees are paid.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Bank Statement Audit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your 6-month financial statement. The engine calculates your average balance and confirms maintenance threshold surplus.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Paystack & Embassy Slip</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay your statutory consular fee dynamically via Paystack. Instantly receive your official physical embassy appointment slip with barcoding.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Flights & Hotel Vouchers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lock in verified direct flights and certified consular hotel vouchers for London and New York with GDS PNR references.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span className="font-black text-white text-sm">TravelForge</span>
            <span className="text-slate-500 ml-2">Autonomous Consular & Travel OS</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/client" className="hover:text-white transition-colors">Trip Assistant</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Agency Review</Link>
            <span className="text-slate-600">© 2026 TravelForge. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
