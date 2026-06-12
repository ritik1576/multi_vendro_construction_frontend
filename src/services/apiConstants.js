// Centralized API endpoint constants

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VENDOR_LOGIN: '/auth/vendor/login',
    VENDOR_REGISTER: '/auth/vendor/register',
  },
  ADDRESSES: {
    GET_USER_ADDRESSES: '/addresses/user/{userId}',
    CREATE_ADDRESS: '/addresses',
    UPDATE_ADDRESS: '/addresses/{id}',
    DELETE_ADDRESS: '/addresses/{id}',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/{id}',
    SEARCH: '/products/search',
    GET_VENDOR_PRODUCTS: '/vendor/products/{vendorId}',
    ADD_PRODUCT: '/products',
    UPDATE_PRODUCT: '/products/{id}',
    DELETE_PRODUCT: '/products/{id}',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
  },
  CART: {
    GET: '/cart/{userId}',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/update/items',
    REMOVE_ITEM: '/cart/delete/{id}',
  },
  ORDERS: {
    GET_ALL: '/orders/all/{userId}',
    GET_BY_ID: '/orders/{id}',
    PLACE_ORDER: '/orders',
    CANCEL_ORDER: '/orders/{id}/cancel',
    TRACK_ORDER: '/orders/{id}/tracking',
  },
};

export const BACKEND_URL = 'https://multi-vendro-construction-backend-4.onrender.com';
