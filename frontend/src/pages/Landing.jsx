import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export const Landing = () => {
  const [destination, setDestination] = useState('dubai');
  const [purpose, setPurpose] = useState('tourism');

  const destinationData = {
    dubai: {
      name: 'Dubai, United Arab Emirates',
      flag: '🇦🇪',
      visaType: '30-Day Tourist e-Visa (100% Online)',
      processingTime: '3 - 5 Days',
      visaFee: '$120 (~₦185,000)',
      flightPrice: '₦890,000',
      airline: 'Emirates / Qatar Airways (Direct)',
      docs: ['Passport Bio Page (6+ months validity)', 'Confirmed Return Ticket', 'Hotel Booking Confirmation'],
      badge: 'Easy Online Visa'
    },
    uk: {
      name: 'London, United Kingdom',
      flag: '🇬🇧',
      visaType: 'UK Standard Visitor Visa (6 Months)',
      processingTime: '10 - 15 Days',
      visaFee: '£115 (~₦230,000)',
      flightPrice: '₦1,450,000',
      airline: 'British Airways / Virgin Atlantic (Direct)',
      docs: ['Passport Bio Page (6+ months validity)', 'Return Flight Reservation', 'Proof of Funds (3-Month Statement)', 'Hotel Reservation'],
      badge: 'Embassy Drop-off'
    },
    france: {
      name: 'Paris, France (Schengen)',
      flag: '🇫🇷',
      visaType: 'Schengen Short-Stay Tourist Visa (Type C)',
      processingTime: '15 Days',
      visaFee: '€90 (~₦160,000)',
      flightPrice: '₦1,620,000',
      airline: 'Air France (Direct from Lagos)',
      docs: ['Passport Bio Page', 'Schengen Travel Insurance (€30k coverage)', 'Confirmed Return Flight', 'Proof of Funds'],
      badge: 'VFS Biometrics'
    },
    kenya: {
      name: 'Nairobi, Kenya',
      flag: '🇰🇪',
      visaType: 'Electronic Travel Authorisation (eTA)',
      processingTime: '24 - 48 Hours',
      visaFee: '$34 (~₦52,000)',
      flightPrice: '₦680,000',
      airline: 'Kenya Airways (Direct from Lagos)',
      docs: ['Passport Bio Page', 'Return Flight Ticket', 'Hotel Confirmation'],
      badge: 'Instant eTA'
    }
  };

  const current = destinationData[destination] || destinationData.dubai;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-sm mb-6">
          <Globe2 className="w-4 h-4 text-brand-600" />
          <span>The Smart International Travel & Visa Guide</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          Know your visa requirements <br className="hidden sm:inline" />
          <span className="text-brand-600">before you book your flight</span>.
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
          Check visa requirements for any country, verify your documents so you don't get rejected, and book verified return flights with free holds.
        </p>

        {/* The Clean Search Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 max-w-3xl mx-auto text-left mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Passport */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Your Passport:
              </label>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="text-base">🇳🇬</span>
                <span>Nigeria</span>
              </div>
            </div>

            {/* Destination Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Traveling To:
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="dubai">🇦🇪 Dubai, UAE</option>
                <option value="uk">🇬🇧 London, United Kingdom</option>
                <option value="france">🇫🇷 Paris, France (Schengen)</option>
                <option value="kenya">🇰🇪 Nairobi, Kenya</option>
              </select>
            </div>

            {/* Purpose */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Trip Purpose:
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="tourism">🏖️ Holiday / Tourism</option>
                <option value="business">💼 Business / Conference</option>
                <option value="study">🎓 Study / Student</option>
              </select>
            </div>
          </div>

          {/* Instant Destination Result Preview */}
          <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{current.flag}</span>
                <div>
                  <div className="text-base font-extrabold text-slate-900">{current.name}</div>
                  <div className="text-xs text-brand-700 font-bold">{current.visaType}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full self-start">
                {current.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Processing Time:</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{current.processingTime}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Visa Fee:</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{current.visaFee}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Flights From:</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{current.flightPrice}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Airline:</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">{current.airline}</span>
              </div>
            </div>

            {/* Document Checklist Preview */}
            <div className="mt-4 pt-4 border-t border-brand-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                What you will need for this trip:
              </div>
              <div className="space-y-1.5">
                {current.docs.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Verified against current 2026 consular entry regulations.
            </span>
            <Link
              to="/client"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all text-sm"
            >
              Plan Trip & Check Documents
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3 Simple Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Pre-Check Your Documents</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your passport, hotel reservation, and tickets. We check for common mistakes before you apply so your visa doesn't get delayed.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Hold Flights for Free</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hold airline seats on Emirates, British Airways, or Qatar Airways for 72 hours without paying upfront while your visa is being approved.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Instant Travel Itinerary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get an official verified trip itinerary with all your flight confirmations, hotel bookings, and entry documents in one clean PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
