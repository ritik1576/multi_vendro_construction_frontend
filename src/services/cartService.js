import api from './api';
import { API_ENDPOINTS } from './apiConstants';

export const cartService = {
  getCart: async () => {
    const response = await api.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },
  
  addToCart: async (itemData) => {
    const response = await api.post(API_ENDPOINTS.CART.ADD_ITEM, itemData);
    return response.data;
  },
  
  updateCartItem: async (id, updateData) => {
    const response = await api.put(
      API_ENDPOINTS.CART.UPDATE_ITEM.replace('{id}', id),
      updateData
    );
    return response.data;
  },
  
  removeCartItem: async (id) => {
    const response = await api.delete(
      API_ENDPOINTS.CART.REMOVE_ITEM.replace('{id}', id)
    );
    return response.data;
  }
};
