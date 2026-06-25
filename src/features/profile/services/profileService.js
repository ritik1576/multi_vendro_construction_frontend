import api from '../../../services/api';
import { store } from '../../../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const updateProfile = async (userId, data) => {
  if (!userId) throw new Error('User ID is required');
  const response = await api.put(`/users/${userId}/profile`, data, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const updatePassword = async (userId, data) => {
  if (!userId) throw new Error('User ID is required');
  const response = await api.put(`/users/${userId}/password`, data, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const getCustomerProfileApi = async () => {
  const response = await api.get(`/customer/profile`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const getVendorProfileApi = async () => {
  const response = await api.get(`/vendor/profile`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const getAdminProfileApi = async () => {
  const response = await api.get(`/admin/profile`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};
