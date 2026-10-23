import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, SplitSquareVertical, FileCheck2, ArrowUpRight } from 'lucide-react';
import { DossierModal } from './DossierModal';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const [dossierOpen, setDossierOpen] = useState(false);

  const navLinks = [
    { path: '/client', label: 'Client Intake', icon: <User size={14} /> },
    { path: '/dashboard', label: 'Agency Console', icon: <Shield size={14} /> },
    { path: '/demo', label: 'Split View', icon: <SplitSquareVertical size={14} /> }
  ];

  return (
    <>
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: '#0a0b10',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: '#1d2232',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                TF
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em' }}>
                  TravelForge
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  borderRadius: 4,
                  border: '1px solid var(--border-subtle)'
                }}>
                  v1.0
                </span>
              </div>
            </Link>

            {/* Navigation Segmented Control */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                      border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setDossierOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <FileCheck2 size={13} color="#10b981" />
              UKVI Dossier
            </button>

            {/* Socket Status Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.74rem',
              color: isConnected ? '#34d399' : 'var(--text-muted)',
              padding: '4px 8px',
              borderRadius: 4,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#64748b'
              }} />
              {isConnected ? 'Sync Active' : 'Offline Mode'}
            </div>
          </div>
        </div>
      </header>

      <DossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        appData={{
          client_name: 'Tunde Babatunde Adeyemi',
          employer: 'Bloomberg LP (London Office)',
          visa_type: 'UK Skilled Worker'
        }}
      />
    </>
  );
};
