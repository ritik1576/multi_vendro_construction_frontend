import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { adminService } from '../../../services/adminService';
import { walletService } from '../../../services/walletService';
import { getWalletBalanceRequest, getWalletTransactionsRequest } from '../../../redux/walletActions';

export const useWalletTransfer = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const response = await adminService.getUsers();
      if (response.success || response.data) {
        const rawUsers = response.data || response;
        const validUsers = Array.isArray(rawUsers) ? rawUsers : [];
        const filteredUsers = validUsers.filter(u => u.role && u.role.toLowerCase() !== 'admin');
        setUsers(filteredUsers);
      } else {
        setUsersError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setUsersError(err.message || 'Network error while fetching users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const transfer = useCallback(async (targetUserId, amount) => {
    setIsTransferring(true);
    setTransferError(null);
    setTransferSuccess(false);
    try {
      const response = await walletService.transferFunds(targetUserId, amount);
      if (response.success || response.message) {
        setTransferSuccess(true);
        // Refresh wallet data after successful transfer
        dispatch(getWalletBalanceRequest());
        dispatch(getWalletTransactionsRequest());
        return response;
      } else {
        throw new Error(response.message || 'Transfer failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to transfer funds';
      setTransferError(message);
      throw err;
    } finally {
      setIsTransferring(false);
    }
  }, [dispatch]);

  const resetTransferState = useCallback(() => {
    setTransferError(null);
    setTransferSuccess(false);
  }, []);

  return {
    users,
    loadingUsers,
    usersError,
    fetchUsers,
    transfer,
    isTransferring,
    transferError,
    transferSuccess,
    resetTransferState
  };
};
