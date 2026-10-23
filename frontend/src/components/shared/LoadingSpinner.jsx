import React from 'react';

export const LoadingSpinner = ({ size = 24, label = 'Loading...' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div 
        style={{
          width: size,
          height: size,
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#06b6d4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {label && <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{label}</span>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
