import {
  GET_CART_REQUEST, GET_CART_SUCCESS, GET_CART_FAILURE,
  ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, REMOVE_CART_ITEM_FAILURE
} from './cartActions';
import { LOGOUT } from './authActions';

const initialState = {
  cart: null,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CART_SUCCESS:
      return { ...state, loading: false, cart: action.payload };
    case GET_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case ADD_TO_CART_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
      return { ...state, actionLoading: true, actionError: null };
      
    case ADD_TO_CART_SUCCESS:
    case UPDATE_CART_ITEM_SUCCESS:
    case REMOVE_CART_ITEM_SUCCESS:
      return { ...state, actionLoading: false, cart: action.payload };
      
    case ADD_TO_CART_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
    case REMOVE_CART_ITEM_FAILURE:
      return { ...state, actionLoading: false, actionError: action.payload };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
