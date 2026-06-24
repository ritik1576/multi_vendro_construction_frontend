import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useWalletTransfer } from '../hooks/useWalletTransfer';
import { UserSearchList } from './UserSearchList';

export const TransferFundsModal = ({ isOpen, onClose, availableBalance }) => {
  const { 
    users, 
    loadingUsers, 
    usersError, 
    fetchUsers, 
    transfer, 
    isTransferring, 
    transferError, 
    transferSuccess, 
    resetTransferState 
  } = useWalletTransfer();

  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSelectedUser(null);
      setAmount('');
      resetTransferState();
    }
  }, [isOpen, fetchUsers, resetTransferState]);

  useEffect(() => {
    if (transferSuccess) {
      setTimeout(() => {
        onClose();
      }, 1500); // Wait a bit to show success before closing
    }
  }, [transferSuccess, onClose]);

  if (!isOpen) return null;

  const handleTransfer = async () => {
    if (!selectedUser || !amount || Number(amount) <= 0 || Number(amount) > Number(availableBalance)) {
      return;
    }
    try {
      await transfer(selectedUser.id, amount);
    } catch (e) {
      // Error is handled in hook
    }
  };

  const isAmountValid = amount && !isNaN(amount) && Number(amount) > 0 && Number(amount) <= Number(availableBalance);
  const isTransferDisabled = isTransferring || !selectedUser || !isAmountValid || transferSuccess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[var(--color-customBorder-light)] flex justify-between items-center bg-gray-50/50">
          <h3 className="font-extrabold text-[var(--color-primary-dark)] tracking-tight">Transfer Funds</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isTransferring}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {transferError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100">
              {transferError}
            </div>
          )}
          {transferSuccess && (
            <div className="p-3 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">
              Funds transferred successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--color-customText-secondary)] uppercase tracking-wider mb-2">
              Select User
            </label>
            <UserSearchList 
              users={users} 
              loading={loadingUsers} 
              error={usersError} 
              onSelectUser={setSelectedUser} 
              selectedUserId={selectedUser?.id} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-customText-secondary)] uppercase tracking-wider mb-2 mt-4">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 text-lg font-bold text-[var(--color-customText-primary)] border border-[var(--color-customBorder-main)] rounded focus:outline-none focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-main)]/20 transition-all"
                disabled={isTransferring || transferSuccess}
              />
            </div>
            <div className="mt-3 text-xs text-[var(--color-customText-secondary)] flex justify-between">
              <span>Available Admin Balance:</span>
              <span className="font-bold text-[var(--color-primary-dark)]">₹{availableBalance || '0.00'}</span>
            </div>
            {amount && Number(amount) > Number(availableBalance) && (
              <div className="mt-1 text-[10px] text-red-500 font-medium">
                Amount exceeds available balance.
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 border-t border-[var(--color-customBorder-light)] bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            disabled={isTransferring}
            className="flex-1 py-2.5 text-xs font-bold tracking-wide text-[var(--color-customText-secondary)] bg-white border border-[var(--color-customBorder-main)] rounded hover:bg-gray-50 transition-colors uppercase disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleTransfer}
            disabled={isTransferDisabled}
            className="flex-1 py-2.5 text-xs font-bold tracking-wide text-white bg-[var(--color-primary-main)] rounded hover:bg-[var(--color-primary-dark)] transition-colors uppercase shadow-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransferring ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Transfer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
