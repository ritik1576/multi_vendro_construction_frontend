import React from 'react';

const ProfileHeaderCard = ({ user, roleText }) => {
  if (!user) return null;

  const initials = (user.fullName || user.name || 'U').substring(0, 2).toUpperCase();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl shrink-0">
        {initials}
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">
          {user.fullName || user.name || 'User'}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[12px] font-bold text-blue-700">
            {roleText || user.role || 'User'}
          </span>
          {user.status && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
              user.status.toLowerCase() === 'active' || user.status.toLowerCase() === 'approved'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {user.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
