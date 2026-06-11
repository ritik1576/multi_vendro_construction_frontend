import {
  FETCH_ADMIN_USERS_REQUEST,
  FETCH_ADMIN_USERS_SUCCESS,
  FETCH_ADMIN_USERS_FAILURE,
  FETCH_ADMIN_USER_DETAILS_REQUEST,
  FETCH_ADMIN_USER_DETAILS_SUCCESS,
  FETCH_ADMIN_USER_DETAILS_FAILURE,
  FETCH_ADMIN_VENDORS_REQUEST,
  FETCH_ADMIN_VENDORS_SUCCESS,
  FETCH_ADMIN_VENDORS_FAILURE,
  FETCH_ADMIN_ORDERS_REQUEST,
  FETCH_ADMIN_ORDERS_SUCCESS,
  FETCH_ADMIN_ORDERS_FAILURE,
} from './adminActions';

const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,
  vendors: [],
  vendorsLoading: false,
  vendorsError: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case FETCH_ADMIN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_USER_DETAILS_REQUEST:
      return {
        ...state,
        selectedUserLoading: true,
        selectedUserError: null,
      };
    case FETCH_ADMIN_USER_DETAILS_SUCCESS:
      return {
        ...state,
        selectedUserLoading: false,
        selectedUser: action.payload,
        selectedUserError: null,
      };
    case FETCH_ADMIN_USER_DETAILS_FAILURE:
      return {
        ...state,
        selectedUserLoading: false,
        selectedUserError: action.payload,
      };
    case FETCH_ADMIN_VENDORS_REQUEST:
      return {
        ...state,
        vendorsLoading: true,
        vendorsError: null,
      };
    case FETCH_ADMIN_VENDORS_SUCCESS:
      return {
        ...state,
        vendorsLoading: false,
        vendors: action.payload,
        vendorsError: null,
      };
    case FETCH_ADMIN_VENDORS_FAILURE:
      return {
        ...state,
        vendorsLoading: false,
        vendorsError: action.payload,
      };
    case FETCH_ADMIN_ORDERS_REQUEST:
      return {
        ...state,
        ordersLoading: true,
        ordersError: null,
      };
    case FETCH_ADMIN_ORDERS_SUCCESS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload,
        ordersError: null,
      };
    case FETCH_ADMIN_ORDERS_FAILURE:
      return {
        ...state,
        ordersLoading: false,
        ordersError: action.payload,
      };
    default:
      return state;
  }
};

export default adminReducer;
