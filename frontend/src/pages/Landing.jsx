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
  Globe2
} from "lucide-react";

export const Landing = () => {
  const [destination, setDestination] = useState("dubai");
  const [purpose, setPurpose] = useState("tourism");

  const destinationData = {
    dubai: {
      name: "Dubai, United Arab Emirates",
      flag: "🇦🇪",
      visaType: "30-Day Tourist e-Visa (100% Online)",
      processingTime: "3 – 5 Days",
      visaFee: "₦185,000 (~$120)",
      flightPrice: "₦890,000",
      airline: "Emirates / Qatar Airways (Direct)",
      docs: ["Passport Data Page (6+ months validity)", "Confirmed Return Ticket", "Hotel Booking Confirmation"],
      badge: "Easy Online e-Visa"
    },
    uk: {
      name: "London, United Kingdom",
      flag: "🇬🇧",
      visaType: "UK Standard Visitor Visa (6 Months)",
      processingTime: "10 – 15 Days",
      visaFee: "₦230,000 (£115)",
      flightPrice: "₦1,450,000",
      airline: "British Airways / Virgin Atlantic (Direct)",
      docs: ["Passport Data Page (6+ months validity)", "Return Flight Reservation", "Proof of Funds (3-Month Bank Statement)", "Hotel Reservation"],
      badge: "VFS Biometrics Required"
    },
    france: {
      name: "Paris, France (Schengen)",
      flag: "🇫🇷",
      visaType: "Schengen Short-Stay Tourist Visa (Type C)",
      processingTime: "15 Days",
      visaFee: "₦160,000 (€90)",
      flightPrice: "₦1,250,000",
      airline: "Air France (Direct)",
      docs: ["Passport (3+ months beyond stay)", "Travel Insurance (€30,000)", "Flight Itinerary", "Hotel Voucher"],
      badge: "Schengen 27 Countries"
    },
    kenya: {
      name: "Nairobi, Kenya",
      flag: "🇰🇪",
      visaType: "Kenya Electronic Travel Authorisation (eTA)",
      processingTime: "72 Hours",
      visaFee: "₦55,000 ($35)",
      flightPrice: "₦680,000",
      airline: "Kenya Airways (Direct)",
      docs: ["Passport (6+ months validity)", "Return Flight Ticket", "Yellow Fever Card"],
      badge: "Instant Approval"
    }
  };

  const current = destinationData[destination];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-4 shadow-subtle">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI-Native Travel & Visa Companion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Travel Anywhere. <br />
              <span className="text-brand-600">Zero Form-Filling Hassle.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Tell our AI travel assistant where you want to go. It checks visa requirements, verifies your passport, and reserves direct flights on the fly.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-dropdown p-4 sm:p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Passport Origin */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Passport
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span>🇳🇬</span>
                  <span>Nigeria</span>
                </div>
              </div>

              {/* Destination Selector */}
              <div className="p-3.5 rounded-2xl bg-white border border-brand-300 ring-2 ring-brand-500/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  Where to?
                </span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="dubai">🇦🇪 Dubai, United Arab Emirates</option>
                  <option value="uk">🇬🇧 London, United Kingdom</option>
                  <option value="france">🇫🇷 Paris, France (Schengen)</option>
                  <option value="kenya">🇰🇪 Nairobi, Kenya</option>
                </select>
              </div>

              {/* Trip Purpose */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Trip Purpose
                </span>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="tourism">Holiday & Vacation</option>
                  <option value="business">Business & Meetings</option>
                  <option value="study">Short Study / Workshop</option>
                </select>
              </div>
            </div>

            {/* Instant Visa & Flights Overview Card */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{current.flag}</span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      {current.name}
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {current.badge}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{current.visaType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Processing:</span>
                    <span className="font-bold text-slate-900">{current.processingTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Government Fee:</span>
                    <span className="font-bold text-brand-700">{current.visaFee}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Flights From:</span>
                    <span className="font-bold text-slate-900">{current.flightPrice}</span>
                  </div>
                </div>
              </div>

              {/* Start Planning Action */}
              <div className="md:col-span-4 flex flex-col justify-center">
                <Link
                  to="/client"
                  className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start with AI Assistant</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-[11px] text-slate-400 text-center mt-2">
                  No credit card required to check
                </div>
              </div>
            </div>
          </div>

          {/* 3 Simple Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Chat Naturally
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No complex paperwork. The AI assistant asks for details on the fly and explains every visa requirement clearly.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                On-The-Fly Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop your passport photo directly in chat. The agent checks 6-month validity and locks real flight reservations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Agency Review & Submit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Experienced travel agency consultants do a final check on your assembled package before transmitting to the embassy.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
