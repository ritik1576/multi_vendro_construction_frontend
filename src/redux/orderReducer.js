import {
  GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS, GET_ORDERS_FAILURE,
  GET_ORDER_DETAILS_REQUEST, GET_ORDER_DETAILS_SUCCESS, GET_ORDER_DETAILS_FAILURE,
  PLACE_ORDER_REQUEST, PLACE_ORDER_SUCCESS, PLACE_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST, CANCEL_ORDER_SUCCESS, CANCEL_ORDER_FAILURE,
  TRACK_ORDER_REQUEST, TRACK_ORDER_SUCCESS, TRACK_ORDER_FAILURE
} from './orderActions';

const initialState = {
  orders: [],
  orderDetails: null,
  trackingInfo: null,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS_REQUEST:
    case GET_ORDER_DETAILS_REQUEST:
    case TRACK_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
      
    case GET_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case GET_ORDER_DETAILS_SUCCESS:
      return { ...state, loading: false, orderDetails: action.payload };
    case TRACK_ORDER_SUCCESS:
      return { ...state, loading: false, trackingInfo: action.payload };

    case GET_ORDERS_FAILURE:
    case GET_ORDER_DETAILS_FAILURE:
    case TRACK_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case PLACE_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
      return { ...state, actionLoading: true, actionError: null };
      
    case PLACE_ORDER_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
      return { ...state, actionLoading: false };
      
    case PLACE_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
      return { ...state, actionLoading: false, actionError: action.payload };

    default:
      return state;
  }
};

export default orderReducer;
