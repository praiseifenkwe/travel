import React from 'react';

export const LoadingSpinner = ({ size = 20, label = 'Loading...' }) => {
  return (
    <div className="inline-flex items-center gap-2.5 text-xs text-slate-500 font-medium">
      <div
        className="border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin shrink-0"
        style={{ width: size, height: size }}
      />
      {label && <span>{label}</span>}
    </div>
  );
};
