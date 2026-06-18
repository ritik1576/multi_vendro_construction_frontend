import React from 'react';
import { Tag } from 'lucide-react';

export const CouponBadge = ({ code, discountText, className = "" }) => {
  if (!code && !discountText) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wide ${className}`}>
      <Tag className="h-3 w-3" />
      {discountText || `CODE: ${code}`}
    </span>
  );
};
