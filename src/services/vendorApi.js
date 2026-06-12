import api from './api';
import { store } from '../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getVendorDashboard = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  const response = await api.get(`/vendor/${userId}/dashboard`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const getVendorStatus = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.get(`/vendor/status/${vendorId}`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const getVendorProducts = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.get(`/vendor/products/${vendorId}`, { headers: getAuthHeaders() });
  return response.data?.data || response.data || [];
};

export const getVendorOrders = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.get(`/vendor/orders/${vendorId}`, { headers: getAuthHeaders() });
  return response.data?.data || response.data || [];
};

export const getVendorOrderDetails = async (vendorId, orderId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.get(`/vendor/${vendorId}/orders/${orderId}`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const deleteVendorOrder = async (vendorId, orderId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.delete(`/vendor/${vendorId}/orders/${orderId}`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const updateOrderStatus = async (vendorId, orderId, status) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.put(`/vendor/${vendorId}/orders/${orderId}/status`, { status }, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};
