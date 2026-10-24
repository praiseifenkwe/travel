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
  Compass
} from "lucide-react";

export const Landing = () => {
  const [destination, setDestination] = useState("dubai");
  const [purpose, setPurpose] = useState("tourism");

  const destinations = {
    dubai: {
      name: "Dubai, United Arab Emirates",
      flag: "🇦🇪",
      code: "DXB",
      visaType: "30-Day Tourist e-Visa (100% Online)",
      processingTime: "3 – 5 Days",
      visaFee: "₦185,000 (~$120)",
      flightPrice: "₦890,000",
      airline: "Emirates (Direct 8h 15m)",
      docs: ["Passport Data Page (6+ mos validity)", "Confirmed Return Flight Hold", "Certified Hotel Booking"],
      badge: "Fast Track e-Visa",
      highlights: "Direct flights from Lagos (LOS) via Emirates EK 784 • No physical embassy interview required"
    },
    uk: {
      name: "London, United Kingdom",
      flag: "🇬🇧",
      code: "LHR",
      visaType: "UK Standard Visitor Visa (6 Months)",
      processingTime: "10 – 15 Days",
      visaFee: "₦230,000 (£115)",
      flightPrice: "₦1,450,000",
      airline: "British Airways (Direct 6h 30m)",
      docs: ["Passport Data Page (6+ mos validity)", "Return Flight Reservation", "Proof of Funds (3-Mo Statement)", "Accommodation Proof"],
      badge: "VFS Biometrics Required",
      highlights: "Direct flights from Lagos (LOS) via British Airways BA 074 • 28-day funds holding period rule"
    },
    france: {
      name: "Paris, France (Schengen)",
      flag: "🇫🇷",
      code: "CDG",
      visaType: "Schengen Short-Stay Visa (Type C)",
      processingTime: "15 Days",
      visaFee: "₦160,000 (€90)",
      flightPrice: "₦1,250,000",
      airline: "Air France (Direct 6h 15m)",
      docs: ["Passport (3+ mos beyond stay)", "Travel Insurance (€30,000)", "Flight Itinerary", "Hotel Voucher"],
      badge: "27 European Countries",
      highlights: "Unrestricted access across the Schengen Area • Certified travel insurance required"
    },
    kenya: {
      name: "Nairobi, Kenya",
      flag: "🇰🇪",
      code: "NBO",
      visaType: "Kenya Electronic Travel Authorisation (eTA)",
      processingTime: "72 Hours",
      visaFee: "₦55,000 ($35)",
      flightPrice: "₦680,000",
      airline: "Kenya Airways (Direct 5h 20m)",
      docs: ["Passport (6+ mos validity)", "Return Flight Ticket", "Yellow Fever Card"],
      badge: "72h Digital Approval",
      highlights: "East African wildlife & safari clearance • Instant digital certificate on arrival"
    }
  };

  const current = destinations[destination];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Subtle Luxury Mesh Glow */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.08),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header Typography */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold mb-5 shadow-sleek">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI-Native Travel & Visa Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
              World Travel. <br />
              <span className="text-slate-400 font-extrabold">Zero Form-Filling Hassle.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto font-normal">
              Tell our AI travel concierge where you want to go. It checks consular rules, verifies your passport, and reserves flights on the fly.
            </p>
          </div>

          {/* Luxury Floating Command Center */}
          <div className="max-w-4xl mx-auto bg-white rounded-[36px] border border-slate-200/80 shadow-float p-6 sm:p-8 mb-16">
            
            {/* Segmented Destination Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 bg-slate-100/70 rounded-2xl border border-slate-200/50">
              {Object.entries(destinations).map(([key, item]) => {
                const isSelected = destination === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDestination(key)}
                    className={
                      "py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer " +
                      (isSelected
                        ? "bg-white text-slate-900 shadow-sleek"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50")
                    }
                  >
                    <span className="text-base">{item.flag}</span>
                    <span className="truncate">{key === "dubai" ? "Dubai" : key === "uk" ? "London" : key === "france" ? "Paris" : "Nairobi"}</span>
                  </button>
                );
              })}
            </div>

            {/* Destination Spotlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl filter drop-shadow-sm">{current.flag}</span>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      {current.name}
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
                        {current.code}
                      </span>
                    </h3>
                    <p className="text-xs text-brand-700 font-semibold mt-0.5">{current.visaType}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {current.highlights}
                </p>

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">TURNAROUND</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{current.processingTime}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">VISA FEE</span>
                    <span className="font-extrabold text-brand-700 text-xs mt-0.5 block">{current.visaFee}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">FLIGHTS FROM</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{current.flightPrice}</span>
                  </div>
                </div>
              </div>

              {/* Start Planning CTA */}
              <div className="md:col-span-4 flex flex-col justify-center">
                <Link
                  to="/client"
                  className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs shadow-sleek transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                  <span>Start with AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-[11px] text-slate-400 text-center mt-2.5 font-mono">
                  Zero form-filling required
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-7 rounded-[32px] bg-white border border-slate-200/80 shadow-sleek space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                <Compass className="w-5 h-5 text-slate-800" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Wakanow RAG Knowledge
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trained on real African traveler policies for the UK, UAE, US, Canada, and Schengen. Instant answers with cited consular clauses.
              </p>
            </div>

            <div className="p-7 rounded-[32px] bg-white border border-slate-200/80 shadow-sleek space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                <Fingerprint className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Biometric MRZ Extraction
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drop your passport photo directly in the chat river. The agent parses ICAO 9303 checksums and verifies 6-month validity in 800ms.
              </p>
            </div>

            <div className="p-7 rounded-[32px] bg-white border border-slate-200/80 shadow-sleek space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                <Ticket className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                72h Direct Flight Holds
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guaranteed airline reservation holds for Emirates and British Airways. Complete consular submission requirements with zero upfront ticket risk.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
