import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { 
  getWalletBalanceRequest, 
  getWalletTransactionsRequest,
  addWalletMoneyRequest,
  addWalletMoneyReset,
  withdrawWalletMoneyRequest,
  withdrawWalletMoneyReset
} from '../../redux/walletActions';
import { Filter, Download, ChevronLeft, ChevronRight, ShieldCheck, Plus, Minus, Search, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminWallet = () => {
  const dispatch = useDispatch();
  const { 
    balanceData, 
    loading, 
    transactionsData, 
    transactionsLoading, 
    transactionsError,
    addMoneyLoading,
    addMoneyError,
    addMoneySuccess,
    withdrawMoneyLoading,
    withdrawMoneyError,
    withdrawMoneySuccess
  } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(getWalletBalanceRequest());
    dispatch(getWalletTransactionsRequest());
  }, [dispatch]);

  // Handle successful money addition
  useEffect(() => {
    if (addMoneySuccess) {
      setIsAddAmountOpen(false);
      setAddAmountValue('');
      dispatch(addWalletMoneyReset());
    }
  }, [addMoneySuccess, dispatch]);

  const handleOpenAddModal = () => {
    dispatch(addWalletMoneyReset());
    setIsAddAmountOpen(true);
  };

  const handleAddMoneySubmit = () => {
    if (addAmountValue && !isNaN(addAmountValue) && Number(addAmountValue) > 0) {
      dispatch(addWalletMoneyRequest(addAmountValue));
    }
  };

  // Handle successful money withdrawal
  useEffect(() => {
    if (withdrawMoneySuccess) {
      setIsWithdrawAmountOpen(false);
      setWithdrawAmountValue('');
      dispatch(withdrawWalletMoneyReset());
    }
  }, [withdrawMoneySuccess, dispatch]);

  const handleOpenWithdrawModal = () => {
    dispatch(withdrawWalletMoneyReset());
    setIsWithdrawAmountOpen(true);
  };

  const handleWithdrawMoneySubmit = () => {
    if (withdrawAmountValue && !isNaN(withdrawAmountValue) && Number(withdrawAmountValue) > 0) {
      dispatch(withdrawWalletMoneyRequest(withdrawAmountValue));
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ dateRange: null, status: null });
  const [isAddAmountOpen, setIsAddAmountOpen] = useState(false);
  const [addAmountValue, setAddAmountValue] = useState('');
  const [isWithdrawAmountOpen, setIsWithdrawAmountOpen] = useState(false);
  const [withdrawAmountValue, setWithdrawAmountValue] = useState('');
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
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* Page Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-primary-dark)]">Admin Wallet</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleOpenWithdrawModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase shadow-sm"
            >
              <Minus className="w-4 h-4" />
              Withdraw
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide text-white bg-[var(--color-success-main)] rounded hover:bg-[#059669] transition-colors uppercase shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Amount
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Total Balance Card */}
          <div className="bg-white border border-[var(--color-customBorder-light)] rounded-lg p-6 shadow-sm relative overflow-hidden">
            {/* Dotted pattern overlay approximation */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-xs font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase mb-3">Total Balance</h2>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-lg font-bold text-[var(--color-primary-dark)]">₹</span>
                <span className="text-4xl font-extrabold tracking-tight text-[var(--color-primary-main)]">
                  {loading ? '...' : (balanceData?.availableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00')}
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Expenditure Card */}
          <div className="bg-white border border-[var(--color-customBorder-light)] rounded-lg p-6 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest text-[var(--color-customText-secondary)] uppercase mb-3">Monthly Expenditure</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-lg font-bold text-[var(--color-primary-dark)]">₹</span>
              <span className="text-4xl font-extrabold tracking-tight text-[var(--color-primary-main)]">
                {loading ? '...' : (balanceData?.totalDebits?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00')}
              </span>
            </div>
          </div>

        </div>

        {/* Transaction History Section */}
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
                          {tx.title}
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

      </div>

      {/* Add Amount Modal */}
      {isAddAmountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--color-customBorder-light)] flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-[var(--color-primary-dark)] tracking-tight">Add Funds</h3>
              <button onClick={() => setIsAddAmountOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {addMoneyError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100">
                  {addMoneyError}
                </div>
              )}
              <label className="block text-xs font-bold text-[var(--color-customText-secondary)] uppercase tracking-wider mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                <input
                  type="number"
                  value={addAmountValue}
                  onChange={(e) => setAddAmountValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 text-lg font-bold text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded focus:outline-none focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20 transition-all"
                  disabled={addMoneyLoading}
                />
              </div>
            </div>
            <div className="p-5 border-t border-[var(--color-customBorder-light)] bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsAddAmountOpen(false)}
                disabled={addMoneyLoading}
                className="flex-1 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-secondary)] bg-white border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMoneySubmit}
                disabled={addMoneyLoading || !addAmountValue || Number(addAmountValue) <= 0}
                className="flex-1 py-2.5 text-xs font-bold tracking-wide text-white bg-[var(--color-success-main)] rounded hover:bg-[#059669] transition-colors uppercase shadow-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addMoneyLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Amount Modal */}
      {isWithdrawAmountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--color-customBorder-light)] flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-[var(--color-primary-dark)] tracking-tight">Withdraw Funds</h3>
              <button onClick={() => setIsWithdrawAmountOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {withdrawMoneyError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100">
                  {withdrawMoneyError}
                </div>
              )}
              <label className="block text-xs font-bold text-[var(--color-customText-secondary)] uppercase tracking-wider mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                <input
                  type="number"
                  value={withdrawAmountValue}
                  onChange={(e) => setWithdrawAmountValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 text-lg font-bold text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded focus:outline-none focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20 transition-all"
                  disabled={withdrawMoneyLoading}
                />
              </div>
              <div className="mt-3 text-xs text-[var(--color-customText-secondary)] flex justify-between">
                <span>Available Balance:</span>
                <span className="font-bold text-[var(--color-primary-dark)]">₹{balanceData?.availableBalance || '0.00'}</span>
              </div>
            </div>
            <div className="p-5 border-t border-[var(--color-customBorder-light)] bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsWithdrawAmountOpen(false)}
                disabled={withdrawMoneyLoading}
                className="flex-1 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-secondary)] bg-white border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleWithdrawMoneySubmit}
                disabled={withdrawMoneyLoading || !withdrawAmountValue || Number(withdrawAmountValue) <= 0 || Number(withdrawAmountValue) > Number(balanceData?.availableBalance || 0)}
                className="flex-1 py-2.5 text-xs font-bold tracking-wide text-white bg-[var(--color-danger-main)] rounded hover:bg-[#dc2626] transition-colors uppercase shadow-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawMoneyLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminWallet;
