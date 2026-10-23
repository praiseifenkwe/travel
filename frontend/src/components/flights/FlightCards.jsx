import React, { useState } from 'react';
import { Plane, Luggage, X, Building2, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({ flights = [] }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlight, setBookedFlight] = useState(null);
  const [billingType, setBillingType] = useState('corporate');

  if (!flights || flights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Corporate Relocation Flights</h3>
          <p className="text-xs text-slate-500">Direct GDS inventory with corporate relocation baggage allowance</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          GDS Inventory Live
        </span>
      </div>

      <div className="space-y-3">
        {flights.map((fl) => {
          const isBooked = bookedFlight && bookedFlight.id === fl.id;

          return (
            <div
              key={fl.id}
              className={
                'p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ' +
                (isBooked
                  ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white')
              }
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-bold text-slate-900">{fl.airline}</span>
                  <span className="text-xs font-mono font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                    {fl.flight_number}
                  </span>
                  <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                    {fl.class}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-3">
                  <span className="font-semibold text-slate-800">{fl.route}</span>
                  <span>•</span>
                  <span>Departure: {fl.departure_date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1.5">
                  <Luggage className="w-3.5 h-3.5" />
                  <span>{fl.baggage || '2 x 23kg Checked Bags + 1 Cabin'}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">
                    ₦{fl.price_ngn ? fl.price_ngn.toLocaleString() : '1,850,000'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Employer Billed</div>
                </div>

                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedFlight(fl)}
                >
                  {isBooked ? 'Hold Active ✓' : 'Book Corporate Hold'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corporate Billing Hold Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-dropdown max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedFlight(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Corporate Flight Hold
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Reserve seats without instant card charge pending final visa biometric approval.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Flight:</span>
                <span className="font-semibold text-slate-900">{selectedFlight.airline} ({selectedFlight.flight_number})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Route:</span>
                <span className="font-semibold text-slate-900">{selectedFlight.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Baggage:</span>
                <span className="font-semibold text-emerald-700">{selectedFlight.baggage}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-medium">Billed To:</span>
                <span className="font-bold text-brand-700">Bloomberg LP Corporate Relocation</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => setSelectedFlight(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setBookedFlight(selectedFlight);
                  setSelectedFlight(null);
                }}
              >
                Authorize 72-Hour Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
