import axios from 'axios';
import { logout } from '../redux/authActions';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const API_BASE_URL = '/api';

const createApiInstance = (baseURL) => {
  const apiInstance = axios.create({
    baseURL,
    timeout: 5000, // 5 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Attach JWT token if available
  apiInstance.interceptors.request.use(
    (config) => {
      console.log('➡️ [API Request]', config.method.toUpperCase(), config.url, config.data);
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
      console.log('✅ [API Response Success]', response.config.url, response.data);
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
