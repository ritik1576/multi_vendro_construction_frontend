import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const formatAmount = (amount, direction) => {
  const num = Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (direction === 'Credit') return `+₹${num}`;
  return `-₹${num}`;
};

export const WalletTransactionTable = ({ transactionsData, transactionsLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ dateRange: null, status: null });
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
    setIsFilterOpen(false);
  };

  const removeFilter = (type) => {
    setActiveFilters(prev => ({ ...prev, [type]: null }));
  };

  const resetFilters = () => {
    setActiveFilters({ dateRange: null, status: null });
    setSearchQuery('');
  };

  const transactionsList = Array.isArray(transactionsData) 
    ? transactionsData 
    : (transactionsData?.data || []);

  const filteredTransactions = transactionsList.filter((tx) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        tx.description?.toLowerCase().includes(query) ||
        tx.title?.toLowerCase().includes(query) ||
        tx.transactionId?.toLowerCase().includes(query) ||
        tx.amount?.toString().includes(query)
      );
      if (!matchesSearch) return false;
    }

    if (activeFilters.status) {
      if (activeFilters.status === 'SUCCESSFUL' && tx.status !== 'Success') return false;
      if (activeFilters.status === 'FAILED' && tx.status !== 'Failed') return false;
      if (activeFilters.status === 'PENDING' && tx.status !== 'Pending') return false;
    }

    if (activeFilters.dateRange) {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      if (activeFilters.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (txDate < weekAgo) return false;
      }
      if (activeFilters.dateRange === 'month') {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
      }
    }

    return true;
  });

  const hasActiveFilters = activeFilters.dateRange || activeFilters.status || searchQuery.trim();

  return (
    <div className="bg-white border border-[var(--color-customBorder-light)] rounded-lg shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-[var(--color-customBorder-light)]">
        <h3 className="text-xs font-bold tracking-widest text-[var(--color-primary-dark)] uppercase mb-4 sm:mb-0 w-full sm:w-auto">
          Transaction History
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded focus:outline-none focus:border-[var(--color-primary-main)] focus:ring-1 focus:ring-[var(--color-primary-main)] transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 text-xs font-bold tracking-wide border rounded transition-colors uppercase ${
                activeFilters.dateRange || activeFilters.status 
                ? 'text-white bg-[var(--color-primary-main)] border-[var(--color-primary-main)]' 
                : 'text-[var(--color-customText-primary)] border-[var(--color-customBorder-main)] hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter {(activeFilters.dateRange || activeFilters.status) && '•'}
            </button>
            
            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[var(--color-customBorder-light)] rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-[var(--color-customBorder-light)] bg-gray-50">
                  <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase">Status</span>
                </div>
                <div className="flex flex-col py-1">
                  <button onClick={() => handleFilterSelect('status', 'SUCCESSFUL')} className="text-left px-4 py-2 text-xs font-bold text-[var(--color-customText-primary)] hover:bg-gray-100">Successful Transactions</button>
                  <button onClick={() => handleFilterSelect('status', 'FAILED')} className="text-left px-4 py-2 text-xs font-bold text-[var(--color-customText-primary)] hover:bg-gray-100">Failed Transactions</button>
                  <button onClick={() => handleFilterSelect('status', 'PENDING')} className="text-left px-4 py-2 text-xs font-bold text-[var(--color-customText-primary)] hover:bg-gray-100">Pending Transactions</button>
                </div>
                <div className="p-3 border-y border-[var(--color-customBorder-light)] bg-gray-50">
                  <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase">Time Period</span>
                </div>
                <div className="flex flex-col py-1">
                  <button onClick={() => handleFilterSelect('dateRange', 'week')} className="text-left px-4 py-2 text-xs font-bold text-[var(--color-customText-primary)] hover:bg-gray-100">This Week</button>
                  <button onClick={() => handleFilterSelect('dateRange', 'month')} className="text-left px-4 py-2 text-xs font-bold text-[var(--color-customText-primary)] hover:bg-gray-100">This Month</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-[var(--color-customBorder-light)] bg-gray-50/50">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase mr-2">Active:</span>
          
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[var(--color-customBorder-light)] text-[10px] font-bold text-[var(--color-customText-primary)] uppercase shadow-sm">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          )}
          
          {activeFilters.status && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[var(--color-customBorder-light)] text-[10px] font-bold text-[var(--color-customText-primary)] uppercase shadow-sm">
              {activeFilters.status}
              <button onClick={() => removeFilter('status')} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          )}
          
          {activeFilters.dateRange && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[var(--color-customBorder-light)] text-[10px] font-bold text-[var(--color-customText-primary)] uppercase shadow-sm">
              This {activeFilters.dateRange}
              <button onClick={() => removeFilter('dateRange')} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          )}
          
          <button 
            onClick={resetFilters}
            className="ml-auto text-[10px] font-bold tracking-widest text-[var(--color-primary-main)] hover:text-[var(--color-primary-dark)] uppercase underline"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Transactions List (Table format) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-[var(--color-customBorder-light)] text-xs font-bold text-[var(--color-customText-secondary)] tracking-wider">
              <th className="px-6 py-4">Transaction Details</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">Amount</th>
              <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-customBorder-light)]">
            {transactionsLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-sm font-medium text-[var(--color-customText-secondary)]">
                  Loading transactions...
                </td>
              </tr>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="text-sm font-bold text-[var(--color-primary-dark)] mb-1">
                      {tx.title || tx.description || 'Transaction'}
                    </div>
                    <div className="text-xs text-[var(--color-customText-secondary)] font-medium">
                      {formatDate(tx.createdAt)}
                    </div>
                  </td>
                  <td className={`px-6 py-6 whitespace-nowrap text-right text-sm font-bold ${tx.direction === 'Credit' ? 'text-[var(--color-success-main)]' : 'text-[var(--color-danger-main)]'}`}>
                    {formatAmount(tx.amount, tx.direction)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
                      tx.status === 'Success' ? 'bg-green-50 text-[var(--color-success-main)]' :
                      tx.status === 'Failed' ? 'bg-red-50 text-[var(--color-danger-main)]' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-sm font-medium text-[var(--color-customText-secondary)]">
                  {transactionsList.length === 0 ? "No transaction history available." : `No transactions found matching "${searchQuery}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-[var(--color-customBorder-light)]">
        <span className="text-xs font-bold text-[var(--color-customText-secondary)] mb-4 sm:mb-0">
          Showing {filteredTransactions.length} of {transactionsData?.totalCount || transactionsList.length} transactions
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 text-[var(--color-customText-secondary)] border border-[var(--color-customBorder-light)] rounded hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white bg-[var(--color-primary-main)] rounded">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[var(--color-customText-secondary)] border border-transparent hover:bg-gray-50 rounded transition-colors">
            2
          </button>
          <button className="p-2 text-[var(--color-customText-secondary)] border border-[var(--color-customBorder-light)] rounded hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
};
