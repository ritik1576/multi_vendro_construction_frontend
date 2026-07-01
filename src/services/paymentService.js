import api from './api';
import { API_ENDPOINTS } from './apiConstants';
import { store } from '../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  createOnlinePaymentApi: async (payload) => {
    const response = await api.post(API_ENDPOINTS.ORDERS.CREATE_ONLINE_PAYMENT, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },
  
  verifyOnlinePaymentApi: async (payload) => {
    const response = await api.post(API_ENDPOINTS.ORDERS.VERIFY_PAYMENT, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },

  createWalletAddMoneyPaymentApi: async (payload) => {
    const response = await api.post('/wallet/create-add-money-payment', payload, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },

  verifyWalletAddMoneyApi: async (payload) => {
    const response = await api.post('/wallet/verify-add-money', payload, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data;
  }
};
