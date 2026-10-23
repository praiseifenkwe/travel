import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Compass, 
  Luggage, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Globe2, 
  FileText, 
  CreditCard, 
  Clock, 
  Bot,
  Hotel,
  AlertCircle,
  User
} from 'lucide-react';

export const Landing = () => {
  const [selectedDestination, setSelectedDestination] = useState('London (UK)');
  const [selectedPurpose, setSelectedPurpose] = useState('Tourist & Vacation');

  const popularTrips = [
    { city: 'London, United Kingdom', flag: '🇬🇧', visa: 'Standard Visitor Visa (6 Months)', flightsFrom: '₦1,450,000' },
    { city: 'Dubai, United Arab Emirates', flag: '🇦🇪', visa: '30-Day Tourist e-Visa', flightsFrom: '₦890,000' },
    { city: 'Paris, France (Schengen)', flag: '🇫🇷', visa: 'Schengen Short-Stay Visa (Type C)', flightsFrom: '₦1,620,000' },
    { city: 'Nairobi, Kenya', flag: '🇰🇪', visa: 'Electronic Travel Authorisation (eTA)', flightsFrom: '₦680,000' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner */}
      <div className="bg-brand-50 border-b border-brand-100 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-brand-800 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-600" />
        <span>Plan Trips, Check Visa Requirements & Book Flights in Minutes</span>
        <span className="hidden md:inline text-brand-300">•</span>
        <span className="hidden md:inline text-brand-700">Zero Embassy Rejection Guarantee</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 shadow-subtle text-slate-700 mb-6">
            <Globe2 className="w-4 h-4 text-brand-600" />
            <span>The All-in-One Smart Travel & Visa Companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
            Travel anywhere in the world with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">zero visa stress</span>.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Whether you're taking a vacation to Dubai, a holiday in London, attending a business conference, or relocating abroad — TravelForge checks your entry rules, verifies your travel documents, and reserves your flights.
          </p>

          {/* Quick Interactive Search / Explorer Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-5 max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-left">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Flying From:
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Lagos (LOS), Nigeria</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Destination:
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Plane className="w-4 h-4 text-indigo-600" />
                  <span>London / Dubai / Paris</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Travel Purpose:
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Luggage className="w-4 h-4 text-emerald-600" />
                  <span>Vacation / Business</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Instant passport entry check for Nigerian & African passport holders
              </span>
              <Link
                to="/client"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-subtle hover:shadow transition-all text-sm"
              >
                Plan My Trip & Check Visas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/client"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              <User className="w-4 h-4 text-brand-600" />
              Open Traveler Portal
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Travel Agency Console
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Live Demo Simulator
            </Link>
          </div>
        </div>

        {/* Popular Destinations Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Popular Travel Destinations & Visa Requirements
              </h2>
              <p className="text-xs text-slate-500">
                Curated rules, flight routes, and document checklists for frequent travelers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTrips.map((trip, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-2">{trip.flag}</div>
                  <h3 className="font-bold text-slate-900 text-sm">{trip.city}</h3>
                  <div className="text-xs text-brand-700 font-semibold mt-1 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 inline-block">
                    {trip.visa}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Return Flights from</span>
                    <span className="text-xs font-extrabold text-slate-900">{trip.flightsFrom}</span>
                  </div>
                  <Link
                    to="/client"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-brand-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Platform Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Automated Visa Document Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your passport, flight reservation, hotel proof, and bank statement. Our AI scans them against official embassy guidelines to prevent costly application rejections.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Verified Flights & Free 72-Hour Holds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reserve genuine airline tickets (British Airways, Emirates, Virgin Atlantic, Qatar Airways) with 2 × 23kg baggage allowances and free holds while your visa is being processed.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">24/7 AI Travel Concierge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions about currency exchange rates, airport transit rules, visa biometric appointments, or what documents to carry? Your personal travel assistant is always online.
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-card p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 text-center">
            <div className="pt-3 lg:pt-0">
              <div className="text-3xl font-black text-slate-900 mb-1">50+</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Countries Covered</div>
            </div>
            <div className="pt-3 lg:pt-0">
              <div className="text-3xl font-black text-emerald-600 mb-1">99.8%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visa Document Accuracy</div>
            </div>
            <div className="pt-3 lg:pt-0">
              <div className="text-3xl font-black text-brand-600 mb-1">&lt; 2 min</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requirements Verification</div>
            </div>
            <div className="pt-3 lg:pt-0">
              <div className="text-3xl font-black text-indigo-600 mb-1">₦0</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hidden Agency Fees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
