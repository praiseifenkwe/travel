import React from 'react';
import { Bot, User } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className="lex gap-3 max-w-3xl ">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-subtle ">
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className="
ounded-2xl px-4 py-3 text-sm leading-relaxed ">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
