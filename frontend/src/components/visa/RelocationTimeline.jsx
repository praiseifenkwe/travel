import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const RelocationTimeline = () => {
  const events = [
    { day: 'Day 1', title: 'Automated Intake & Evidence Audit', desc: 'NLU slot-filling & OCR extracts passport, CoS, and 28-day bank balance.', status: 'completed', date: 'Oct 23, 2026' },
    { day: 'Day 3', title: 'Consular Review & CoS Clearance', desc: 'Licensed consultant reconciles maintenance under CoS Section A2 guarantee.', status: 'completed', date: 'Oct 25, 2026' },
    { day: 'Day 7', title: 'TLScontact Biometrics Enrollment', desc: 'Biometric enrollment at TLScontact Victoria Island, Lagos.', status: 'current', date: 'Nov 2, 2026' },
    { day: 'Day 16', title: 'UKVI Visa Vignette Issuance', desc: '3-Year Skilled Worker vignette affixed to passport and dispatched via courier.', status: 'upcoming', date: 'Nov 11, 2026' },
    { day: 'Day 21', title: 'Relocation Flight (LOS ? LHR)', desc: 'British Airways direct flight from Lagos Murtala Muhammed to London Heathrow.', status: 'upcoming', date: 'Nov 15, 2026' },
    { day: 'Day 22', title: 'Canary Wharf Move-In', desc: 'Check-in to 2-week Bloomberg sponsored corporate apartment in Canary Wharf.', status: 'upcoming', date: 'Nov 16, 2026' }
  ];

  return (
    <div className="tf-card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>Relocation Milestone Schedule</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated journey from Lagos intake to London move-in</div>
        </div>
        <span className="badge badge-passed">On Track</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', paddingLeft: 8 }}>
        <div style={{ position: 'absolute', left: 14, top: 8, bottom: 8, width: 1, background: 'var(--border-medium)' }} />

        {events.map((ev, i) => {
          const isDone = ev.status === 'completed';
          const isCurrent = ev.status === 'current';

          return (
            <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: isDone ? '#10b981' : isCurrent ? '#3b82f6' : '#232533',
                border: isCurrent ? '2px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-medium)',
                flexShrink: 0,
                marginTop: 3
              }} />

              <div style={{
                flex: 1,
                background: isCurrent ? 'var(--bg-surface-elevated)' : 'var(--bg-subtle)',
                border: isCurrent ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                padding: '8px 12px',
                borderRadius: 6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: isCurrent ? '#60a5fa' : isDone ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                      {ev.day}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{ev.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ev.date}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {ev.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
