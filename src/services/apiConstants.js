// Centralized API endpoint constants

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Add other resource endpoints here as the app grows
  // USERS: { ... },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_NAME: '/products/{name}',
    SEARCH: '/products/search',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
  },
  CART: {
    GET: '/cart/{userId}',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items',
    REMOVE_ITEM: '/cart/items/{id}',
  },
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/{id}',
    PLACE_ORDER: '/orders',
    CANCEL_ORDER: '/orders/{id}/cancel',
    TRACK_ORDER: '/orders/{id}/tracking',
  },
};

export const BACKEND_URL = 'http://192.168.10.104:5296';
