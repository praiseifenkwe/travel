import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChecklistCard } from './ChecklistCard';
import { ChatInput } from './ChatInput';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const ChatContainer = ({ 
  messages = [], 
  checklist = [], 
  onSendMessage, 
  loading, 
  onSelectDocType 
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 20 }}>
      {/* Messages Stream */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {checklist.length > 0 && (
          <ChecklistCard items={checklist} onSelectDocType={onSelectDocType} />
        )}

        {loading && (
          <div style={{ padding: '12px 16px', marginBottom: 16 }}>
            <LoadingSpinner size={18} label="AI Slot-Filling Engine reasoning..." />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} loading={loading} />
    </div>
  );
};
