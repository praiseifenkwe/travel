import React, { useState } from 'react';
import { Plane, Clock, Luggage, ArrowRight, Check, Building2, CreditCard, X, ShieldCheck } from 'lucide-react';
import { Button } from '../shared/Button';

export const FlightCards = ({ flights = [] }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlight, setBookedFlight] = useState(null);
  const [billingType, setBillingType] = useState('corporate'); // 'corporate' | 'card'

  if (!flights || flights.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: 22, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plane size={20} color="#06b6d4" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Relocation Flight Logistics</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Direct GDS integration with corporate allowance & relocation baggage
            </p>
          </div>
        </div>
        <span className="badge badge-passed">GDS Sync Active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flights.map((fl) => {
          const isSelected = selectedFlight?.id === fl.id;
          const isBooked = bookedFlight?.id === fl.id;

          return (
            <div
              key={fl.id}
              style={{
                background: isBooked ? 'rgba(16, 185, 129, 0.12)' : isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                padding: 16,
                borderRadius: 12,
                border: isBooked ? '1px solid rgba(16, 185, 129, 0.4)' : isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <strong style={{ fontSize: '0.98rem', color: '#fff' }}>{fl.airline}</strong>
                  <span className="mono" style={{ fontSize: '0.78rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 8px', borderRadius: 6 }}>
                    {fl.flight_no}
                  </span>
                  <span className="badge badge-passed" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {fl.stops === 0 ? 'Direct Non-Stop' : '1 Stop'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{fl.route}</span>
                  <span>?</span>
                  <span>{fl.cabin}</span>
                  <span>?</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Luggage size={14} color="#94a3b8" />
                    <span>{fl.baggage}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                    ?{(fl.price_ngn).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Corporate Fare Rate</div>
                </div>
                <Button
                  variant={isBooked ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedFlight(fl)}
                >
                  {isBooked ? '? Reserved' : 'Select Flight'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flight Reservation Modal */}
      {selectedFlight && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: 20
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 580, padding: 26, position: 'relative' }}>
            <button
              onClick={() => setSelectedFlight(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Plane size={22} color="#06b6d4" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Relocation Flight</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Corporate travel reservation linked directly to your UK Skilled Worker CoS sponsorship.
            </p>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flight:</span>
                <span style={{ fontWeight: 700 }}>{selectedFlight.airline} ({selectedFlight.flight_no})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Route:</span>
                <span style={{ fontWeight: 700 }}>{selectedFlight.route}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Relocation Baggage:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>{selectedFlight.baggage}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Fare:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  ?{selectedFlight.price_ngn.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Billing Method Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Payment / Billing Channel
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setBillingType('corporate')}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    border: billingType === 'corporate' ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                    background: billingType === 'corporate' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem' }}>
                    <Building2 size={16} color="#818cf8" />
                    Corporate Direct Bill
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Billed to Bloomberg LP CoS
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingType('card')}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    border: billingType === 'card' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    background: billingType === 'card' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem' }}>
                    <CreditCard size={16} color="#06b6d4" />
                    Paystack / Flutterwave
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Nigerian Debit Card (NGN)
                  </div>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="secondary" size="sm" onClick={() => setSelectedFlight(null)}>
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setBookedFlight(selectedFlight);
                  setSelectedFlight(null);
                }}
                icon={<ShieldCheck size={16} />}
              >
                Confirm & Issue Ticket Hold
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
