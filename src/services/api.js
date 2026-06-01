import axios from 'axios';
import { logout } from '../redux/authActions';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const API_BASE_URL = 'http://192.168.10.104:5296';

const createApiInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Attach JWT token if available
  api.interceptors.request.use(
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
  api.interceptors.response.use(
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

  return api;
};

const api = createApiInstance(API_BASE_URL);
export default api;
