import React, { useState } from 'react';
import { Lock, KeyRound } from 'lucide-react';
import ProfileCard from './ui/ProfileCard';
import SectionHeader from './ui/SectionHeader';
import ProfileForm from './ProfileForm';

const SecurityCard = ({ handleUpdatePassword, loading }) => {
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  const securityFields = [
    { name: 'currentPassword', label: 'Current Password', type: 'password', fullWidth: true },
    { name: 'newPassword', label: 'New Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm New Password', type: 'password' },
  ];

  const handleSecuritySubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (handleUpdatePassword) {
      await handleUpdatePassword(data);
      setIsEditingSecurity(false);
    }
  };

  const actionButton = !isEditingSecurity && handleUpdatePassword && (
    <button 
      onClick={() => setIsEditingSecurity(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#1E3A8A] text-[12px] font-bold rounded-lg hover:bg-blue-100 transition-colors"
    >
      <KeyRound className="w-3.5 h-3.5" /> Change Password
    </button>
  );

  return (
    <ProfileCard>
      <SectionHeader icon={Lock} title="Security & Password" action={actionButton} />

      {isEditingSecurity ? (
        <ProfileForm
          fields={securityFields}
          initialData={{}}
          onSubmit={handleSecuritySubmit}
          onCancel={() => setIsEditingSecurity(false)}
          loading={loading}
          submitText="Update Password"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div>
            <p className="text-[14px] font-extrabold text-[#0F172A]">Password</p>
            <p className="text-[13px] text-slate-500 mt-0.5 font-medium">Last changed: Not recorded</p>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-extrabold text-slate-400 tracking-[0.2em] shadow-sm">
            ••••••••••••
          </div>
        </div>
      )}
    </ProfileCard>
  );
};

export default SecurityCard;
