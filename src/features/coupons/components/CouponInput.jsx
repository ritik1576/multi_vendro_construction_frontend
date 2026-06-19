import React from 'react';
import { Tag, X, Loader2 } from 'lucide-react';

export const CouponInput = ({ 
  couponCode, 
  setCouponCode, 
  appliedCoupon, 
  couponError, 
  isApplying, 
  onApply, 
  onRemove,
  isLoggedIn,
  onLoginClick
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
        <Tag className="h-4 w-4" /> Apply Coupons
      </h3>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-emerald-800">{appliedCoupon.code}</p>
            <p className="text-xs text-emerald-600 mt-0.5">{appliedCoupon.message}</p>
          </div>
          <button 
            onClick={onRemove}
            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
            title="Remove coupon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={isApplying}
              className={`w-full rounded-l-md border ${couponError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]'} px-3 py-2 text-sm text-slate-700 outline-none focus:ring-1`}
            />
            <button 
              onClick={onApply}
              disabled={isApplying || !couponCode.trim()}
              className="rounded-r-md bg-blue-50 px-4 py-2 text-xs font-extrabold text-[#1E3A8A] transition hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex justify-center items-center"
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'APPLY'}
            </button>
          </div>
          
          {couponError && (
            <p className="mt-2 text-xs text-red-500 font-medium">{couponError}</p>
          )}

          {!isLoggedIn && (
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              <span 
                className="text-[#1E3A8A] cursor-pointer hover:underline"
                onClick={onLoginClick}
              >
                Login
              </span> to see available offers
            </p>
          )}
        </>
      )}
    </div>
  );
};
