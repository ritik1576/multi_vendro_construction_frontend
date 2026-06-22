import api from '../../../services/api';
import { store } from '../../../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};



export const getVendorKycStatusApi = async (vendorId, customToken = null) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const headers = customToken ? { Authorization: `Bearer ${customToken}` } : getAuthHeaders();
  const response = await api.get(`/vendor/kyc/status?vendorId=${vendorId}`, { headers });
  return response.data?.data || response.data;
};

export const getVendorKycDetailsApi = async (vendorId) => {
  const response = await api.get(`/admin/vendor-kyc/${vendorId}`);
  return response.data?.data || response.data;
};

export const submitVendorKycApi = async (formData) => {
  const response = await api.post(`/vendor/kyc`, formData, { headers: { ...getAuthHeaders() } });
  return response.data?.data || response.data;
};

export const approveVendorKycApi = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.put(`/admin/vendors/${vendorId}/approve`, {}, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const rejectVendorKycApi = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.put(`/admin/vendors/${vendorId}/reject`, {}, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};
