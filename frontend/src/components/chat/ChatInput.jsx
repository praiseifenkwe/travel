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
    "What documents do I need for a 2-week tourist visa to the UK?",
    "Do I need a transit visa if connecting through Doha?",
    "How much bank balance is recommended for a London vacation?",
    "Can I carry 2 x 23kg bags on British Airways?"
  ];

  return (
    <div className="space-y-3">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-600" />
          Common Travel Questions:
        </span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSendMessage(p)}
            className="text-left px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-subtle transition-all shrink-0 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything about visas, flights, hotels, or travel requirements..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 shadow-subtle text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-subtle transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
