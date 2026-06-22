import { useState } from 'react';
import { MapPin } from 'lucide-react';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileForm from './ProfileForm';

const AddressSection = ({ profileData, handleUpdateProfile, loading }) => {
  const [isEditing, setIsEditing] = useState(false);

  const addressFields = [
    { name: 'address', label: 'Street Address', type: 'text', fullWidth: true },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'PIN Code', type: 'text' },
  ];

  const handleSubmit = async (data) => {
    await handleUpdateProfile(data);
    setIsEditing(false);
  };

  return (
    <ProfileInfoCard title="Address Information" icon={MapPin} onEdit={!isEditing ? () => setIsEditing(true) : null}>
      {isEditing ? (
        <ProfileForm
          fields={addressFields}
          initialData={profileData}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          loading={loading}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Street Address</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.address || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.city || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">State</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.state || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">PIN Code</p>
            <p className="text-[14px] font-extrabold text-[#0F172A]">{profileData?.pincode || 'Not provided'}</p>
          </div>
        </div>
      )}
    </ProfileInfoCard>
  );
};

export default AddressSection;
