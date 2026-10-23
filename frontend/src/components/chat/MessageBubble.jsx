import React from 'react';
import { Bot, User } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      marginBottom: 16,
      flexDirection: isBot ? 'row' : 'row-reverse'
    }}>
      {/* Avatar */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isBot 
          ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' 
          : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        {isBot ? <Bot size={18} color="#fff" /> : <User size={18} color="#fff" />}
      </div>

      {/* Bubble Content */}
      <div style={{
        maxWidth: '80%',
        padding: '14px 18px',
        borderRadius: 14,
        background: isBot ? 'rgba(30, 41, 59, 0.7)' : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
        border: isBot ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(99, 102, 241, 0.4)',
        color: '#f8fafc',
        fontSize: '0.92rem',
        lineHeight: 1.6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        {message.content}
      </div>
    </div>
  );
};
