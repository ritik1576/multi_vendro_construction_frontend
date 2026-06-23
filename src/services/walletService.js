import api from './api';
import { API_ENDPOINTS } from './apiConstants';
import { store } from '../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const walletService = {
  getBalance: async () => {
    const response = await api.get(API_ENDPOINTS.WALLET.GET_BALANCE, { headers: getAuthHeaders() });
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get(API_ENDPOINTS.WALLET.GET_TRANSACTIONS, { headers: getAuthHeaders() });
    return response.data;
  },
  addMoney: async (amount) => {
    const response = await api.post(API_ENDPOINTS.WALLET.ADD_MONEY, { amount: Number(amount) }, { headers: getAuthHeaders() });
    return response.data;
  },
  withdrawMoney: async (amount) => {
    const response = await api.post(API_ENDPOINTS.WALLET.WITHDRAW_MONEY, { amount: Number(amount) }, { headers: getAuthHeaders() });
    return response.data;
  }
};
