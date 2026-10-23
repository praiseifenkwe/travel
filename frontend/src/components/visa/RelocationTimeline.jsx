import React from 'react';
import { Calendar, Plane, Home, ShieldCheck, CheckCircle2, Building, Sparkles } from 'lucide-react';

export const RelocationTimeline = () => {
  const events = [
    {
      day: 'Day 1',
      title: 'Automated AI Intake & Document Audit',
      subtitle: 'TravelForge NLU slot-filling & OCR extracts passport, CoS, and financial statements.',
      status: 'completed',
      date: 'Oct 23, 2026'
    },
    {
      day: 'Day 3',
      title: 'Human-in-the-Loop Clearance & UKVI Filing',
      subtitle: 'Licensed consultant overrides maintenance check via CoS Section A2 guarantee.',
      status: 'completed',
      date: 'Oct 25, 2026'
    },
    {
      day: 'Day 7',
      title: 'TLScontact Biometrics Appointment',
      subtitle: 'Premium lounge biometric enrollment at TLScontact Victoria Island, Lagos.',
      status: 'current',
      date: 'Nov 2, 2026'
    },
    {
      day: 'Day 16',
      title: 'UKVI Visa Decision & Vignette Collection',
      subtitle: '3-Year Skilled Worker visa sticker issued in passport and couriered via DHL.',
      status: 'upcoming',
      date: 'Nov 11, 2026'
    },
    {
      day: 'Day 21',
      title: 'Flight BA76 Departure (LOS ? LHR)',
      subtitle: 'British Airways direct flight from Lagos Murtala Muhammed to London Heathrow.',
      status: 'upcoming',
      date: 'Nov 15, 2026'
    },
    {
      day: 'Day 22',
      title: 'Canary Wharf Corporate Accommodation',
      subtitle: 'Check-in to 2-week Bloomberg sponsored serviced apartment in Canary Wharf.',
      status: 'upcoming',
      date: 'Nov 16, 2026'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: 22, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={18} color="#fff" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>30-Day Relocation Journey Roadmap</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Orchestrated timeline from Lagos intake to London Canary Wharf move-in
            </p>
          </div>
        </div>
        <span className="badge badge-passed">On Track</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', paddingLeft: 12 }}>
        {/* Vertical Guide Line */}
        <div style={{
          position: 'absolute',
          left: 20,
          top: 10,
          bottom: 10,
          width: 2,
          background: 'rgba(255, 255, 255, 0.08)'
        }} />

        {events.map((ev, i) => {
          const isDone = ev.status === 'completed';
          const isCurrent = ev.status === 'current';

          return (
            <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: isDone ? '#10b981' : isCurrent ? '#06b6d4' : '#1e293b',
                border: isCurrent ? '3px solid rgba(6, 182, 212, 0.4)' : '2px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
                boxShadow: isCurrent ? '0 0 10px #06b6d4' : 'none'
              }} />

              <div style={{
                flex: 1,
                background: isCurrent ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.45)',
                border: isCurrent ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid var(--border-subtle)',
                padding: '12px 16px',
                borderRadius: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontSize: '0.72rem', color: isCurrent ? '#38bdf8' : isDone ? '#34d399' : 'var(--text-muted)', fontWeight: 700 }}>
                      {ev.day}
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{ev.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ev.date}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {ev.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
