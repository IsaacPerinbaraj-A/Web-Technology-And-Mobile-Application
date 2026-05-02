import React from 'react';

export default function LoadingSpinner({ message = 'Finding your spot...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🅿️</span>
        </div>
      </div>
      <p className="text-muted font-medium animate-pulse">{message}</p>
    </div>
  );
}
