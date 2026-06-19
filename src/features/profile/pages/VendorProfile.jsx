import React, { useState } from 'react';
import { Briefcase, Building, Phone, Mail } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import VendorLayout from '../../../components/vendor/VendorLayout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileForm from '../components/ProfileForm';
import AddressSection from '../components/AddressSection';
import SecuritySection from '../components/SecuritySection';
import ProfileStatusCard from '../components/ProfileStatusCard';

const VendorProfile = () => {
  const { user, profileData, loading, handleUpdateProfile, handleUpdatePassword } = useProfile();
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  const businessFields = [
    { name: 'businessName', label: 'Business / Shop Name', type: 'text', fullWidth: true },
    { name: 'gstNumber', label: 'GST Number', type: 'text' },
    { name: 'phone', label: 'Business Phone', type: 'tel' },
    { name: 'description', label: 'Business Description', type: 'textarea', fullWidth: true },
  ];

  const handleBusinessSubmit = async (data) => {
    await handleUpdateProfile(data);
    setIsEditingBusiness(false);
  };

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your business information and security settings.</p>
        </div>

        <ProfileHeader user={user} roleText="Vendor" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileStatusCard 
            title="Approval Status" 
            status={profileData?.status || 'Pending'} 
            message="Your vendor account approval status." 
          />
          <ProfileStatusCard 
            title="KYC Verification" 
            status={profileData?.kycStatus || 'Pending'} 
            message="Status of your Know Your Customer documents." 
          />
        </div>

        <div className="space-y-6">
          <ProfileInfoCard title="Business Information" icon={Building} onEdit={!isEditingBusiness ? () => setIsEditingBusiness(true) : null}>
            {isEditingBusiness ? (
              <ProfileForm
                fields={businessFields}
                initialData={{
                  businessName: profileData?.businessName || profileData?.shopName,
                  gstNumber: profileData?.gstNumber,
                  phone: profileData?.phone || profileData?.phoneNumber,
                  description: profileData?.description
                }}
                onSubmit={handleBusinessSubmit}
                onCancel={() => setIsEditingBusiness(false)}
                loading={loading}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="md:col-span-2">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Name</p>
                  <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.businessName || profileData?.shopName || 'Not provided'}</p>
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
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">GST Number</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.gstNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </ProfileInfoCard>

          <AddressSection profileData={profileData} handleUpdateProfile={handleUpdateProfile} loading={loading} />
          
          <SecuritySection handleUpdatePassword={handleUpdatePassword} loading={loading} />
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
