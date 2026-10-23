import React, { useState } from 'react';
import { ClientPortal } from './ClientPortal';
import { StaffDashboard } from './StaffDashboard';
import { JudgeScenarioBar } from '../components/shared/JudgeScenarioBar';
import { SplitSquareVertical } from 'lucide-react';

export const LiveDemoSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState('bloomberg');

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 80px)' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SplitSquareVertical size={14} color="#60a5fa" />
          <span style={{ fontWeight: 600, color: '#f1f3f9' }}>Synchronized Dual-Screen View:</span>
          <span style={{ color: 'var(--text-secondary)' }}>Applicant Intake (Left) ? Consular Review (Right)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.74rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          Bidirectional Session Synced
        </div>
      </div>

      {/* 2-Column Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        padding: 16,
        height: 'calc(100vh - 120px)',
        overflow: 'hidden'
      }}>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, overflowY: 'auto', background: '#0a0b10' }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
            Applicant View (/client)
          </div>
          <ClientPortal />
        </div>

        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, overflowY: 'auto', background: '#0a0b10' }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
            Consular Console (/dashboard)
          </div>
          <StaffDashboard />
        </div>
      </div>

      <JudgeScenarioBar
        currentScenario={currentScenario}
        onSelectScenario={(sc) => setCurrentScenario(sc)}
      />
    </div>
  );
};
