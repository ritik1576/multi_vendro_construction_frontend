import axios from 'axios';
import { API_ENDPOINTS, BACKEND_URL } from './apiConstants';

export const adminService = {
  getUsers: async () => {
    // We expect headers/interceptors to handle auth token in a real app,
    // but for now, we just pass the URL like the rest of the app.
    const response = await axios.get(`${BACKEND_URL}${API_ENDPOINTS.ADMIN.GET_USERS}`);
    return response.data;
  },
  getVendors: async () => {
    const response = await axios.get(`${BACKEND_URL}${API_ENDPOINTS.ADMIN.GET_VENDORS}`);
    return response.data;
  },
  getUserDetails: async (id) => {
    const response = await axios.get(`${BACKEND_URL}${API_ENDPOINTS.ADMIN.GET_USER_DETAILS.replace('{id}', id)}`);
    return response.data;
  },
  approveVendor: async (id) => {
    const url = `${BACKEND_URL}${API_ENDPOINTS.ADMIN.APPROVE_VENDOR.replace('{id}', id)}`;
    const response = await axios.put(url);
    return response.data;
  },
  rejectVendor: async (id, reason) => {
    const url = `${BACKEND_URL}${API_ENDPOINTS.ADMIN.REJECT_VENDOR.replace('{id}', id)}`;
    // The user requested to "give rejection message in payload"
    const response = await axios.put(url, { message: reason });
    return response.data;
  },
  getAllOrders: async () => {
    const response = await axios.get(`${BACKEND_URL}${API_ENDPOINTS.ADMIN.GET_ALL_ORDERS}`);
    return response.data;
  }
};
