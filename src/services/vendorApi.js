import api from './api';

export const getVendorStatus = async (vendorId) => {
  const vId = vendorId || 3;
  const response = await api.get(`/vendor/status/${vId}`);
  return response.data?.data || response.data;
};

export const getVendorProducts = async (vendorId) => {
  const vId = vendorId || 3;
  const response = await api.get(`/vendor/products/${vId}`);
  return response.data?.data || response.data || [];
};

export const getVendorOrders = async (vendorId) => {
  const vId = vendorId || 3;
  const response = await api.get(`/vendor/orders/${vId}`);
  return response.data?.data || response.data || [];
};

export const getVendorOrderDetails = async (vendorId, orderId) => {
  const vId = vendorId || 3;
  const response = await api.get(`/vendor/${vId}/orders/${orderId}`);
  return response.data?.data || response.data;
};

export const deleteVendorOrder = async (vendorId, orderId) => {
  const vId = vendorId || 3;
  const response = await api.delete(`/vendor/${vId}/orders/${orderId}`);
  return response.data?.data || response.data;
};
