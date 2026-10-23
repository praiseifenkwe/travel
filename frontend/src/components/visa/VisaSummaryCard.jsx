import React, { useState } from 'react';
import { Calendar, CheckCircle2, Shield, Clock, MapPin, Building2, CreditCard } from 'lucide-react';
import { Button } from '../shared/Button';

export const VisaSummaryCard = ({ appData = {} }) => {
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [slotConfirmed, setSlotConfirmed] = useState(false);

  const biometricSlots = [
    { id: 'slot_1', date: 'Monday, Nov 2, 2026', time: '09:30 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_2', date: 'Tuesday, Nov 3, 2026', time: '11:00 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_3', date: 'Thursday, Nov 5, 2026', time: '02:15 PM', location: 'TLScontact Central, Abuja' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">UKVI Form Auto-Fill Preview</h3>
          <p className="text-xs text-slate-500">Synthesized from OCR evidence and sponsor CoS</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Ready For Filing
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px] font-medium">Route Category</span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">Skilled Worker (Tier 2)</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px] font-medium">Sponsoring Body</span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{appData.employer || 'Bloomberg LP'}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px] font-medium">IHS Surcharge (3-Year)</span>
          <div className="font-bold text-brand-700 text-sm mt-0.5">£3,105 (NHS Coverage)</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px] font-medium">Maintenance Guarantee</span>
          <div className="font-bold text-emerald-700 text-sm mt-0.5">Certified by Sponsor (CoS A2)</div>
        </div>
      </div>

      {/* TLScontact Biometrics Slot Picker */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-900">TLScontact Biometrics Appointment</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
            Priority Visa Fast-Track
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {biometricSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between "
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
          {slotConfirmed ? 'Biometrics Slot Reserved ✓' : 'Confirm TLScontact Appointment'}
        </Button>
      </div>
    </div>
  );
};
