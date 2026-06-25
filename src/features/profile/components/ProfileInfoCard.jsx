import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import ProfileCard from './ui/ProfileCard';
import SectionHeader from './ui/SectionHeader';
import ProfileField from './ui/ProfileField';
import StatusBadge from './ui/StatusBadge';

const ProfileInfoCard = ({ title = "Personal Information", profileData, loading }) => {
  if (loading) {
    return (
      <ProfileCard className="animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
        </div>
      </ProfileCard>
    );
  }

  const user = profileData?.user || profileData || {};
  const customer = profileData?.customer || {};
  const defaultAddress = profileData?.defaultAddress || {};

  const phone = user.phone || user.phoneNumber || customer.phone || defaultAddress.phone;
  const fullName = user.fullName || user.name || customer.fullName;
  const email = user.email || customer.email;

  return (
    <ProfileCard>
      <SectionHeader icon={User} title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
        <ProfileField label="Full Name" value={fullName} />
        
        <ProfileField label="Email" value={email} icon={Mail} />
        
        <ProfileField label="Phone Number" value={phone} icon={Phone} />
        
        <ProfileField label="Account Status">
          <StatusBadge status={user.status || 'Active'} />
        </ProfileField>
      </div>
    </ProfileCard>
  );
};

export default ProfileInfoCard;
