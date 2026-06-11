import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  CLEAR_AUTH_ERROR
} from './authActions';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  successMessage: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        successMessage: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user || action.payload,
        token: action.payload.token || null,
        error: null,
        registrationSuccess: false,
      };
    case REGISTER_SUCCESS:
      if (action.payload.isVendor) {
        return {
          ...state,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
          successMessage: action.payload.message,
          registrationSuccess: true,
        };
      }
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        successMessage: null,
        registrationSuccess: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        successMessage: null,
      };
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        successMessage: action.payload || 'Operation successful',
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        successMessage: null,
      };
    case FORGOT_PASSWORD_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        successMessage: null,
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
        successMessage: null,
      };
    case 'UPDATE_VENDOR_STATUS':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          status: action.payload
        } : null
      };
    default:
      return state;
  }
};

export default authReducer;
