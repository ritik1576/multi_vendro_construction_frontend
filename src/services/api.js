import axios from 'axios';
import { logout } from '../redux/authActions';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const API_BASE_URL = '/api';
const AUTH_API_BASE_URL = '/auth-api';

const createApiInstance = (baseURL) => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Attach JWT token if available
  apiInstance.interceptors.request.use(
    (config) => {
      // Get token from Redux store
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

  // Response Interceptor: Handle global errors like 401 Unauthorized
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        store.dispatch(logout());
        window.location.href = '/login'; 
      }
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

const api = createApiInstance(API_BASE_URL);
export const authApi = createApiInstance(AUTH_API_BASE_URL);
export default api;
