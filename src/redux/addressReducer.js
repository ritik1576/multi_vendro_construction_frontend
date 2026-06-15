import {
  GET_USER_ADDRESSES_REQUEST,
  GET_USER_ADDRESSES_SUCCESS,
  GET_USER_ADDRESSES_FAILURE,
  CREATE_ADDRESS_REQUEST,
  CREATE_ADDRESS_SUCCESS,
  CREATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE
} from './addressActions';

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_ADDRESSES_REQUEST:
      return { ...state, loading: !action.payload.forceRefresh && state.addresses.length === 0, error: null };
    case GET_USER_ADDRESSES_SUCCESS:
      return { ...state, loading: false, addresses: action.payload };
    case GET_USER_ADDRESSES_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case CREATE_ADDRESS_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_ADDRESS_SUCCESS:
      return { ...state, loading: false, addresses: [...state.addresses, action.payload] };
    case CREATE_ADDRESS_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case UPDATE_ADDRESS_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_ADDRESS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        addresses: state.addresses.map(addr => addr.id === action.payload.id ? action.payload : addr) 
      };
    case UPDATE_ADDRESS_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case DELETE_ADDRESS_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_ADDRESS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        addresses: state.addresses.filter(addr => addr.id !== action.payload) 
      };
    case DELETE_ADDRESS_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
};

export default addressReducer;
