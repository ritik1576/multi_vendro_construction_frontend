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
  
  blockProduct: async (id) => {
    // The API requires admin credentials in the body to authorize the block action
    const response = await api.put(API_ENDPOINTS.PRODUCTS.BLOCK_PRODUCT.replace('{id}', id), {
      email: "admininf@inframart.com",
      password: "sampada@123"
    });
    return response.data;
  },

  getBlockedProducts: async () => {
    // Requires admin payload to fetch blocked products according to the provided postman screenshot
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BLOCKED, {
      data: {
        email: "admininf@inframart.com",
        password: "sampada@123"
      }
    });
    return response.data;
  }
};
