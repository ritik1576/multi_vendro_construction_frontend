import React from 'react';

const ProfileCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
};

export default ProfileCard;
