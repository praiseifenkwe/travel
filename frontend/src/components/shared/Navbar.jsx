import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Shield, User, Sparkles, Layers, FileCheck } from 'lucide-react';
import { DossierModal } from './DossierModal';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <>
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 19, 0.88)',
        backdropFilter: 'blur(22px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
            }}>
              <Globe size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="text-gradient">TravelForge</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: 4, border: '1px solid rgba(99, 102, 241, 0.3)' }}>AI-OS</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Immigration & Relocation Infrastructure</div>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15, 23, 42, 0.65)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <Link
              to="/client"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: location.pathname === '/client' ? '#ffffff' : 'var(--text-secondary)',
                background: location.pathname === '/client' ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={16} />
              Client Portal
            </Link>

            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: location.pathname === '/dashboard' ? '#ffffff' : 'var(--text-secondary)',
                background: location.pathname === '/dashboard' ? 'linear-gradient(135deg, #059669 0%, #06b6d4 100%)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Shield size={16} />
              Agency Control
            </Link>

            <Link
              to="/demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                color: '#ffffff',
                background: location.pathname === '/demo' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                boxShadow: location.pathname === '/demo' ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={15} color="#fbbf24" />
              Dual View
            </Link>
          </nav>

          {/* Quick Actions & Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setDossierOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <FileCheck size={14} />
              Official UKVI Dossier
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.75rem',
              padding: '6px 12px',
              borderRadius: 999,
              background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: isConnected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)',
              color: isConnected ? '#34d399' : '#fb7185'
            }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#f43f5e',
                boxShadow: isConnected ? '0 0 8px #10b981' : 'none'
              }} />
              {isConnected ? 'Socket Sync' : 'Reconnecting...'}
            </div>
          </div>
        </div>
      </header>

      {/* Official Dossier Lightbox */}
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
