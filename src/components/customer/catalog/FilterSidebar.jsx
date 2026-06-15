import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ArrowUpDown, Tag, IndianRupee, Package, Filter } from 'lucide-react';

export default function FilterSidebar({
  categoryOptions,
  filters,
  onCategoryChange,
  onDiscountedChange,
  onMaxPriceChange,
  onMinPriceChange,
  onResetFilters,
  onStatusChange,
  onVendorChange,
  vendorOptions,
  sortBy,
  setSortBy,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed && !isMobileOpen) {
    return (
      <div className="w-16 border-r border-slate-200 bg-white min-h-full flex flex-col items-center py-4 transition-all duration-300 hidden lg:flex">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-md hover:bg-slate-100 text-[#1E3A8A]"
          title="Expand Filters"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const availability = ['In Stock']; // Reference image only shows In Stock as a toggle box

  const SidebarContent = () => (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex flex-col p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#1E3A8A] text-white p-1 rounded shadow-sm">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-[#1E3A8A] uppercase tracking-wide leading-tight">Advanced Filters</h2>
              <p className="text-[9px] uppercase text-[#F97316] font-bold tracking-widest mt-0.5">Precision Sourcing</p>
            </div>
          </div>
          <button
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onResetFilters}
          className="w-full text-[12px] font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 py-1.5 rounded transition-colors"
        >
          Reset All Filters
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" /> Sort By
          </h3>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full bg-white border border-slate-200 text-[13px] font-medium text-slate-700 py-1.5 pl-3 pr-8 rounded outline-none focus:border-[#1E3A8A] cursor-pointer"
            >
              <option value="relevance">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-slate-500" /> Category
          </h3>
          <div className="space-y-2.5">
            {['All', 'Bricks', 'Cement', 'Paint', 'Steel'].map((cat) => (
              <label key={cat} className="flex items-center gap-3 text-[13px] text-slate-700 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category === cat || (filters.category === 'All' && cat === 'All')}
                  onChange={() => onCategoryChange(cat)}
                  className="w-4 h-4 rounded text-[#F97316] border-slate-300 focus:ring-[#F97316] cursor-pointer"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <IndianRupee className="h-3.5 w-3.5 text-slate-500" /> Price Range
          </h3>
          <div className="space-y-4">
            
            {/* Preset Price Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Under ₹5k', min: '', max: '5000' },
                { label: '₹5k - ₹15k', min: '5000', max: '15000' },
                { label: '₹15k - ₹50k', min: '15000', max: '50000' },
                { label: 'Over ₹50k', min: '50000', max: '' },
              ].map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onMinPriceChange(range.min);
                    onMaxPriceChange(range.max);
                  }}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${
                    filters.minPrice === range.min && filters.maxPrice === range.max 
                      ? 'border-[#F97316] text-[#F97316] bg-white' 
                      : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Inputs */}
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input 
                  type="number" 
                  value={filters.minPrice} 
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  placeholder="Min" 
                  className="w-full bg-white border border-slate-200 rounded py-1.5 pl-6 pr-2 text-[12px] text-slate-700 outline-none focus:border-[#1E3A8A]" 
                />
              </div>
              <span className="text-slate-300 text-sm">-</span>
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input 
                  type="number" 
                  value={filters.maxPrice} 
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  placeholder="Max" 
                  className="w-full bg-white border border-slate-200 rounded py-1.5 pl-6 pr-2 text-[12px] text-slate-700 outline-none focus:border-[#1E3A8A]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-slate-500" /> Availability
          </h3>
          <div className="flex flex-wrap gap-2">
            {availability.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(filters.status === status ? '' : status)}
                className={`px-3 py-2 text-[12px] rounded border transition-all ${
                  filters.status === status ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white font-medium' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-56 border-r border-slate-100 bg-white min-h-full transition-all duration-300 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-[260px] max-w-full bg-white h-full flex flex-col z-10 shadow-xl overflow-hidden">
             <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
