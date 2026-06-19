import api from '../../../services/api';
import { store } from '../../../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Uses multipart/form-data for files. Axios automatically sets the correct Content-Type 
// when FormData is passed, so we do not explicitly set it.
const getMultipartHeaders = () => {
  return getAuthHeaders();
};

export const getVendorKycApi = async (vendorId) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.get(`/vendors/${vendorId}/kyc`, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const submitVendorKycApi = async (vendorId, formData) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.post(`/vendors/${vendorId}/kyc`, formData, { headers: getMultipartHeaders() });
  return response.data?.data || response.data;
};



export const getAdminVendorKycApi = async () => {
  const response = await api.get('/admin/kyc', { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};

export const updateKycStatusApi = async (vendorId, payload) => {
  if (!vendorId) throw new Error('Vendor ID is required');
  const response = await api.put(`/admin/kyc/${vendorId}/status`, payload, { headers: getAuthHeaders() });
  return response.data?.data || response.data;
};
