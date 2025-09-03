import React from 'react';

interface QuickLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function QuickLogo({ size = 'md', className = '' }: QuickLogoProps) {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-white rounded-2xl p-2 shadow-lg">
        <img 
          src="/static/quick-logo.jpg" 
          alt="Quick" 
          className={`${sizeClasses[size]} w-auto`}
        />
      </div>
      <div className="text-white font-black text-2xl tracking-tight">
        Quick
      </div>
    </div>
  );
}