import React from 'react';
import { MapPin } from 'lucide-react';
import { formatFallback } from '../utils/profileFormatters';

const AddressInfoCard = ({ profileData, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
        <div className="h-20 bg-slate-100 rounded"></div>
      </div>
    );
  }

  const address = profileData?.defaultAddress || profileData?.address || profileData?.deliveryAddress || profileData?.shippingAddress;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <MapPin className="w-5 h-5 text-slate-400" />
        <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          Address Information
        </h2>
      </div>
      {address ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address Line 1</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.addressLine1 || address.addressLine || address.line1)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address Line 2</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.addressLine2 || address.line2)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.city)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">State</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.state)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.country)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Postal Code</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(address.postalCode || address.pincode)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address Type</p>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[12px] font-bold text-slate-700 capitalize">
              {formatFallback(address.addressType)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[14px] font-medium text-slate-500">Not provided</p>
      )}
    </div>
  );
};

export default AddressInfoCard;
