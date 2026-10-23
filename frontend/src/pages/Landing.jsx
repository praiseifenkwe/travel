import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Bot, 
  Plane, 
  FileCheck2, 
  AlertCircle,
  Building2,
  Users2,
  Lock,
  Cpu,
  Zap,
  Globe2
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner / Announcement */}
      <div className="bg-brand-50 border-b border-brand-100 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-brand-800 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
        <span>PAU Hackathon Showcase: Live Deterministic Immigration & Relocation Engine</span>
        <span className="hidden md:inline text-brand-400">•</span>
        <span className="hidden md:inline text-brand-700 font-semibold">Zero Hallucination Guarantee</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm text-slate-700 mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI-Native Visa & Relocation Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Relocate globally in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">15 minutes</span>, not 4 months.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Replacing fragmented agents and bureaucratic rejection risks with conversational OCR intake, deterministic UKVI compliance rules, and verified flight reservations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/client"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all text-base"
            >
              Launch Client Intake
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-base"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              Agency Staff Console
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all text-base"
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              Dual-Screen Simulator
            </Link>
          </div>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden mb-20">
          <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                travelforge.gov.audit/session/ukvi_tier2_tunde
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live WebSocket Audit Stream
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left Column: Applicant Intake & Verified Docs */}
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">01 / APPLICANT INTAKE</span>
                <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">Live Intake</span>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
                <div className="text-sm font-medium text-slate-800">
                  "Relocating to London for Bloomberg LP as Senior Software Engineer. Checking maintenance guarantee & CoS certificate."
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Nigerian Passport (Bio Page)', status: 'Verified (99.4%)', sub: 'Valid until 14 Nov 2031' },
                  { name: 'Certificate of Sponsorship (CoS)', status: 'Active (A-Rated)', sub: 'Sponsor: Bloomberg LP (Tier 2)' },
                  { name: 'IOM TB Clearance Certificate', status: 'Cleared', sub: 'Issued: St. Nicholas Hospital Lagos' },
                  { name: '28-Day Bank Statement', status: 'Guaranteed', sub: 'Sponsor Maintenance certified under Section A2' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-subtle hover:border-slate-300 transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.sub}</div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Deterministic Rule Clearance */}
            <div className="p-6 lg:p-8 bg-slate-50/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">02 / IMMIGRATION RULES ENGINE</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Zero Hallucination</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 mb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  UKVI Appendix Finance — Rule FIN 2.1
                </div>
                <div className="text-xs text-amber-800 leading-relaxed">
                  Personal savings fall below standard £1,270 threshold. Deterministic parser matched Tier-A Sponsor Certification of Maintenance in CoS.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle mb-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Relocation Booking Sync</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Plane className="w-4 h-4 text-brand-600" />
                    LOS → LHR • British Airways BA 074
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    Corporate Hold Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  Confirm Compliance Clearance
                </Link>
                <Link
                  to="/client"
                  className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors"
                >
                  View Client Dossier
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Conversational Slot-Filling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate 40-page consular forms. Natural language intake extracts visa category, salary bands, CoS numbers, and family dependents in minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Rules Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              UK Immigration rules (TB requirements, funds math, sponsor license validity) evaluated via deterministic Python algorithms, eliminating hallucination risks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Agency Staff Supervision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Licensed caseworkers review side-by-side OCR diffs, verify employer sponsorship exemptions, and sign off before formal UKVI electronic submission.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-card p-8 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="text-center pt-4 lg:pt-0">
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1">15 min</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Turnaround Time</div>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <div className="text-4xl font-extrabold text-emerald-600 tracking-tight mb-1">0%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UKVI Section 320 Refusals</div>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <div className="text-4xl font-extrabold text-brand-600 tracking-tight mb-1">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Auditable Rule Logic</div>
            </div>
            <div className="text-center pt-4 lg:pt-0">
              <div className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-1">&lt; 50ms</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agency Real-time Sync</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
