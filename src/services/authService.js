import api from './api';
import { API_ENDPOINTS } from './apiConstants';

const authService = {
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
};

export default authService;
