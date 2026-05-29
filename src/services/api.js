import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.10.164:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      removeToken();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
