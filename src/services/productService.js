import api from './api';
import { API_ENDPOINTS } from './apiConstants';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
    return response.data;
  },
  
  getProductByName: async (name) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_NAME.replace('{name}', name));
    return response.data;
  },
  
  searchProducts: async (query) => {
    // query could be an object of search parameters, we pass it as params
    const response = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params: query });
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data;
  },
  
  getVendorProducts: async (vendorId) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_VENDOR_PRODUCTS.replace('{vendorId}', vendorId));
    return response.data;
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.ADD_PRODUCT, productData);
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
          'Content-Type': 'application/json'
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
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
