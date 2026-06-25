import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { formatFallback } from '../utils/profileFormatters';

const ProfileInfoCard = ({ title = "Personal Information", profileData, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const user = profileData?.user || profileData || {};
  const customer = profileData?.customer || {};
  const defaultAddress = profileData?.defaultAddress || {};

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <User className="w-5 h-5 text-slate-400" />
        <h2 className="text-[14px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
          <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(user.fullName || user.name || customer.fullName)}</p>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(user.email || customer.email)}</p>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <p className="text-[14px] font-extrabold text-[#0F172A]">{formatFallback(user.phone || user.phoneNumber || customer.phone || defaultAddress.phone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
