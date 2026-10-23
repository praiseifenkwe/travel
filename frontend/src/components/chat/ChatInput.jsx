import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

export const ChatInput = ({ onSendMessage, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSendMessage(text);
    setText('');
  };

  const samplePrompts = [
    "Relocating to London next month for Bloomberg. Skilled Worker pathway.",
    "Need to verify 28-day bank balance for UKVI maintenance threshold.",
    "Employer provided Certificate of Sponsorship with maintenance guarantee."
  ];

  return (
    <div>
      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSendMessage(p)}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '4px 10px',
              borderRadius: 4,
              color: 'var(--text-secondary)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.15s ease'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <input
          type="text"
          className="input-field"
          placeholder="Type your relocation route, employer details, or questions..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !text.trim()}
          style={{ padding: '0 14px' }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
