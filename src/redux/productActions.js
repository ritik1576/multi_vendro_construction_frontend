// Action Types
export const GET_PRODUCTS_REQUEST = 'GET_PRODUCTS_REQUEST';
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILURE = 'GET_PRODUCTS_FAILURE';

export const GET_PRODUCT_DETAILS_REQUEST = 'GET_PRODUCT_DETAILS_REQUEST';
export const GET_PRODUCT_DETAILS_SUCCESS = 'GET_PRODUCT_DETAILS_SUCCESS';
export const GET_PRODUCT_DETAILS_FAILURE = 'GET_PRODUCT_DETAILS_FAILURE';

export const SEARCH_PRODUCTS_REQUEST = 'SEARCH_PRODUCTS_REQUEST';
export const SEARCH_PRODUCTS_SUCCESS = 'SEARCH_PRODUCTS_SUCCESS';
export const SEARCH_PRODUCTS_FAILURE = 'SEARCH_PRODUCTS_FAILURE';

// Action Creators
export const getProductsRequest = () => ({
  type: GET_PRODUCTS_REQUEST
});

export const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products
});

export const getProductsFailure = (error) => ({
  type: GET_PRODUCTS_FAILURE,
  payload: error
});

export const getProductDetailsRequest = (name) => ({
  type: GET_PRODUCT_DETAILS_REQUEST,
  payload: name
});

export const getProductDetailsSuccess = (product) => ({
  type: GET_PRODUCT_DETAILS_SUCCESS,
  payload: product
});

export const getProductDetailsFailure = (error) => ({
  type: GET_PRODUCT_DETAILS_FAILURE,
  payload: error
});

export const searchProductsRequest = (query) => ({
  type: SEARCH_PRODUCTS_REQUEST,
  payload: query
});

export const searchProductsSuccess = (products) => ({
  type: SEARCH_PRODUCTS_SUCCESS,
  payload: products
});

export const searchProductsFailure = (error) => ({
  type: SEARCH_PRODUCTS_FAILURE,
  payload: error
});
