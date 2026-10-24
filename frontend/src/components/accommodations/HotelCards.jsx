import React, { useState } from 'react';
import { Building2, Sparkles, X, Check, MapPin, Calendar, Users, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../shared/Button';

export const HotelCards = ({ hotels = [], onReserveHotel }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [reservedHotel, setReservedHotel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hotels || hotels.length === 0) return null;

  const handleConfirmReservation = async () => {
    if (!selectedHotel) return;
    setIsSubmitting(true);
    try {
      if (onReserveHotel) {
        await onReserveHotel(selectedHotel);
      }
      setReservedHotel(selectedHotel);
      setSelectedHotel(null);
    } catch (err) {
      console.error('Failed to reserve hotel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Consular-Certified Accommodations</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Honeymoon Suites
            </span>
          </div>
          <p className="text-xs text-slate-500">Official embassy proof-of-stay vouchers with free cancellation guarantees</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
          Verified Vouchers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels.map((h) => {
          const isReserved = reservedHotel && reservedHotel.id === h.id;

          return (
            <div
              key={h.id}
              className={
                "p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 " +
                (isReserved
                  ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30"
                  : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-subtle")
              }
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{h.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{h.city}, {h.country}</span>
                      <span className="text-amber-500 font-bold ml-1">{'★'.repeat(h.stars || 5)}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 shrink-0">
                    Consular Valid
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 mb-3">
                  <div className="text-xs font-semibold text-slate-800 mb-1">{h.room_type}</div>
                  {h.honeymoon_highlights && h.honeymoon_highlights.length > 0 && (
                    <div className="text-[11px] text-rose-700 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{h.honeymoon_highlights[0]}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(h.amenities || []).slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                <div>
                  <div className="text-sm font-black text-slate-900">{h.price_formatted || ₦/night}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Free cancellation</div>
                </div>

                <Button
                  variant={isReserved ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedHotel(h)}
                >
                  {isReserved ? 'Voucher Issued ✓' : 'Issue Voucher'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consular Voucher Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Embassy Hotel Voucher</h3>
                <p className="text-xs text-slate-500">Certified accommodation attestation for visa filing</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 my-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Hotel:</span>
                <span className="font-bold text-slate-900">{selectedHotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-semibold text-slate-900">{selectedHotel.city}, {selectedHotel.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Room Category:</span>
                <span className="font-semibold text-slate-800">{selectedHotel.room_type}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-medium">Nightly Rate:</span>
                <span className="font-black text-slate-900 text-sm">{selectedHotel.price_formatted}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes certified booking reference with free cancellation until visa approval.</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => setSelectedHotel(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={isSubmitting}
                onClick={handleConfirmReservation}
              >
                {isSubmitting ? 'Issuing Voucher...' : 'Confirm Voucher'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

