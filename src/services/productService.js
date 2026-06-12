import api from './api';
import { API_ENDPOINTS } from './apiConstants';
import { store } from '../redux/store';

const getAuthHeaders = () => {
  const token = store?.getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const productService = {
  getAllProducts: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL, { headers: getAuthHeaders() });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID.replace('{id}', id), { headers: getAuthHeaders() });
    return response.data;
  },
  
  searchProducts: async (query) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { 
      params: query,
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_ALL, { headers: getAuthHeaders() });
    return response.data;
  },
  
  getVendorProducts: async (vendorId) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_VENDOR_PRODUCTS.replace('{vendorId}', vendorId), { headers: getAuthHeaders() });
    return response.data;
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.ADD_PRODUCT, productData, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    try {
      const url = API_ENDPOINTS.PRODUCTS.UPDATE_PRODUCT.replace('{id}', id);
      const response = await api.put(url, productData, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const url = API_ENDPOINTS.PRODUCTS.DELETE_PRODUCT.replace('{id}', id);
      const response = await api.delete(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
