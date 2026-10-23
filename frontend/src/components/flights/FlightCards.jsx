import React, { useState } from 'react';
import { Plane, Luggage, X, Building2, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({ flights = [] }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlight, setBookedFlight] = useState(null);
  const [billingType, setBillingType] = useState('corporate');

  if (!flights || flights.length === 0) return null;

  return (
    <div className="tf-card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>Corporate Relocation Flights</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct GDS inventory with corporate baggage allowance</div>
        </div>
        <span className="badge badge-passed">GDS Sync</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {flights.map((fl) => {
          const isBooked = bookedFlight?.id === fl.id;

          return (
            <div
              key={fl.id}
              style={{
                background: isBooked ? 'var(--success-subtle)' : 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: 6,
                border: isBooked ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{fl.airline}</span>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fl.flight_no}</span>
                  <span className="badge badge-pending" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {fl.stops === 0 ? 'Non-Stop' : '1 Stop'}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{fl.route}</span>
                  <span>?</span>
                  <span>{fl.cabin}</span>
                  <span>?</span>
                  <span>{fl.baggage}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    ?{(fl.price_ngn).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Corporate Relocation Rate</div>
                </div>
                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedFlight(fl)}
                >
                  {isBooked ? '? Reserved' : 'Book Flight'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation Modal */}
      {selectedFlight && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 20
        }}>
          <div className="tf-card" style={{ width: '100%', maxWidth: 500, padding: 22, position: 'relative', background: '#0e1017' }}>
            <button
              onClick={() => setSelectedFlight(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#8e94a4', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 2 }}>Confirm Relocation Flight Hold</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              Reservation tied to UK Skilled Worker Certificate of Sponsorship
            </p>

            <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 6, marginBottom: 14, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Flight:</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{selectedFlight.airline} ({selectedFlight.flight_no})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Route:</span>
                <span style={{ color: '#fff' }}>{selectedFlight.route}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 500 }}>Total Fare:</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>?{selectedFlight.price_ngn.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Billing Channel
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setBillingType('corporate')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: billingType === 'corporate' ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                    background: billingType === 'corporate' ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Corporate Billing</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Bloomberg LP CoS</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingType('card')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: billingType === 'card' ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                    background: billingType === 'card' ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Nigerian Debit Card</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Paystack / NGN</div>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => setSelectedFlight(null)}>
                Cancel
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  setBookedFlight(selectedFlight);
                  setSelectedFlight(null);
                }}
              >
                Confirm Ticket Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
