import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCT_DETAILS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE
} from './productActions';

const initialState = {
  products: [],
  loading: false,
  error: null,
  productDetails: null,
  detailsLoading: false,
  detailsError: null,
  searchResults: [],
  searchLoading: false,
  searchError: null
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload
      };
    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case GET_PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
        productDetails: null // Clear previous details while loading
      };
    case GET_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        productDetails: action.payload
      };
    case GET_PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload
      };

    case SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null
      };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload
      };
    case SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload
      };
      
    default:
      return state;
  }
};

export default productReducer;
