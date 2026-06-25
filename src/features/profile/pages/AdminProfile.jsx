import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileInfoCard from '../components/ProfileInfoCard';
import SecurityCard from '../components/SecurityCard';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminProfile = () => {
  const { user, profileData, loading, error, handleUpdatePassword } = useProfile();

  const userData = profileData?.user || profileData || user;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Admin Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your administrative account settings.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-6">
            Failed to load profile data: {error}
          </div>
        )}

        <ProfileHeaderCard user={userData} roleText="Administrator" />

        <div className="grid grid-cols-1 gap-6">
          <ProfileInfoCard 
            title="Personal Information" 
            profileData={userData} 
            loading={loading} 
          />
          
          <SecurityCard 
            handleUpdatePassword={handleUpdatePassword} 
            loading={loading} 
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
