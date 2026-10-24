import React, { useState } from 'react';
import { Plane, Luggage, X, Building2, CreditCard, ShieldCheck, Clock, Check, Sparkles } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({
  flights = [],
  destinationCountry = "GB", // "GB" or "US"
  onHoldFlight
}) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlight, setBookedFlight] = useState(null);

  const defaultUkFlights = [
    {
      id: "fl_los_lhr_ba76",
      airline: "British Airways",
      flight_no: "BA76",
      origin_code: "LOS",
      destination_code: "LHR",
      route: "Lagos (LOS) → London Heathrow (LHR)",
      departure: "2026-11-15T22:30:00",
      departure_date: "15 Nov 2026",
      baggage: "2 × 23kg Checked Bags + 1 Cabin",
      price_ngn: 1850000,
      price_formatted: "₦1,850,000",
      cabin: "World Traveller Plus (Direct Non-Stop)",
      honeymoon_perks: ["Consular 72h PNR Lock", "Priority Boarding", "Direct Non-Stop"]
    },
    {
      id: "fl_los_lhr_vs412",
      airline: "Virgin Atlantic",
      flight_no: "VS412",
      origin_code: "LOS",
      destination_code: "LHR",
      route: "Lagos (LOS) → London Heathrow (LHR)",
      departure: "2026-11-16T10:15:00",
      departure_date: "16 Nov 2026",
      baggage: "2 × 23kg Checked Bags + 1 Cabin",
      price_ngn: 1795000,
      price_formatted: "₦1,795,000",
      cabin: "Economy Classic (Direct Non-Stop)",
      honeymoon_perks: ["Consular 72h PNR Lock", "Complimentary In-Flight Wi-Fi"]
    },
    {
      id: "fl_los_lhr_ram",
      airline: "Royal Air Maroc",
      flight_no: "AT554",
      origin_code: "LOS",
      destination_code: "LHR",
      route: "Lagos (LOS) → Casablanca → London (LHR)",
      departure: "2026-11-16T19:10:00",
      departure_date: "16 Nov 2026",
      baggage: "2 × 23kg Checked Bags",
      price_ngn: 1193090,
      price_formatted: "₦1,193,090",
      cabin: "Economy Value Fare",
      honeymoon_perks: ["Cheapest Available", "1-Stop Casablanca", "Consular Visa Hold Eligible"]
    }
  ];

  const defaultUsFlights = [
    {
      id: "fl_los_jfk_dl55",
      airline: "Delta Air Lines",
      flight_no: "DL55",
      origin_code: "LOS",
      destination_code: "JFK",
      route: "Lagos (LOS) → New York (JFK)",
      departure: "2026-11-17T12:30:00",
      departure_date: "17 Nov 2026",
      baggage: "2 × 23kg Checked Bags + 1 Cabin",
      price_ngn: 2200000,
      price_formatted: "₦2,200,000",
      cabin: "Main Cabin (Direct Non-Stop)",
      honeymoon_perks: ["Direct Non-Stop Flight", "Consular 72h PNR Lock", "Power Outlets & Wi-Fi"]
    },
    {
      id: "fl_los_jfk_ua613",
      airline: "United Airlines",
      flight_no: "UA613",
      origin_code: "LOS",
      destination_code: "EWR",
      route: "Lagos (LOS) → New York Newark (EWR)",
      departure: "2026-11-18T23:55:00",
      departure_date: "18 Nov 2026",
      baggage: "2 × 23kg Checked Bags + 1 Cabin",
      price_ngn: 2350000,
      price_formatted: "₦2,350,000",
      cabin: "Economy Plus (Direct Non-Stop)",
      honeymoon_perks: ["Direct Non-Stop Flight", "Consular 72h PNR Lock"]
    },
    {
      id: "fl_los_jfk_lh568",
      airline: "Lufthansa",
      flight_no: "LH568",
      origin_code: "LOS",
      destination_code: "JFK",
      route: "Lagos (LOS) → Frankfurt → New York (JFK)",
      departure: "2026-11-18T23:55:00",
      departure_date: "18 Nov 2026",
      baggage: "2 × 23kg Checked Bags",
      price_ngn: 2454500,
      price_formatted: "₦2,454,500",
      cabin: "Economy 1-Stop",
      honeymoon_perks: ["1-Stop Frankfurt", "Consular Visa Hold Eligible"]
    }
  ];

  const activeFlights = flights && flights.length > 0
    ? flights
    : (destinationCountry === "US" ? defaultUsFlights : defaultUkFlights);

  const handlePayFlight = (flight) => {
    setBookedFlight(flight);
    if (onHoldFlight) onHoldFlight(flight);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sleek p-4 sm:p-5 mb-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            {destinationCountry === "US" ? "Certified Flights to New York (JFK / EWR) 🇺🇸" : "Certified Flights to London (LHR) 🇬🇧"}
          </h3>
          <p className="text-[11px] text-slate-500">Live GDS airline schedules eligible for 72-hour official consular visa hold</p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
          GDS PNR Lock ✓
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {activeFlights.map((f) => {
          const isBooked = bookedFlight && bookedFlight.id === f.id;
          return (
            <div
              key={f.id}
              className={
                "p-4 rounded-2xl border transition-all flex flex-col justify-between " +
                (isBooked
                  ? "border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white hover:shadow-subtle")
              }
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{f.airline}</span>
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {f.flight_no}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                  <Plane className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{f.route}</span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Departure: <span className="font-semibold text-slate-700">{f.departure_date}</span> ({f.cabin})
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <Luggage className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{f.baggage}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {f.honeymoon_perks?.map((perk, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 mt-3">
                <div>
                  <div className="text-sm font-black text-slate-900">{f.price_formatted}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Includes 72h PNR Hold</div>
                </div>

                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => handlePayFlight(f)}
                  className="font-bold cursor-pointer"
                >
                  {isBooked ? 'Ticket Locked ✓' : 'Pay & Lock PNR'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
