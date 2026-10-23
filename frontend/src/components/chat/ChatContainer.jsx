import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChecklistCard } from './ChecklistCard';
import { ChatInput } from './ChatInput';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Bot, Sparkles } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-subtle">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Intake Specialist Assistant</div>
            <div className="text-[11px] text-slate-500">Conversational Slot-Filling & UKVI Guidance</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Deterministic Slot Engine
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {checklist.length > 0 && (
          <ChecklistCard items={checklist} onSelectDocType={onSelectDocType} />
        )}

        {loading && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-block">
            <LoadingSpinner size={16} label="AI Slot-Filling Engine reasoning..." />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Zone */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <ChatInput onSendMessage={onSendMessage} loading={loading} />
      </div>
    </div>
  );
};
