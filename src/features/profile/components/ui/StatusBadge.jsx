import React from 'react';
import { formatFallback } from '../../utils/profileFormatters';

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || '').toLowerCase();
  
  let styles = 'bg-slate-50 text-slate-600 border border-slate-200'; // fallback gray
  
  if (normalizedStatus === 'approved' || normalizedStatus === 'active' || normalizedStatus === 'verified') {
    styles = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  } else if (normalizedStatus === 'pending' || normalizedStatus === 'pending approval') {
    styles = 'bg-amber-50 text-amber-700 border border-amber-200';
  } else if (normalizedStatus === 'rejected' || normalizedStatus === 'cancelled') {
    styles = 'bg-red-50 text-red-700 border border-red-200';
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold capitalize ${styles}`}>
      {formatFallback(status)}
    </span>
  );
};

export default StatusBadge;
