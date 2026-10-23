import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export const ChatInput = ({ onSendMessage, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSendMessage(text);
    setText('');
  };

  const samplePrompts = [
    "Relocating to London next month for Bloomberg. Need Skilled Worker visa & flight.",
    "I have an offer with Amazon UK. CoS is ready, checking maintenance funds.",
    "Need to verify my passport and bank statement for UK visa."
  ];

  return (
    <div>
      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(p)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: 999,
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-indigo)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Sparkles size={12} color="#818cf8" />
            {p.slice(0, 48)}...
          </button>
        ))}
      </div>

      {/* Main Input Field */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <input
          type="text"
          className="input-field"
          placeholder="Type your relocation plan, employer, or travel queries in natural English..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !text.trim()}
          style={{ padding: '0 20px' }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
