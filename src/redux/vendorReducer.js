import {
  GET_VENDOR_DASHBOARD_REQUEST,
  GET_VENDOR_DASHBOARD_SUCCESS,
  GET_VENDOR_DASHBOARD_FAILURE,
  GET_VENDOR_STATUS_REQUEST,
  GET_VENDOR_STATUS_SUCCESS,
  GET_VENDOR_STATUS_FAILURE,
  GET_VENDOR_ORDERS_REQUEST,
  GET_VENDOR_ORDERS_SUCCESS,
  GET_VENDOR_ORDERS_FAILURE,
  UPDATE_VENDOR_ORDER_STATUS_REQUEST,
  UPDATE_VENDOR_ORDER_STATUS_SUCCESS,
  UPDATE_VENDOR_ORDER_STATUS_FAILURE,
  DELETE_VENDOR_ORDER_REQUEST,
  DELETE_VENDOR_ORDER_SUCCESS,
  DELETE_VENDOR_ORDER_FAILURE,
} from './vendorActions';

const initialState = {
  dashboard: null,
  status: null,
  orders: [],
  loading: {
    dashboard: false,
    status: false,
    orders: false,
    updateOrder: false,
  },
  error: null,
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VENDOR_DASHBOARD_REQUEST:
      return { 
        ...state, 
        loading: { ...state.loading, dashboard: !action.payload.forceRefresh && !state.dashboard },
        error: null 
      };
    case GET_VENDOR_DASHBOARD_SUCCESS:
      return { ...state, loading: { ...state.loading, dashboard: false }, dashboard: action.payload };
    case GET_VENDOR_DASHBOARD_FAILURE:
      return { ...state, loading: { ...state.loading, dashboard: false }, error: action.payload };

    case GET_VENDOR_STATUS_REQUEST:
      return { 
        ...state, 
        loading: { ...state.loading, status: !action.payload.forceRefresh && !state.status },
        error: null 
      };
    case GET_VENDOR_STATUS_SUCCESS:
      return { ...state, loading: { ...state.loading, status: false }, status: action.payload };
    case GET_VENDOR_STATUS_FAILURE:
      return { ...state, loading: { ...state.loading, status: false }, error: action.payload };

    case GET_VENDOR_ORDERS_REQUEST:
      return { 
        ...state, 
        loading: { ...state.loading, orders: !action.payload.forceRefresh && state.orders.length === 0 },
        error: null 
      };
    case GET_VENDOR_ORDERS_SUCCESS:
      return { ...state, loading: { ...state.loading, orders: false }, orders: action.payload };
    case GET_VENDOR_ORDERS_FAILURE:
      return { ...state, loading: { ...state.loading, orders: false }, error: action.payload };

    case UPDATE_VENDOR_ORDER_STATUS_REQUEST:
      return { ...state, loading: { ...state.loading, updateOrder: true }, error: null };
    case UPDATE_VENDOR_ORDER_STATUS_SUCCESS:
      return { 
        ...state, 
        loading: { ...state.loading, updateOrder: false },
        orders: state.orders.map(order => 
          (order.id === action.payload.orderId || order._id === action.payload.orderId) 
            ? { ...order, orderStatus: action.payload.status } 
            : order
        )
      };
    case UPDATE_VENDOR_ORDER_STATUS_FAILURE:
      return { ...state, loading: { ...state.loading, updateOrder: false }, error: action.payload };

    case DELETE_VENDOR_ORDER_REQUEST:
      return { ...state, loading: { ...state.loading, updateOrder: true }, error: null };
    case DELETE_VENDOR_ORDER_SUCCESS:
      return { 
        ...state, 
        loading: { ...state.loading, updateOrder: false },
        orders: state.orders.filter(order => order.id !== action.payload && order._id !== action.payload)
      };
    case DELETE_VENDOR_ORDER_FAILURE:
      return { ...state, loading: { ...state.loading, updateOrder: false }, error: action.payload };

    default:
      return state;
  }
};

export default vendorReducer;
