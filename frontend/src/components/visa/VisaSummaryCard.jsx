import React, { useState } from 'react';
import { Calendar, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../shared/Button';

export const VisaSummaryCard = ({ appData = {} }) => {
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [slotConfirmed, setSlotConfirmed] = useState(false);

  const biometricSlots = [
    { id: 'slot_1', date: 'Monday, Nov 2, 2026', time: '09:30 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_2', date: 'Tuesday, Nov 3, 2026', time: '11:00 AM', location: 'TLScontact Victoria Island, Lagos' },
    { id: 'slot_3', date: 'Thursday, Nov 5, 2026', time: '02:15 PM', location: 'TLScontact Abuja Central' }
  ];

  return (
    <div className="tf-card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>UKVI Application Form Summary</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pre-populated from OCR evidence and sponsor CoS</div>
        </div>
        <span className="badge badge-passed">Ready For Filing</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '0.78rem', marginBottom: 14 }}>
        <div style={{ background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Route Category:</span>
          <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>Skilled Worker (Tier 2 General)</div>
        </div>
        <div style={{ background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Sponsoring Body:</span>
          <div style={{ fontWeight: 600, color: '#fff', marginTop: 1 }}>{appData.employer || 'Bloomberg LP'}</div>
        </div>
        <div style={{ background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Immigration Health Surcharge (IHS):</span>
          <div style={{ fontWeight: 600, color: '#60a5fa', marginTop: 1 }}>?3,105 (3-Year NHS Surcharge)</div>
        </div>
        <div style={{ background: 'var(--bg-subtle)', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Maintenance Guarantee:</span>
          <div style={{ fontWeight: 600, color: '#10b981', marginTop: 1 }}>Section A2 Certified by Sponsor</div>
        </div>
      </div>

      {/* Biometrics */}
      <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>TLScontact Biometrics Appointment</span>
          <span style={{ fontSize: '0.72rem', color: slotConfirmed ? '#10b981' : 'var(--text-muted)' }}>
            {slotConfirmed ? '? Slot Reserved' : 'Select preferred date'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
          {biometricSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={slotConfirmed}
              onClick={() => setSelectedSlot(slot.id)}
              style={{
                padding: '8px',
                borderRadius: 4,
                border: selectedSlot === slot.id ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                background: selectedSlot === slot.id ? 'var(--bg-surface-elevated)' : 'transparent',
                color: '#fff',
                cursor: slotConfirmed ? 'default' : 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{slot.date}</div>
              <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{slot.time}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{slot.location}</div>
            </button>
          ))}
        </div>

        {!slotConfirmed ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" onClick={() => setSlotConfirmed(true)} icon={<CheckCircle2 size={13} />}>
              Reserve Slot
            </Button>
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
            ? Biometrics confirmation sent to client email. TLS Premium Lounge booked.
          </div>
        )}
      </div>
    </div>
  );
};
