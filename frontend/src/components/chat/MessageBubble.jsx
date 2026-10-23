import React from 'react';

export const MessageBubble = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      marginBottom: 14,
      flexDirection: isBot ? 'row' : 'row-reverse'
    }}>
      {/* Subtle Avatar */}
      <div style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isBot ? '#1c1f2e' : '#2563eb',
        border: '1px solid var(--border-medium)',
        color: '#fff',
        fontSize: '0.7rem',
        fontWeight: 600,
        flexShrink: 0
      }}>
        {isBot ? 'AI' : 'YOU'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '82%',
        padding: '10px 14px',
        borderRadius: 8,
        background: isBot ? 'var(--bg-surface-elevated)' : '#1e3a8a',
        border: isBot ? '1px solid var(--border-subtle)' : '1px solid rgba(59, 130, 246, 0.4)',
        color: '#f1f3f9',
        fontSize: '0.86rem',
        lineHeight: 1.55
      }}>
        {message.content}
      </div>
    </div>
  );
};
