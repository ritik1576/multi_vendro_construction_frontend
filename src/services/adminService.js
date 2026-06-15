import api from './api';
import { API_ENDPOINTS } from './apiConstants';

export const adminService = {
  getUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_USERS);
    return response.data;
  },
  getVendors: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_VENDORS);
    return response.data;
  },
  getUserDetails: async (id) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_USER_DETAILS.replace('{id}', id));
    return response.data;
  },
  approveVendor: async (id) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.APPROVE_VENDOR.replace('{id}', id));
    return response.data;
  },
  rejectVendor: async (id, reason) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.REJECT_VENDOR.replace('{id}', id), { message: reason });
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_ALL_ORDERS);
    return response.data;
  }
};
