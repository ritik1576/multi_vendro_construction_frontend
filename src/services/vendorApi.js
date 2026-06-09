import api from './api';

export const getVendorStatus = async (vendorId) => {
  const response = await api.get(`/vendor/${vendorId}/status`);
  return response.data?.data || response.data;
};

export const getVendorOrders = async (vendorId) => {
  const response = await api.get(`/vendor/${vendorId}/orders`);
  return response.data?.data || response.data || [];
};

export const getVendorOrderDetails = async (vendorId, orderId) => {
  const response = await api.get(`/vendor/${vendorId}/orders/${orderId}`);
  return response.data?.data || response.data;
};

export const deleteVendorOrder = async (vendorId, orderId) => {
  const response = await api.delete(`/vendor/${vendorId}/orders/${orderId}`);
  return response.data?.data || response.data;
};
