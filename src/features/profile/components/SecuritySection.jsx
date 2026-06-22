import { useState } from 'react';
import { Lock } from 'lucide-react';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileForm from './ProfileForm';

const SecuritySection = ({ handleUpdatePassword, loading }) => {
  const [isEditing, setIsEditing] = useState(false);

  const passwordFields = [
    { name: 'currentPassword', label: 'Current Password', type: 'password', fullWidth: true },
    { name: 'newPassword', label: 'New Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm New Password', type: 'password' },
  ];

  const handleSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      // Typically handled by toast in form or custom validation
      // But for simplicity, let the hook or user decide
    }
    await handleUpdatePassword(data);
    setIsEditing(false);
  };

  return (
    <ProfileInfoCard title="Security & Password" icon={Lock} onEdit={!isEditing ? () => setIsEditing(true) : null}>
      {isEditing ? (
        <ProfileForm
          fields={passwordFields}
          initialData={{}} // Passwords shouldn't have initial data
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          loading={loading}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-extrabold text-[#0F172A]">Password</p>
            <p className="text-[13px] font-medium text-slate-500 mt-1">Change your password to keep your account secure.</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-[13px] font-bold text-[#1E3A8A] bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Change Password
          </button>
        </div>
      )}
    </ProfileInfoCard>
  );
};

export default SecuritySection;
