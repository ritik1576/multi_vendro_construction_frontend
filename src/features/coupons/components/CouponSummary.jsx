import React from 'react';
import { formatCurrency } from '../../../context/cartUtils';

export const CouponSummary = ({ discountAmount, code }) => {
  if (!discountAmount || discountAmount <= 0) return null;

  return (
    <div className="flex justify-between gap-4 py-2 border-b border-emerald-100 bg-emerald-50/50 px-3 -mx-3">
      <span className="font-medium text-emerald-700 flex flex-col">
        <span>Coupon Discount</span>
        <span className="text-[10px] uppercase font-bold text-emerald-600/80">Code: {code}</span>
      </span>
      <span className="font-extrabold text-emerald-700">- {formatCurrency(discountAmount)}</span>
    </div>
  );
};
