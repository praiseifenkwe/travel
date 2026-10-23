import React from 'react';
import { User, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../shared/Badge';

export const ApplicationList = ({ applications = [], selectedId, onSelectApp }) => {
  return (
    <div className="glass-panel" style={{ padding: 18, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Active Relocation Queue</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{applications.length} Cases</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No applications registered yet. Initiate from Client Portal.
          </div>
        ) : (
          applications.map((app) => {
            const isSelected = app.id === selectedId;
            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.45)',
                  border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{app.client_name}</span>
                    <Badge status={app.stage} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {app.employer || 'Independent'} ? {app.destination}
                  </div>
                </div>

                <ChevronRight size={18} color={isSelected ? '#818cf8' : '#64748b'} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
