import React from 'react';

export const Badge = ({ status, label, className = '' }) => {
  const getStyle = () => {
    switch (status ? status.toLowerCase() : '') {
      case 'passed':
      case 'verified':
      case 'active':
      case 'cleared':
      case 'success':
        return {
          container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-500'
        };
      case 'flagged':
      case 'warning':
      case 'document_audit':
        return {
          container: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500'
        };
      case 'failed':
      case 'critical':
      case 'danger':
      case 'error':
        return {
          container: 'bg-rose-50 text-rose-800 border-rose-200/80',
          dot: 'bg-rose-500'
        };
      case 'processing':
      case 'intake':
      case 'info':
        return {
          container: 'bg-brand-50 text-brand-800 border-brand-200/80',
          dot: 'bg-brand-500 animate-pulse'
        };
      default:
        return {
          container: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getStyle();

  return (
    <span className={'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ' + style.container + ' ' + className}>
      <span className={'w-1.5 h-1.5 rounded-full ' + style.dot} />
      <span>{label || status || 'Pending'}</span>
    </span>
  );
};
