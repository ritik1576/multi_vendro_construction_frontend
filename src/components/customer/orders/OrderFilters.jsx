import React from 'react';

const statuses = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const dateRanges = [
  { label: 'Last 30 days', value: '30_days' },
  { label: 'Last 6 months', value: '6_months' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: 'Older', value: 'older' }
];

const OrderFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleStatusChange = (status) => {
    const updatedStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: updatedStatuses });
  };

  const handleDateChange = (value) => {
    const updatedDates = filters.dateRanges.includes(value)
      ? filters.dateRanges.filter((d) => d !== value)
      : [...filters.dateRanges, value];
    onFilterChange({ ...filters, dateRanges: updatedDates });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 w-full md:w-[260px] flex-shrink-0">
      <h2 className="text-[15px] font-extrabold text-[#0F172A] mb-6 tracking-tight">Filters</h2>
      
      {/* Order Status */}
      <div className="mb-8">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Order Status
        </h3>
        <div className="space-y-3">
          {statuses.map((status) => (
            <label key={status} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                checked={filters.statuses.includes(status)}
                onChange={() => handleStatusChange(status)}
              />
              <span className="ml-3 text-[13px] font-medium text-slate-700 group-hover:text-[#1E3A8A] transition-colors">
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Order Time */}
      <div className="mb-8">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Order Time
        </h3>
        <div className="space-y-3">
          {dateRanges.map((range) => (
            <label key={range.value} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer"
                checked={filters.dateRanges.includes(range.value)}
                onChange={() => handleDateChange(range.value)}
              />
              <span className="ml-3 text-[13px] font-medium text-slate-700 group-hover:text-[#1E3A8A] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold rounded transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default OrderFilters;
