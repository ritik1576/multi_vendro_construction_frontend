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

  const address = profileData?.address || profileData?.deliveryAddress || profileData?.shippingAddress;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <MapPin className="w-5 h-5 text-slate-400" />
        <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          Address Information
        </h2>
      </div>
      {address ? (
        <div className="grid grid-cols-1 gap-y-4">
          <div>
            <p className="text-[14px] font-bold text-[#0F172A]">{formatFallback(address.addressLine || address.line1)}</p>
            <p className="text-[13px] text-slate-500 mt-1">
              {formatFallback(address.city)}, {formatFallback(address.state)} {formatFallback(address.pincode)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[14px] font-medium text-slate-500">Not provided</p>
      )}
    </div>
  );
};

export default AddressInfoCard;
