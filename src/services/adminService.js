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
  getVendorKycDetails: async (vendorId) => {
    const response = await api.get(`/admin/vendor-kyc/${vendorId}`);
    return response.data?.data || response.data;
  },
  approveVendor: async (vendorId) => {
    const response = await api.put(`/admin/vendors/${vendorId}/approve`);
    return response.data;
  },
  rejectVendor: async (vendorId, reason) => {
    const response = await api.put(`/admin/vendors/${vendorId}/reject`, { message: reason });
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GET_ALL_ORDERS);
    return response.data;
  }
};
