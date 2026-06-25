import React from 'react';
import { Circle } from 'lucide-react';

const getBadgeStyles = (status) => {
  const s = String(status).toLowerCase();
  if (s.includes('delivered')) return { color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'text-emerald-500' };
  if (s.includes('shipped') || s.includes('out for delivery')) return { color: 'text-sky-700', bg: 'bg-sky-50', dot: 'text-sky-500' };
  if (s.includes('confirmed')) return { color: 'text-indigo-700', bg: 'bg-indigo-50', dot: 'text-indigo-500' };
  if (s.includes('shipped')) return { color: 'text-orange-700', bg: 'bg-orange-50', dot: 'text-orange-500' };
  if (s.includes('pending')) return { color: 'text-yellow-800', bg: 'bg-yellow-50', dot: 'text-yellow-500' };
  if (s.includes('cancelled') || s.includes('returned')) return { color: 'text-red-700', bg: 'bg-red-50', dot: 'text-red-500' };
  return { color: 'text-slate-700', bg: 'bg-slate-50', dot: 'text-slate-500' };
};

const StatusBadge = ({ status }) => {
  const styles = getBadgeStyles(status);
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${styles.bg}`}>
      <Circle className={`w-2 h-2 fill-current ${styles.dot}`} />
      <span className={`text-[11px] font-bold tracking-wide uppercase ${styles.color}`}>
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;
