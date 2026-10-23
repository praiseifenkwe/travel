import React from 'react';
import { X, CheckCircle2, Download, Printer, ShieldCheck, FileText, Plane, Hotel, Luggage } from 'lucide-react';
import { Button } from './Button';

export const DossierModal = ({ isOpen, onClose, appData = {}, documents = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-5">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Travel & Embassy Document Pack
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Official Travel Itinerary & Visa Dossier
          </h2>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Booking Ref: TF-TRIP-2026-981 • Generated for Embassy / Airline Check-in
          </div>
        </div>

        {/* Trip Summary Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3.5 text-xs mb-6">
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Lead Traveler</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{appData.client_name || 'Tunde Babatunde Adeyemi'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Destination</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{appData.destination || 'London, United Kingdom'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Trip Purpose</span>
            <div className="font-bold text-brand-700 text-sm mt-0.5">{appData.trip_type || 'Holiday & Tourism (14 Days)'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Airline & Ticket</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">British Airways BA074 (Return LOS-LHR)</div>
          </div>
        </div>

        {/* Verified Travel Requirements */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Verified Travel Checklist & Documents
          </h4>
          <div className="space-y-2">
            {[
              {
                title: 'International Passport Validity Check',
                detail: 'Valid for 5+ years (expires Nov 2031). Satisfies 6-month international entry rule.',
                status: 'Verified'
              },
              {
                title: 'Confirmed Return Flight Reservation',
                detail: 'British Airways flight BA074 departing Lagos 14 Nov, returning 28 Nov 2026.',
                status: 'Confirmed'
              },
              {
                title: 'Confirmed Accommodation Proof',
                detail: 'The Standard London (Kings Cross) • 14 Nights reservation matching flight dates.',
                status: 'Confirmed'
              },
              {
                title: 'Proof of Sufficient Living Funds',
                detail: 'GTBank closing balance of ₦4,850,000 (~£2,425), meeting 14-day holiday budget guidelines.',
                status: 'Verified'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{item.detail}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download Official Travel Pack (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};
