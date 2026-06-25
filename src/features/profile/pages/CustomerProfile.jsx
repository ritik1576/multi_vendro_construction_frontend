import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileInfoCard from '../components/ProfileInfoCard';
import AddressInfoCard from '../components/AddressInfoCard';
import SecurityCard from '../components/SecurityCard';
import ProductListingNavbar from '../../../components/customer/catalog/ProductListingNavbar';

const CustomerProfile = () => {
  const { user, profileData, loading, error, handleUpdatePassword } = useProfile();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ProductListingNavbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-6">
            Failed to load profile data: {error}
          </div>
        )}

        <ProfileHeaderCard user={user || profileData?.user || profileData} roleText="Customer" />

        <div className="grid grid-cols-1 gap-6">
          <ProfileInfoCard 
            title="Personal Information" 
            profileData={profileData} 
            loading={loading} 
          />

          <AddressInfoCard 
            profileData={profileData} 
            loading={loading} 
          />
          
          <SecurityCard 
            handleUpdatePassword={handleUpdatePassword} 
            loading={loading} 
          />
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
