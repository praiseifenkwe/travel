import React, { useState } from 'react';
import { FileText, CheckCircle, Shield, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
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
    <div className="glass-panel" style={{ padding: 22, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={20} color="#818cf8" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>UKVI Form Auto-Fill Preview</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Synthesized from GPT-4o OCR extraction and employer Certificate of Sponsorship
            </p>
          </div>
        </div>
        <span className="badge badge-passed">Ready For Submission</span>
      </div>

      {/* Structured Fields Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: '0.82rem', marginBottom: 18 }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Visa Category:</span>
          <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>Skilled Worker (Tier 2 General)</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Sponsoring Employer:</span>
          <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>{appData.employer || 'Bloomberg LP'}</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Immigration Health Surcharge (IHS):</span>
          <div style={{ fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>?3,105 (3-Year Full NHS Coverage)</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Maintenance Status:</span>
          <div style={{ fontWeight: 700, color: '#34d399', marginTop: 2 }}>Section A2 Certified by Sponsor</div>
        </div>
      </div>

      {/* Biometrics Scheduling Card */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        padding: 16,
        borderRadius: 12,
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>TLScontact Biometrics Appointment</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: slotConfirmed ? '#34d399' : 'var(--text-muted)' }}>
            {slotConfirmed ? '? Appointment Reserved' : 'Select preferred slot'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {biometricSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={slotConfirmed}
              onClick={() => setSelectedSlot(slot.id)}
              style={{
                padding: '10px',
                borderRadius: 8,
                border: selectedSlot === slot.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: selectedSlot === slot.id ? 'rgba(6, 182, 212, 0.16)' : 'rgba(15, 23, 42, 0.45)',
                color: '#fff',
                cursor: slotConfirmed ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{slot.date}</div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: 2 }}>{slot.time}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{slot.location}</div>
            </button>
          ))}
        </div>

        {!slotConfirmed ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSlotConfirmed(true)}
              icon={<CheckCircle size={14} />}
            >
              Reserve Biometrics Slot
            </Button>
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>? Confirmation sent to your email. TLS Premium Lounge booked.</span>
          </div>
        )}
      </div>
    </div>
  );
};
