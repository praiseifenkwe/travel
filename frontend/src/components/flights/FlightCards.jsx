import React, { useState } from 'react';
import { Plane, Luggage, X, Building2, CreditCard, ShieldCheck, Clock, Check } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({ flights = [] }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlight, setBookedFlight] = useState(null);

  if (!flights || flights.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Verified Return Flights</h3>
          <p className="text-xs text-slate-500">Live inventory with 2 x 23kg luggage allowance & free 72-hour holds</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          GDS Airline Sync Live
        </span>
      </div>

      <div className="space-y-3">
        {flights.map((fl) => {
          const isBooked = bookedFlight && bookedFlight.id === fl.id;

          return (
            <div
              key={fl.id}
              className={
                "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 " +
                (isBooked
                  ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30"
                  : "border-slate-200 hover:border-slate-300 bg-white")
              }
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-bold text-slate-900">{fl.airline}</span>
                  <span className="text-xs font-mono font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                    {fl.flight_number}
                  </span>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                    {fl.class}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-3">
                  <span className="font-bold text-slate-900">{fl.route}</span>
                  <span>•</span>
                  <span>{fl.departure_date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1.5">
                  <Luggage className="w-3.5 h-3.5" />
                  <span>{fl.baggage || '2 x 23kg Checked Bags + 1 Cabin'}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    ₦{fl.price_ngn ? fl.price_ngn.toLocaleString() : '1,850,000'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Taxes & fees included</div>
                </div>

                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedFlight(fl)}
                >
                  {isBooked ? 'Seat Held (72h) ✓' : 'Hold Fare & Seat'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 72-Hour Seat Hold Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedFlight(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  72-Hour Flight Fare Lock
                </h3>
                <p className="text-xs text-slate-500">Hold your seat reservation with zero penalty</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 my-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Airline:</span>
                <span className="font-bold text-slate-900">{selectedFlight.airline} ({selectedFlight.flight_number})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Route:</span>
                <span className="font-semibold text-slate-900">{selectedFlight.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Luggage Allowance:</span>
                <span className="font-bold text-emerald-700">{selectedFlight.baggage}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-medium">Locked Price:</span>
                <span className="font-black text-slate-900 text-sm">₦{selectedFlight.price_ngn?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-5 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free cancellation. Ticket is held until visa approval.</span>
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
                Confirm 72-Hour Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
