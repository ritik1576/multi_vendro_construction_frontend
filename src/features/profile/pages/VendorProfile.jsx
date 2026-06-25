import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileInfoCard from '../components/ProfileInfoCard';
import VendorBusinessCard from '../components/VendorBusinessCard';
import VendorKycDetailsCard from '../components/VendorKycDetailsCard';
import SecurityCard from '../components/SecurityCard';
import VendorLayout from '../../../components/vendor/VendorLayout';

const VendorProfile = () => {
  const { user, profileData, loading, error, handleUpdatePassword } = useProfile();

  const userData = profileData?.user || profileData || user;
  const vendorBusinessData = profileData?.vendor || profileData;
  const kycData = profileData?.kyc || profileData;

  return (
    <VendorLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Profile</h1>
          <p className="text-[14px] font-medium text-slate-500 mt-1">Manage your business profile and settings.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-600 mb-8 shadow-sm">
            Failed to load profile data: {error}
          </div>
        )}

        <ProfileHeaderCard 
          user={userData} 
          vendor={vendorBusinessData} 
          roleText="Vendor Partner" 
        />

        <div className="grid grid-cols-1 gap-8">
          <ProfileInfoCard 
            title="Personal Information" 
            profileData={profileData} 
            loading={loading} 
          />
          
          <SecurityCard 
            handleUpdatePassword={handleUpdatePassword} 
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


