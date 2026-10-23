import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Shield, User, Sparkles } from 'lucide-react';

export const Navbar = ({ isConnected }) => {
  const location = useLocation();

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '16px 24px',
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
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15, 23, 42, 0.6)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
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
        </nav>

        {/* Live WebSocket Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            {isConnected ? 'Live Socket Sync' : 'Reconnecting...'}
          </div>
        </div>
      </div>
    </header>
  );
};
