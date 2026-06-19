import React from 'react';

const KycStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { label: 'Approved', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
      case 'pending':
        return { label: 'In Review', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
      case 'not_submitted':
      default:
        return { label: 'Not Submitted', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.border} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default KycStatusBadge;
