import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileInfoCard from '../components/ProfileInfoCard';
import VendorBusinessCard from '../components/VendorBusinessCard';
import VendorKycDetailsCard from '../components/VendorKycDetailsCard';
import VendorLayout from '../../../components/vendor/VendorLayout';

const VendorProfile = () => {
  const { user, profileData, loading, error } = useProfile();

  const userData = profileData?.user || profileData || user;
  const vendorBusinessData = profileData?.vendor || profileData;
  const kycData = profileData?.kyc || profileData;

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal, business, and KYC information.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-6">
            Failed to load profile data: {error}
          </div>
        )}

        <ProfileHeaderCard user={userData} roleText="Vendor" />

        <div className="grid grid-cols-1 gap-6">
          <ProfileInfoCard 
            title="Personal Information" 
            profileData={userData} 
            loading={loading} 
          />

          <VendorBusinessCard 
            vendorData={vendorBusinessData} 
            loading={loading} 
          />
          
          <VendorKycDetailsCard 
            kycData={kycData} 
            loading={loading} 
          />
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;


