import api from '../../../services/api';
import { store } from '../../../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const couponService = {
  applyCouponApi: async (payload) => {
    const response = await api.post('/api/coupons/apply', payload, { headers: getAuthHeaders() });
    return response.data;
  },

  removeCouponApi: async () => {
    const response = await api.get('/api/coupons/remove', { headers: getAuthHeaders() });
    return response.data;
  },

  getCouponsApi: async () => {
    const response = await api.get('/api/coupons', { headers: getAuthHeaders() });
    return response.data;
  },

  createCouponApi: async (payload) => {
    const response = await api.post('/api/coupons', payload, { headers: getAuthHeaders() });
    return response.data;
  },

  updateCouponApi: async (id, payload) => {
    const response = await api.put(`/api/coupons/${id}`, payload, { headers: getAuthHeaders() });
    return response.data;
  },

  deleteCouponApi: async (id) => {
    const response = await api.delete(`/api/coupons/${id}`, { headers: getAuthHeaders() });
    return response.data;
  }
};
