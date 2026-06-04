export const GET_ORDERS_REQUEST = 'GET_ORDERS_REQUEST';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_FAILURE = 'GET_ORDERS_FAILURE';

export const GET_ORDER_DETAILS_REQUEST = 'GET_ORDER_DETAILS_REQUEST';
export const GET_ORDER_DETAILS_SUCCESS = 'GET_ORDER_DETAILS_SUCCESS';
export const GET_ORDER_DETAILS_FAILURE = 'GET_ORDER_DETAILS_FAILURE';

export const PLACE_ORDER_REQUEST = 'PLACE_ORDER_REQUEST';
export const PLACE_ORDER_SUCCESS = 'PLACE_ORDER_SUCCESS';
export const PLACE_ORDER_FAILURE = 'PLACE_ORDER_FAILURE';

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';

export const TRACK_ORDER_REQUEST = 'TRACK_ORDER_REQUEST';
export const TRACK_ORDER_SUCCESS = 'TRACK_ORDER_SUCCESS';
export const TRACK_ORDER_FAILURE = 'TRACK_ORDER_FAILURE';

export const getOrdersRequest = (userId) => ({ type: GET_ORDERS_REQUEST, payload: userId });
export const getOrdersSuccess = (orders) => ({ type: GET_ORDERS_SUCCESS, payload: orders });
export const getOrdersFailure = (error) => ({ type: GET_ORDERS_FAILURE, payload: error });

export const getOrderDetailsRequest = (id) => ({ type: GET_ORDER_DETAILS_REQUEST, payload: id });
export const getOrderDetailsSuccess = (order) => ({ type: GET_ORDER_DETAILS_SUCCESS, payload: order });
export const getOrderDetailsFailure = (error) => ({ type: GET_ORDER_DETAILS_FAILURE, payload: error });

export const placeOrderRequest = (orderData) => ({ type: PLACE_ORDER_REQUEST, payload: orderData });
export const placeOrderSuccess = (order) => ({ type: PLACE_ORDER_SUCCESS, payload: order });
export const placeOrderFailure = (error) => ({ type: PLACE_ORDER_FAILURE, payload: error });

export const cancelOrderRequest = (id) => ({ type: CANCEL_ORDER_REQUEST, payload: id });
export const cancelOrderSuccess = (order) => ({ type: CANCEL_ORDER_SUCCESS, payload: order });
export const cancelOrderFailure = (error) => ({ type: CANCEL_ORDER_FAILURE, payload: error });

export const trackOrderRequest = (id) => ({ type: TRACK_ORDER_REQUEST, payload: id });
export const trackOrderSuccess = (trackingInfo) => ({ type: TRACK_ORDER_SUCCESS, payload: trackingInfo });
export const trackOrderFailure = (error) => ({ type: TRACK_ORDER_FAILURE, payload: error });
