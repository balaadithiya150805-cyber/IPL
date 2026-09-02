import React from 'react';

export default function TeamBadge({ name, shortCode, color, logoBadge, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl'
  };

  const badgeColor = color || '#F59E0B';

  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-xl font-bold shadow-lg transition-transform hover:scale-105 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      style={{
        backgroundColor: `${badgeColor}25`,
        borderColor: badgeColor,
        borderWidth: '2px',
        boxShadow: `0 0 12px ${badgeColor}30`
      }}
      title={name || shortCode}
    >
      <span className="select-none">{logoBadge || shortCode?.substring(0, 2) || '🏏'}</span>
    </div>
  );
}
