import React from 'react';
import { Sparkles, Play, Briefcase, GraduationCap, Globe } from 'lucide-react';

export const JudgeScenarioBar = ({ onSelectScenario, currentScenario }) => {
  const scenarios = [
    {
      id: 'bloomberg',
      label: '1. Tunde (Bloomberg UK)',
      sub: 'Skilled Worker ? CoS Guarantee',
      icon: <Briefcase size={14} color="#818cf8" />
    },
    {
      id: 'imperial',
      label: '2. Amaka (Imperial London)',
      sub: 'Student Visa ? ?1,270 Deficit Check',
      icon: <GraduationCap size={14} color="#06b6d4" />
    },
    {
      id: 'siemens',
      label: '3. Chidi (Siemens Munich)',
      sub: 'Schengen Business ? Instant Fast Track',
      icon: <Globe size={14} color="#10b981" />
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150,
      background: 'rgba(10, 15, 29, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      borderRadius: 999,
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.25)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', paddingRight: 6, borderRight: '1px solid var(--border-subtle)' }}>
        <Sparkles size={14} />
        JUDGE PRESETS
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {scenarios.map((sc) => {
          const isActive = currentScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                background: isActive ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              {sc.icon}
              <div style={{ textAlign: 'left' }}>
                <div>{sc.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
