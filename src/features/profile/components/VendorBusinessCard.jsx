import React from 'react';
import { Store } from 'lucide-react';
import { formatFallback } from '../utils/profileFormatters';

const VendorBusinessCard = ({ vendorData, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Store className="w-5 h-5 text-slate-400" />
        <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          Vendor Business Information
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Name</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(vendorData?.shopName)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shop Slug</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(vendorData?.shopSlug)}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
          <p className="text-[14px] font-bold text-[#0F172A] leading-relaxed">{formatFallback(vendorData?.description)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor Status</p>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
            vendorData?.status?.toLowerCase() === 'approved' || vendorData?.status?.toLowerCase() === 'active'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {formatFallback(vendorData?.status)}
          </span>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">KYC Status</p>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
            vendorData?.kycStatus?.toLowerCase() === 'verified'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {formatFallback(vendorData?.kycStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendorBusinessCard;
