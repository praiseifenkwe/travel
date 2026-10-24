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
      id: "htl_uk_royal_national",
      name: "Royal National Hotel",
      location: "38 51 Bedford Way, Bloomsbury, London",
      city: "London",
      country: "United Kingdom",
      price_ngn: 677412,
      price_formatted: "₦225,804 / night (₦677,412 / 3 nights)",
      total_amount_ngn: 677412,
      rate_per_night_ngn: 225804,
      rating: 3.0,
      amenities: ["Consular Proof-of-Stay Voucher", "Free High-Speed Wi-Fi", "Bloomsbury Proximity", "24/7 Front Desk"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "htl_uk_w_london",
      name: "W London Leicester Square",
      location: "10 Wardour Street, Leicester Square, London",
      city: "London",
      country: "United Kingdom",
      price_ngn: 1192429,
      price_formatted: "₦1,192,429 / night",
      total_amount_ngn: 1192429,
      rate_per_night_ngn: 1192429,
      rating: 5.0,
      amenities: ["5-Star Luxury", "Consular Proof-of-Stay Voucher", "Leicester Square", "Spa & Wellness"],
      image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ht_the_savoy_london",
      name: "The Savoy London",
      location: "Strand, London WC2R 0EZ",
      city: "London",
      country: "United Kingdom",
      price_ngn: 480000,
      price_formatted: "₦480,000 / night",
      total_amount_ngn: 480000,
      rate_per_night_ngn: 480000,
      rating: 5.0,
      amenities: ["Consular Proof of Stay", "Personal Butler Service", "Thames Vista", "Gordon Ramsay Grill"],
      image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ht_westminster_bridge",
      name: "Park Plaza Westminster Bridge",
      location: "London SE1 7UT, United Kingdom",
      city: "London",
      country: "United Kingdom",
      price_ngn: 640000,
      price_formatted: "₦640,000 / stay",
      total_amount_ngn: 640000,
      rate_per_night_ngn: 213333,
      rating: 4.8,
      amenities: ["Free High-Speed Wi-Fi", "Consular Proof-of-Stay Voucher", "Big Ben View", "Full English Breakfast"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const defaultUsHotels = [
    {
      id: "htl_us_holiday_inn_wall_street",
      name: "Holiday Inn New York City Wall Street By IHG",
      location: "51 Nassau St., Financial District, New York City",
      city: "New York",
      country: "United States",
      price_ngn: 1187790,
      price_formatted: "₦395,930 / night (₦1,187,790 / 3 nights)",
      total_amount_ngn: 1187790,
      rate_per_night_ngn: 395930,
      rating: 3.0,
      amenities: ["DS-160 Proof-of-Stay Voucher", "Free High-Speed Wi-Fi", "Financial District", "24/7 Front Desk"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "htl_us_holiday_inn_express_wall_street",
      name: "Holiday Inn Express NYC Wall Street By IHG",
      location: "126 Water St, New York City",
      city: "New York",
      country: "United States",
      price_ngn: 1218720,
      price_formatted: "₦406,240 / night (₦1,218,720 / 3 nights)",
      total_amount_ngn: 1218720,
      rate_per_night_ngn: 406240,
      rating: 2.5,
      amenities: ["Consular Booking Voucher", "Express Breakfast Included", "High-Speed Wi-Fi", "Prime Location"],
      image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "htl_us_the_gatsby_hotel",
      name: "The Gatsby Hotel",
      location: "135 East Houston St, Lower East Side, New York City",
      city: "New York",
      country: "United States",
      price_ngn: 1246560,
      price_formatted: "₦415,520 / night (₦1,246,560 / 3 nights)",
      total_amount_ngn: 1246560,
      rate_per_night_ngn: 415520,
      rating: 3.0,
      amenities: ["Consular Certified Voucher", "Boutique Rooms", "Subway Proximity", "Free Wi-Fi"],
      image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ht_nyc_marriott_marquis",
      name: "New York Marriott Marquis",
      location: "1535 Broadway, Times Square, New York, NY 10036",
      city: "New York",
      country: "United States",
      price_ngn: 840000,
      price_formatted: "₦560,000 / night (₦840,000 / stay)",
      total_amount_ngn: 840000,
      rate_per_night_ngn: 560000,
      rating: 4.9,
      amenities: ["Times Square View", "Consular Proof-of-Stay Voucher", "High-Speed Wi-Fi", "24/7 Concierge"],
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
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
          <p className="text-[11px] text-slate-500">From verified consular database. Includes official Proof-of-Stay voucher with QR verification seal.</p>
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
