import React, { useState } from 'react';
import { User, Mail, ShieldAlert } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileForm from '../components/ProfileForm';
import SecuritySection from '../components/SecuritySection';

const AdminProfile = () => {
  const { user, profileData, loading, handleUpdateProfile, handleUpdatePassword } = useProfile();
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);

  const adminFields = [
    { name: 'fullName', label: 'Admin Name', type: 'text', fullWidth: true },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
  ];

  const handleAdminSubmit = async (data) => {
    await handleUpdateProfile(data);
    setIsEditingAdmin(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Admin Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage system administrator details and security.</p>
        </div>

        <ProfileHeader user={user} roleText="Administrator" />

        <div className="space-y-6">
          <ProfileInfoCard title="Admin Information" icon={User} onEdit={!isEditingAdmin ? () => setIsEditingAdmin(true) : null}>
            {isEditingAdmin ? (
              <ProfileForm
                fields={adminFields}
                initialData={{
                  fullName: profileData?.fullName || profileData?.name || profileData?.firstName,
                  email: profileData?.email,
                  phone: profileData?.phone || profileData?.phoneNumber
                }}
                onSubmit={handleAdminSubmit}
                onCancel={() => setIsEditingAdmin(false)}
                loading={loading}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Name</p>
                  <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.fullName || profileData?.name || profileData?.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role / Permissions</p>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.role || 'Super Admin'}</p>
                  </div>
                </div>
              </div>
            )}
          </ProfileInfoCard>
          
          <SecuritySection handleUpdatePassword={handleUpdatePassword} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
