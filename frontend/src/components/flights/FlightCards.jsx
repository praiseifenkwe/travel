import React from 'react';
import { Plane, Clock, Luggage, ArrowRight } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({ flights = [] }) => {
  if (!flights || flights.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plane size={18} color="#06b6d4" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Relocation Flight Logistics</h4>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Live GDS Partner Integration</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {flights.map((fl) => (
          <div
            key={fl.id}
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: 14,
              borderRadius: 10,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{fl.airline}</strong>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#818cf8' }}>{fl.flight_no}</span>
                <span className="badge badge-passed" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  {fl.stops === 0 ? 'Direct Non-Stop' : '1 Stop'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{fl.route}</span>
                <span>?</span>
                <Luggage size={14} color="#94a3b8" />
                <span>{fl.baggage}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                  ?{(fl.price_ngn).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Corporate Relocation Fare</div>
              </div>
              <Button variant="primary" size="sm">
                Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
