import api from './api';
import { API_ENDPOINTS } from './apiConstants';

export const orderService = {
  getOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_ALL);
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID.replace('{id}', id));
    return response.data;
  },
  
  placeOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.ORDERS.PLACE_ORDER, orderData);
    return response.data;
  },
  
  cancelOrder: async (id) => {
    const response = await api.put(API_ENDPOINTS.ORDERS.CANCEL_ORDER.replace('{id}', id));
    return response.data;
  },
  
  trackOrder: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORDERS.TRACK_ORDER.replace('{id}', id));
    return response.data;
  }
};
