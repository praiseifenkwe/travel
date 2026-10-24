import React, { useState } from 'react';
import { Building2, MapPin, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Button } from '../shared/Button';

export const HotelCards = ({ 
  hotels = [], 
  destinationCountry = "GB", // "GB" or "US"
  onSelectHotel 
}) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookedHotel, setBookedHotel] = useState(null);

  const defaultUkHotels = [
    {
      id: "ht_westminster_bridge",
      name: "Park Plaza Westminster Bridge",
      location: "London SE1 7UT, United Kingdom",
      city: "London",
      price_ngn: 640000,
      price_formatted: "₦640,000 / stay",
      rating: 4.8,
      amenities: ["Free High-Speed Wi-Fi", "Consular Proof-of-Stay Voucher", "Metro Access", "Full English Breakfast"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ht_citizenm_tower",
      name: "citizenM Tower of London",
      location: "Trinity Square, London EC3N 4DJ",
      city: "London",
      price_ngn: 580000,
      price_formatted: "₦580,000 / stay",
      rating: 4.9,
      amenities: ["Consular Booking Voucher", "Luggage Storage", "24/7 Concierge", "Free Wi-Fi"],
      image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const defaultUsHotels = [
    {
      id: "ht_nyc_marriott_marquis",
      name: "New York Marriott Marquis",
      location: "1535 Broadway, Times Square, New York, NY 10036",
      city: "New York",
      price_ngn: 840000,
      price_formatted: "₦840,000 / stay",
      rating: 4.9,
      amenities: ["Times Square View", "Consular Proof-of-Stay Voucher", "High-Speed Wi-Fi", "24/7 Concierge"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ht_nyc_manhattan_times",
      name: "The Manhattan at Times Square Hotel",
      location: "790 7th Ave, New York, NY 10019",
      city: "New York",
      price_ngn: 660000,
      price_formatted: "₦660,000 / stay",
      rating: 4.7,
      amenities: ["Midtown Central Location", "Consular Booking Voucher", "Free Wi-Fi", "Luggage Storage"],
      image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const activeHotels = hotels && hotels.length > 0 
    ? hotels 
    : (destinationCountry === "US" ? defaultUsHotels : defaultUkHotels);

  const handlePayHotel = (hotel) => {
    setBookedHotel(hotel);
    if (onSelectHotel) onSelectHotel(hotel);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sleek p-4 sm:p-5 mb-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            {destinationCountry === "US" ? "Certified Accommodations in New York 🇺🇸" : "Certified Accommodations in London 🇬🇧"}
          </h3>
          <p className="text-[11px] text-slate-500">Includes official consular proof-of-stay voucher with QR verification seal</p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0">
          Consular Certified ✓
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {activeHotels.map((h) => {
          const isBooked = bookedHotel && bookedHotel.id === h.id;
          return (
            <div
              key={h.id}
              className={
                "p-4 rounded-2xl border transition-all flex flex-col justify-between " +
                (isBooked 
                  ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white hover:shadow-subtle")
              }
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{h.name}</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{h.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{h.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {h.amenities?.map((amenity, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 mt-3">
                <div>
                  <div className="text-sm font-black text-slate-900">{h.price_formatted}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Free cancellation before travel</div>
                </div>

                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => handlePayHotel(h)}
                  className="font-bold cursor-pointer"
                >
                  {isBooked ? 'Voucher Issued ✓' : 'Pay & Issue Voucher'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
