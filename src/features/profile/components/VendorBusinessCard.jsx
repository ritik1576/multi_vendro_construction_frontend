import React from 'react';
import { Store } from 'lucide-react';
import ProfileCard from './ui/ProfileCard';
import SectionHeader from './ui/SectionHeader';
import ProfileField from './ui/ProfileField';
import StatusBadge from './ui/StatusBadge';

const VendorBusinessCard = ({ vendorData, loading }) => {
  if (loading) {
    return (
      <ProfileCard className="animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <SectionHeader icon={Store} title="Business Information" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
        <ProfileField label="Shop Name" value={vendorData?.shopName} />
        <ProfileField label="Shop Slug" value={vendorData?.shopSlug} />
        
        <ProfileField label="Description" className="sm:col-span-2">
          <p className="text-[14px] font-bold text-[#0F172A] leading-relaxed">
            {vendorData?.description || 'Not provided'}
          </p>
        </ProfileField>

        <ProfileField label="Vendor Status">
          <StatusBadge status={vendorData?.status} />
        </ProfileField>

        <ProfileField label="KYC Status">
          <StatusBadge status={vendorData?.kycStatus} />
        </ProfileField>
      </div>
    </ProfileCard>
  );
};

export default VendorBusinessCard;
