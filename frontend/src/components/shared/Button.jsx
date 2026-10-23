import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon = null, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-subtle hover:shadow focus:ring-2 focus:ring-brand-500/20',
    secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-subtle hover:border-slate-300',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-subtle hover:shadow',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-subtle hover:shadow',
    outline: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5'
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      className={baseStyles + ' ' + currentVariant + ' ' + currentSize + ' ' + className}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="inline-flex shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
