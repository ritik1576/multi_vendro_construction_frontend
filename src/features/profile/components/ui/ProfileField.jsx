import React from 'react';
import { formatFallback } from '../../utils/profileFormatters';

const ProfileField = ({ label, value, icon: Icon, children, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      {children ? (
        <div className="text-[14px] font-extrabold text-[#0F172A] leading-relaxed">
          {children}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="text-[14px] font-extrabold text-[#0F172A]">
            {formatFallback(value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileField;
