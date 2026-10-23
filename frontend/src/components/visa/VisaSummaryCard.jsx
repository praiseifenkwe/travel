import React, { useState } from 'react';
import { Calendar, CheckCircle2, Shield, Clock, MapPin, Building2, CreditCard, Info } from 'lucide-react';
import { Button } from '../shared/Button';

export const VisaSummaryCard = ({ appData = {} }) => {
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [slotConfirmed, setSlotConfirmed] = useState(false);

  const biometricSlots = [
    { id: 'slot_1', date: 'Monday, Nov 2, 2026', time: '09:30 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_2', date: 'Tuesday, Nov 3, 2026', time: '11:00 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_3', date: 'Thursday, Nov 5, 2026', time: '02:15 PM', location: 'TLScontact Central, Abuja' }
  ];

  const destination = appData.destination || 'London, United Kingdom';
  const visaType = appData.visa_type || 'Standard Visitor Visa';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Visa & Entry Requirements</h3>
          <p className="text-xs text-slate-500">Official consular guidelines for {destination}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Requirements Clear
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-5">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Visa Category</span>
          <div className="font-bold text-slate-900 text-sm mt-1">{visaType}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Permitted Stay</span>
          <div className="font-bold text-slate-900 text-sm mt-1">Up to 180 Days (Tourism/Visits)</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Official Visa Fee</span>
          <div className="font-bold text-brand-700 text-sm mt-1">£115 (~₦230,000)</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Processing Window</span>
          <div className="font-bold text-emerald-700 text-sm mt-1">10-15 Business Days</div>
        </div>
      </div>

      {/* Biometrics / Submission Slot Appointment */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-900">Visa Biometrics / Document Drop-off</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
            TLScontact Center
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {biometricSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={
                  'p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ' +
                  (isSelected
                    ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white')
                }
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{slot.date} • {slot.time}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {slot.location}
                  </div>
                </div>
                <input
                  type="radio"
                  name="biometric_slot"
                  checked={isSelected}
                  onChange={() => setSelectedSlot(slot.id)}
                  className="text-brand-600 focus:ring-brand-500"
                />
              </div>
            );
          })}
        </div>

        <Button
          variant={slotConfirmed ? 'success' : 'primary'}
          size="sm"
          className="w-full"
          onClick={() => setSlotConfirmed(true)}
        >
          {slotConfirmed ? 'Appointment Reserved ✓' : 'Select Visa Submission Date'}
        </Button>
      </div>
    </div>
  );
};
