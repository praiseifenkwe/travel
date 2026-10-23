import React, { useState } from 'react';
import { ClientPortal } from './ClientPortal';
import { StaffDashboard } from './StaffDashboard';
import { JudgeScenarioBar } from '../components/shared/JudgeScenarioBar';
import { Monitor, Smartphone, Zap, Sparkles } from 'lucide-react';

export const LiveDemoSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState('bloomberg');

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 80px)' }}>
      {/* Top Banner explaining the dual screen */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={16} color="#38bdf8" />
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>
            Simultaneous Dual-Screen Mode:
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Client Portal (Left) ? Agency Control Tower (Right). Upload on the left, watch live compliance audit light up on the right.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontWeight: 600 }}>
          <span className="pulse-dot" />
          Sub-50ms Synchronized Session
        </div>
      </div>

      {/* Split Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        padding: 20,
        height: 'calc(100vh - 130px)',
        overflow: 'hidden'
      }}>
        {/* Left Side: Client Portal Container */}
        <div style={{
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 16,
          padding: 16,
          overflowY: 'auto',
          background: 'rgba(7, 10, 19, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Client Relocation View (/client)</h3>
          </div>
          <ClientPortal />
        </div>

        {/* Right Side: Agency Staff Dashboard Container */}
        <div style={{
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 16,
          padding: 16,
          overflowY: 'auto',
          background: 'rgba(7, 10, 19, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Agency Control Tower (/dashboard)</h3>
          </div>
          <StaffDashboard />
        </div>
      </div>

      {/* Judge Scenario Switcher floating bar */}
      <JudgeScenarioBar
        currentScenario={currentScenario}
        onSelectScenario={(sc) => setCurrentScenario(sc)}
      />
    </div>
  );
};
