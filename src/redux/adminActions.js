export const FETCH_ADMIN_USERS_REQUEST = 'FETCH_ADMIN_USERS_REQUEST';
export const FETCH_ADMIN_USERS_SUCCESS = 'FETCH_ADMIN_USERS_SUCCESS';
export const FETCH_ADMIN_USERS_FAILURE = 'FETCH_ADMIN_USERS_FAILURE';

export const FETCH_ADMIN_USER_DETAILS_REQUEST = 'FETCH_ADMIN_USER_DETAILS_REQUEST';
export const FETCH_ADMIN_USER_DETAILS_SUCCESS = 'FETCH_ADMIN_USER_DETAILS_SUCCESS';
export const FETCH_ADMIN_USER_DETAILS_FAILURE = 'FETCH_ADMIN_USER_DETAILS_FAILURE';

export const FETCH_ADMIN_VENDORS_REQUEST = 'FETCH_ADMIN_VENDORS_REQUEST';
export const FETCH_ADMIN_VENDORS_SUCCESS = 'FETCH_ADMIN_VENDORS_SUCCESS';
export const FETCH_ADMIN_VENDORS_FAILURE = 'FETCH_ADMIN_VENDORS_FAILURE';

export const FETCH_ADMIN_ORDERS_REQUEST = 'FETCH_ADMIN_ORDERS_REQUEST';
export const FETCH_ADMIN_ORDERS_SUCCESS = 'FETCH_ADMIN_ORDERS_SUCCESS';
export const FETCH_ADMIN_ORDERS_FAILURE = 'FETCH_ADMIN_ORDERS_FAILURE';

export const fetchAdminUsersRequest = () => ({
  type: FETCH_ADMIN_USERS_REQUEST,
});

export const fetchAdminUsersSuccess = (data) => ({
  type: FETCH_ADMIN_USERS_SUCCESS,
  payload: data,
});

export const fetchAdminUsersFailure = (error) => ({
  type: FETCH_ADMIN_USERS_FAILURE,
  payload: error,
});

export const fetchAdminUserDetailsRequest = (id) => ({
  type: FETCH_ADMIN_USER_DETAILS_REQUEST,
  payload: id,
});

export const fetchAdminUserDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_USER_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminUserDetailsFailure = (error) => ({
  type: FETCH_ADMIN_USER_DETAILS_FAILURE,
  payload: error,
});

export const fetchAdminVendorsRequest = () => ({
  type: FETCH_ADMIN_VENDORS_REQUEST,
});

export const fetchAdminVendorsSuccess = (data) => ({
  type: FETCH_ADMIN_VENDORS_SUCCESS,
  payload: data,
});

export const fetchAdminVendorsFailure = (error) => ({
  type: FETCH_ADMIN_VENDORS_FAILURE,
  payload: error,
});

export const fetchAdminOrdersRequest = () => ({
  type: FETCH_ADMIN_ORDERS_REQUEST,
});

export const fetchAdminOrdersSuccess = (data) => ({
  type: FETCH_ADMIN_ORDERS_SUCCESS,
  payload: data,
});

export const fetchAdminOrdersFailure = (error) => ({
  type: FETCH_ADMIN_ORDERS_FAILURE,
  payload: error,
});
