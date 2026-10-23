import React from 'react';
import { Briefcase, GraduationCap, Globe } from 'lucide-react';

export const JudgeScenarioBar = ({ onSelectScenario, currentScenario }) => {
  const scenarios = [
    { id: 'bloomberg', label: 'Tunde (Bloomberg UK)', sub: 'Skilled Worker', icon: <Briefcase size={12} color="#60a5fa" /> },
    { id: 'imperial', label: 'Amaka (Imperial London)', sub: 'Student Visa', icon: <GraduationCap size={12} color="#10b981" /> },
    { id: 'siemens', label: 'Chidi (Siemens Munich)', sub: 'Schengen Business', icon: <Globe size={12} color="#f59e0b" /> }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150,
      background: '#12141c',
      border: '1px solid var(--border-medium)',
      borderRadius: 999,
      padding: '6px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingRight: 6, borderRight: '1px solid var(--border-subtle)' }}>
        Presets
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.74rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: isActive ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.1s ease'
              }}
            >
              {sc.icon}
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
