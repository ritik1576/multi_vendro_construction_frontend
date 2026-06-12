import api from './api';
import { API_ENDPOINTS } from './apiConstants';
import { store } from '../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const orderService = {
  getOrders: async (userId) => {
    if (!userId) throw new Error("User ID is required to fetch orders");
    const url = API_ENDPOINTS.ORDERS.GET_ALL.replace('{userId}', userId);
    const response = await api.get(url, { headers: getAuthHeaders() });
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID.replace('{id}', id), { headers: getAuthHeaders() });
    return response.data;
  },
  
  placeOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.ORDERS.PLACE_ORDER, orderData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },
  
  cancelOrder: async (id) => {
    const response = await api.put(API_ENDPOINTS.ORDERS.CANCEL_ORDER.replace('{id}', id), {}, { headers: getAuthHeaders() });
    return response.data;
  },
  
  trackOrder: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORDERS.TRACK_ORDER.replace('{id}', id), { headers: getAuthHeaders() });
    return response.data;
  }
};
