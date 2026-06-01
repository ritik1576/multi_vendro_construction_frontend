import { authApi } from './api';
import { API_ENDPOINTS } from './apiConstants';

const authService = {
  register: async (userData) => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  forgotPassword: async (data) => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};

export default authService;
