import React from 'react';
import { Edit2, Trash2, Tag, Calendar, Percent, IndianRupee } from 'lucide-react';
import { formatCouponDate, getCouponStatus, formatDiscount } from '../utils/couponHelpers';

export const CouponTable = ({ coupons, isReadOnly, onEdit, onDelete, onToggleStatus }) => {
  if (!coupons || coupons.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Tag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-extrabold text-[#0F172A]">No Coupons Found</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          {isReadOnly ? "There are currently no active platform coupons." : "You haven't created any coupons yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Coupon Code</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Validity</th>
              <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Usage</th>
              {!isReadOnly && <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Status</th>}
              {!isReadOnly && <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id || coupon._id} className="group hover:bg-slate-50 transition-colors">
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#0F172A] uppercase tracking-wide">{coupon.code}</span>
                  </div>
                  {coupon.minimumOrderAmount > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Min Order: ₹{coupon.minimumOrderAmount}</p>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    {formatDiscount(coupon)}
                  </div>
                  {coupon.discountType === 'percentage' && coupon.maxDiscount > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Up to ₹{coupon.maxDiscount}</p>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatCouponDate(coupon.startDate)} - {coupon.endDate ? formatCouponDate(coupon.endDate) : 'Forever'}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-[#1E3A8A]">
                    {coupon.usedCount || 0}
                  </span>
                  <span className="text-sm text-slate-400 mx-1">/</span>
                  <span className="text-sm text-slate-600">
                    {coupon.usageLimit || '∞'}
                  </span>
                </td>

                {!isReadOnly && (
                  <td className="px-6 py-4 text-center">
                    {(() => {
                      const status = getCouponStatus(coupon);
                      let bgClass = 'bg-slate-100 text-slate-600';
                      
                      if (status === 'ACTIVE') bgClass = 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
                      else if (status === 'INACTIVE') bgClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                      else if (status === 'EXPIRED') bgClass = 'bg-red-100 text-red-700';
                      else if (status === 'UPCOMING') bgClass = 'bg-blue-100 text-blue-700';
                      else if (status === 'USED UP') bgClass = 'bg-orange-100 text-orange-700';

                      return (
                        <button 
                          onClick={() => onToggleStatus(coupon.id || coupon._id, !coupon.isActive)}
                          className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider transition-colors ${bgClass}`}
                        >
                          {status}
                        </button>
                      );
                    })()}
                  </td>
                )}

                {!isReadOnly && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(coupon)}
                        className="p-1.5 text-slate-500 hover:bg-blue-50 hover:text-[#1E3A8A] rounded transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(coupon.id || coupon._id)}
                        className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
