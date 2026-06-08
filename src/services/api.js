import axios from 'axios';
import { logout } from '../redux/authActions';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const createApiInstance = (baseURL) => {
  const apiInstance = axios.create({
    baseURL,
    timeout: 15000, // Increased to 15 seconds to handle slower dev server responses
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Attach JWT token if available
  apiInstance.interceptors.request.use(
    (config) => {

      const state = store.getState();
      const token = state.auth.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => {

      return response;
    },
    (error) => {
      console.error('❌ [API Response Error]', error.config?.url, error.message, error.response?.data);
      if (error.response && error.response.status === 401) {
        // Clear token and let ProtectedRoute naturally redirect to login if unauthorized
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

const api = createApiInstance(API_BASE_URL);
export default api;
