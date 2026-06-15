import React from 'react';
import { LayoutGrid, List, X, Search } from 'lucide-react';

export default function ProductToolbar({
  filters,
  onClearFilter,
  sortBy,
  onClearSort,
  viewMode,
  setViewMode,
  searchTerm,
  onSearchChange
}) {
  const activeFilters = [];
  
  if (filters.category && filters.category !== 'All') {
    activeFilters.push({ key: 'category', label: `Category: ${filters.category}` });
  }
  if (filters.minPrice || filters.maxPrice) {
    activeFilters.push({ key: 'price', label: `Price: ${filters.minPrice || 0} - ${filters.maxPrice || 'Max'}` });
  }
  if (filters.status) {
    activeFilters.push({ key: 'status', label: `Status: ${filters.status}` });
  }
  if (filters.vendor) {
    activeFilters.push({ key: 'vendor', label: `Vendor: ${filters.vendor}` });
  }
  if (filters.discountedOnly) {
    activeFilters.push({ key: 'discountedOnly', label: 'Discounted Only' });
  }

  const hasActiveFilters = activeFilters.length > 0 || sortBy !== 'relevance';

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white py-2 px-3 rounded-lg border border-slate-200 shadow-sm min-h-[48px]">
        
        {/* Search Input Removed (now in Navbar) */}

        {/* Active Filters / Breadcrumbs Area */}
        <div className="flex-1 flex flex-wrap gap-1.5 items-center sm:justify-start overflow-x-auto hide-scrollbar pl-1">
          {hasActiveFilters && (
            <>
              {sortBy !== 'relevance' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold text-[#1E3A8A] bg-blue-50 border border-blue-100 whitespace-nowrap">
                  Sort: {String(sortBy || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <button onClick={onClearSort} className="p-0.5 hover:bg-blue-200 rounded transition-colors text-blue-400 hover:text-blue-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFilters.map(filter => (
                <span key={filter.key} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap">
                  {filter.label}
                  <button onClick={() => onClearFilter(filter.key)} className="p-0.5 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2 shrink-0 pl-3 sm:border-l border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">View:</span>
          <div className="flex items-center bg-slate-100 rounded-md p-0.5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'}`}
              aria-label="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
