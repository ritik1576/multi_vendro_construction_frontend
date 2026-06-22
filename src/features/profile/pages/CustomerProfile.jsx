import React, { useState } from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileForm from '../components/ProfileForm';
import AddressSection from '../components/AddressSection';
import SecuritySection from '../components/SecuritySection';
import ProductListingNavbar from '../../../components/customer/catalog/ProductListingNavbar';

const CustomerProfile = () => {
  const { user, profileData, loading, handleUpdateProfile, handleUpdatePassword } = useProfile();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const personalFields = [
    { name: 'fullName', label: 'Full Name', type: 'text', fullWidth: true },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
  ];

  const handlePersonalSubmit = async (data) => {
    await handleUpdateProfile(data);
    setIsEditingPersonal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ProductListingNavbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <ProfileHeader user={user} roleText="Customer" />

        <div className="grid grid-cols-1 gap-6">
          <ProfileInfoCard title="Personal Information" icon={User} onEdit={!isEditingPersonal ? () => setIsEditingPersonal(true) : null}>
            {isEditingPersonal ? (
              <ProfileForm
                fields={personalFields}
                initialData={profileData}
                onSubmit={handlePersonalSubmit}
                onCancel={() => setIsEditingPersonal(false)}
                loading={loading}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.fullName || profileData?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.phone || profileData?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </ProfileInfoCard>

          <AddressSection profileData={profileData} handleUpdateProfile={handleUpdateProfile} loading={loading} />
          
          <SecuritySection handleUpdatePassword={handleUpdatePassword} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
