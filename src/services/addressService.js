import api from './api';
import { API_ENDPOINTS } from './apiConstants';

export const addressService = {
  getUserAddresses: async (userId) => {
    const url = API_ENDPOINTS.ADDRESSES.GET_USER_ADDRESSES.replace('{userId}', userId);
    const response = await api.get(url);
    return response.data;
  },
  createAddress: async (addressData) => {
    const response = await api.post(API_ENDPOINTS.ADDRESSES.CREATE_ADDRESS, addressData);
    return response.data;
  },
  updateAddress: async (id, addressData) => {
    const response = await api.put(API_ENDPOINTS.ADDRESSES.UPDATE_ADDRESS.replace('{id}', id), addressData);
    return response.data;
  },
  deleteAddress: async (id) => {
    const response = await api.delete(API_ENDPOINTS.ADDRESSES.DELETE_ADDRESS.replace('{id}', id));
    return response.data;
  }
};
