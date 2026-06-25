import React from 'react';
import ProfileCard from './ui/ProfileCard';
import StatusBadge from './ui/StatusBadge';
import { Mail, Phone } from 'lucide-react';
import { formatFallback } from '../utils/profileFormatters';

const ProfileHeaderCard = ({ user, vendor, roleText }) => {
  if (!user) return null;

  // Use shopName for Vendor, otherwise fullName
  const displayName = vendor?.shopName || vendor?.businessName || user.fullName || user.name || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  const status = vendor?.status || user.status;

  return (
    <ProfileCard className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 bg-gradient-to-br from-white to-slate-50 border-none shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1E3A8A] text-white rounded-2xl flex items-center justify-center font-extrabold text-3xl shrink-0 shadow-lg relative z-10">
        {initials}
      </div>
      
      <div className="flex-1 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {displayName}
          </h1>
          {status && <StatusBadge status={status} />}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-slate-500">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100/50 text-[#1E3A8A]">
            {roleText || user.role || 'User'}
          </span>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{formatFallback(user.email)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{formatFallback(user.phone || user.phoneNumber)}</span>
          </div>
        </div>
      </div>
    </ProfileCard>
  );
};

export default ProfileHeaderCard;
