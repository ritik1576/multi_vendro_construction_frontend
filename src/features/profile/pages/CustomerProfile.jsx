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
    <div className="min-h-screen bg-slate-50">
      <ProductListingNavbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-8 shadow-sm">
            Failed to load profile data: {error}
          </div>
        )}

        <div className="space-y-8">
          {(() => {
            const userObj = user || profileData?.user || profileData || {};
            const customerObj = profileData?.customer || {};
            const addressObj = profileData?.defaultAddress || {};
            
            const displayEmail = userObj?.email || customerObj?.email;
            const displayPhone = userObj?.phone || userObj?.phoneNumber || customerObj?.phone || addressObj?.phone;

            return (
              <ProfileHeaderCard 
                user={userObj} 
                roleText="Customer" 
                email={displayEmail}
                phone={displayPhone}
              />
            );
          })()}

          <div className="grid grid-cols-1 gap-8">
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
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
