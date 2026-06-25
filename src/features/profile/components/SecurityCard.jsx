import React, { useState } from 'react';
import { Lock } from 'lucide-react';
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-400" />
          <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
            Security & Password
          </h2>
        </div>
        {!isEditingSecurity && handleUpdatePassword && (
          <button 
            onClick={() => setIsEditingSecurity(true)}
            className="text-[12px] font-bold text-[#1E3A8A] hover:underline"
          >
            Change Password
          </button>
        )}
      </div>

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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#0F172A]">Password</p>
            <p className="text-[12px] text-slate-500 mt-1">Last changed: Not recorded</p>
          </div>
          <div className="px-3 py-1 bg-slate-100 rounded text-[11px] font-extrabold text-slate-500 tracking-wider">
            ••••••••
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCard;
