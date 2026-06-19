import { User } from 'lucide-react';
import { getInitials, getDisplayName } from '../utils/profileHelpers';

const ProfileHeader = ({ user, roleText }) => {
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="h-24 w-24 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-3xl font-extrabold shadow-inner shrink-0">
        {initials}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{displayName}</h1>
        {user?.email && <p className="text-sm font-medium text-slate-500 mt-1">{user.email}</p>}
        {roleText && (
          <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md">
            {roleText}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
