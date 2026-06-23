export const GET_VENDOR_DASHBOARD_REQUEST = 'GET_VENDOR_DASHBOARD_REQUEST';
export const GET_VENDOR_DASHBOARD_SUCCESS = 'GET_VENDOR_DASHBOARD_SUCCESS';
export const GET_VENDOR_DASHBOARD_FAILURE = 'GET_VENDOR_DASHBOARD_FAILURE';

export const GET_VENDOR_STATUS_REQUEST = 'GET_VENDOR_STATUS_REQUEST';
export const GET_VENDOR_STATUS_SUCCESS = 'GET_VENDOR_STATUS_SUCCESS';
export const GET_VENDOR_STATUS_FAILURE = 'GET_VENDOR_STATUS_FAILURE';

export const GET_VENDOR_ORDERS_REQUEST = 'GET_VENDOR_ORDERS_REQUEST';
export const GET_VENDOR_ORDERS_SUCCESS = 'GET_VENDOR_ORDERS_SUCCESS';
export const GET_VENDOR_ORDERS_FAILURE = 'GET_VENDOR_ORDERS_FAILURE';

export const UPDATE_VENDOR_ORDER_STATUS_REQUEST = 'UPDATE_VENDOR_ORDER_STATUS_REQUEST';
export const UPDATE_VENDOR_ORDER_STATUS_SUCCESS = 'UPDATE_VENDOR_ORDER_STATUS_SUCCESS';
export const UPDATE_VENDOR_ORDER_STATUS_FAILURE = 'UPDATE_VENDOR_ORDER_STATUS_FAILURE';

export const DELETE_VENDOR_ORDER_REQUEST = 'DELETE_VENDOR_ORDER_REQUEST';
export const DELETE_VENDOR_ORDER_SUCCESS = 'DELETE_VENDOR_ORDER_SUCCESS';
export const DELETE_VENDOR_ORDER_FAILURE = 'DELETE_VENDOR_ORDER_FAILURE';

export const GET_VENDOR_KYC_STATUS_REQUEST = 'GET_VENDOR_KYC_STATUS_REQUEST';
export const GET_VENDOR_KYC_STATUS_SUCCESS = 'GET_VENDOR_KYC_STATUS_SUCCESS';
export const GET_VENDOR_KYC_STATUS_FAILURE = 'GET_VENDOR_KYC_STATUS_FAILURE';

export const getVendorDashboardRequest = (userId, forceRefresh = false) => ({
  type: GET_VENDOR_DASHBOARD_REQUEST,
  payload: { userId, forceRefresh }
});

export const getVendorDashboardSuccess = (data) => ({
  type: GET_VENDOR_DASHBOARD_SUCCESS,
  payload: data
});

export const getVendorDashboardFailure = (error) => ({
  type: GET_VENDOR_DASHBOARD_FAILURE,
  payload: error
});

export const getVendorStatusRequest = (vendorId, forceRefresh = false) => ({
  type: GET_VENDOR_STATUS_REQUEST,
  payload: { vendorId, forceRefresh }
});

export const getVendorStatusSuccess = (data) => ({
  type: GET_VENDOR_STATUS_SUCCESS,
  payload: data
});

export const getVendorStatusFailure = (error) => ({
  type: GET_VENDOR_STATUS_FAILURE,
  payload: error
});

export const getVendorOrdersRequest = (vendorId, forceRefresh = false) => ({
  type: GET_VENDOR_ORDERS_REQUEST,
  payload: { vendorId, forceRefresh }
});

export const getVendorOrdersSuccess = (data) => ({
  type: GET_VENDOR_ORDERS_SUCCESS,
  payload: data
});

export const getVendorOrdersFailure = (error) => ({
  type: GET_VENDOR_ORDERS_FAILURE,
  payload: error
});

export const updateVendorOrderStatusRequest = (vendorId, orderId, status) => ({
  type: UPDATE_VENDOR_ORDER_STATUS_REQUEST,
  payload: { vendorId, orderId, status }
});

export const updateVendorOrderStatusSuccess = (orderId, status) => ({
  type: UPDATE_VENDOR_ORDER_STATUS_SUCCESS,
  payload: { orderId, status }
});

export const updateVendorOrderStatusFailure = (error) => ({
  type: UPDATE_VENDOR_ORDER_STATUS_FAILURE,
  payload: error
});

export const deleteVendorOrderRequest = (vendorId, orderId) => ({
  type: DELETE_VENDOR_ORDER_REQUEST,
  payload: { vendorId, orderId }
});

export const deleteVendorOrderSuccess = (orderId) => ({
  type: DELETE_VENDOR_ORDER_SUCCESS,
  payload: orderId
});

export const deleteVendorOrderFailure = (error) => ({
  type: DELETE_VENDOR_ORDER_FAILURE,
  payload: error
});

export const getVendorKycStatusRequest = (vendorId, forceRefresh = false) => ({
  type: GET_VENDOR_KYC_STATUS_REQUEST,
  payload: { vendorId, forceRefresh }
});

export const getVendorKycStatusSuccess = (data) => ({
  type: GET_VENDOR_KYC_STATUS_SUCCESS,
  payload: data
});

export const getVendorKycStatusFailure = (error) => ({
  type: GET_VENDOR_KYC_STATUS_FAILURE,
  payload: error
});
