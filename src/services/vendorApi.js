import api from './api';
import { BACKEND_URL } from './apiConstants';

export const getVendorStatus = async (vendorId) => {
  const vId = vendorId || 2;
  const response = await api.get(`${BACKEND_URL}/vendor/${vId}/status`);
  return response.data?.data || response.data;
};

export const getVendorOrders = async (vendorId) => {
  const vId = vendorId || 2;
  const response = await api.get(`${BACKEND_URL}/vendor/${vId}/orders`);
  return response.data?.data || response.data || [];
};

export const getVendorOrderDetails = async (vendorId, orderId) => {
  const vId = vendorId || 2;
  const response = await api.get(`${BACKEND_URL}/vendor/${vId}/orders/${orderId}`);
  return response.data?.data || response.data;
};

export const deleteVendorOrder = async (vendorId, orderId) => {
  const vId = vendorId || 2;
  const response = await api.delete(`${BACKEND_URL}/vendor/${vId}/orders/${orderId}`);
  return response.data?.data || response.data;
};
