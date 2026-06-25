import React from 'react';
import { MapPin } from 'lucide-react';
import ProfileCard from './ui/ProfileCard';
import SectionHeader from './ui/SectionHeader';
import ProfileField from './ui/ProfileField';

const AddressInfoCard = ({ profileData, loading }) => {
  if (loading) {
    return (
      <ProfileCard className="animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="h-24 bg-slate-100 rounded"></div>
      </ProfileCard>
    );
  }

  const address = profileData?.defaultAddress || profileData?.address || profileData?.deliveryAddress || profileData?.shippingAddress;

  return (
    <ProfileCard>
      <SectionHeader icon={MapPin} title="Default Delivery Address" />
      
      {address ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
          <ProfileField label="Address Line 1" value={address.addressLine1 || address.addressLine || address.line1} />
          <ProfileField label="Address Line 2" value={address.addressLine2 || address.line2} />
          
          <ProfileField label="City" value={address.city} />
          <ProfileField label="State" value={address.state} />
          
          <ProfileField label="Country" value={address.country} />
          <ProfileField label="Postal Code" value={address.postalCode || address.pincode} />
          
          <ProfileField label="Address Type">
            {address.addressType ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-700 capitalize border border-slate-200">
                {address.addressType}
              </span>
            ) : (
              <span className="text-[14px] font-extrabold text-[#0F172A]">Not provided</span>
            )}
          </ProfileField>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
          <MapPin className="w-8 h-8 text-slate-300 mb-3" />
          <p className="text-[14px] font-bold text-slate-500">No default address available</p>
        </div>
      )}
    </ProfileCard>
  );
};

export default AddressInfoCard;
