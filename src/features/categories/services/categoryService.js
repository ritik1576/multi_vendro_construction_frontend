import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../services/apiConstants';

export const categoryService = {
  getCategoriesApi: async () => {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data;
  }
};
