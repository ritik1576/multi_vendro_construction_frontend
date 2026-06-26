import React from 'react';

export const StatusBadge = ({ isActive }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
      isActive 
        ? 'bg-green-50 text-[var(--color-success-main)]' 
        : 'bg-red-50 text-red-600'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};
