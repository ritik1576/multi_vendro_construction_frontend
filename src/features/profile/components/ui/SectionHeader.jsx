import React from 'react';

const SectionHeader = ({ icon: Icon, title, action }) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 bg-slate-50 rounded-lg">
            <Icon className="w-5 h-5 text-slate-500" />
          </div>
        )}
        <h2 className="text-[13px] font-extrabold uppercase tracking-widest text-[#0F172A]">
          {title}
        </h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
