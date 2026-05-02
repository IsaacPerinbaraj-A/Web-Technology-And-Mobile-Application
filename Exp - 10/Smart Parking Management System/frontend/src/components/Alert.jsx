import React from 'react';

export default function Alert({ type = 'info', message, onClose, className = '' }) {
  const styles = {
    info: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
      accent: 'bg-blue-500'
    },
    success: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: '✅',
      accent: 'bg-emerald-500'
    },
    warning: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '⚠️',
      accent: 'bg-amber-500'
    },
    error: {
      bg: 'bg-red-50/50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '🚫',
      accent: 'bg-red-500'
    },
  }[type];

  return (
    <div className={`relative overflow-hidden glass rounded-2xl border-2 ${styles.border} p-5 animate-fade-in ${className}`} role="alert">
      <div className={`absolute top-0 left-0 w-1 h-full ${styles.accent}`} />
      <div className="flex items-center gap-4">
        <span className="text-2xl">{styles.icon}</span>
        <div className="flex-grow">
          <p className={`font-bold text-xs uppercase tracking-widest ${styles.text} mb-1`}>{type}</p>
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl hover:bg-black/5 transition-colors ${styles.text}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
