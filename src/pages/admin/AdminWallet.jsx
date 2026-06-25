import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getWalletBalanceRequest, 
  getWalletTransactionsRequest,
  addWalletMoneyRequest,
  addWalletMoneyReset,
  withdrawWalletMoneyRequest,
  withdrawWalletMoneyReset
} from '../../redux/walletActions';
import { Plus, Minus, Send, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { WalletTransactionTable } from '../../features/wallet/components/WalletTransactionTable';
import { TransferFundsModal } from '../../features/wallet/components/TransferFundsModal';

const AdminWallet = () => {
  const dispatch = useDispatch();
  const { 
    balanceData, 
    loading, 
    transactionsData, 
    transactionsLoading, 
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

  const [isAddAmountOpen, setIsAddAmountOpen] = useState(false);
  const [addAmountValue, setAddAmountValue] = useState('');
  
  const [isWithdrawAmountOpen, setIsWithdrawAmountOpen] = useState(false);
  const [withdrawAmountValue, setWithdrawAmountValue] = useState('');
  
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* Page Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-primary-dark)]">Admin Wallet</h1>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleOpenWithdrawModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase shadow-sm"
            >
              <Minus className="w-4 h-4" />
              Withdraw
            </button>
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide text-white bg-[#1E3A8A] rounded hover:bg-[#172f70] transition-colors uppercase shadow-sm"
            >
              <Send className="w-4 h-4" />
              Transfer Funds
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
        <WalletTransactionTable 
          transactionsData={transactionsData} 
          transactionsLoading={transactionsLoading} 
        />

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

      <TransferFundsModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        availableBalance={balanceData?.availableBalance || 0}
      />

    </AdminLayout>
  );
};

export default AdminWallet;
