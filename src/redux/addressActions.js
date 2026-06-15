export const GET_USER_ADDRESSES_REQUEST = 'GET_USER_ADDRESSES_REQUEST';
export const GET_USER_ADDRESSES_SUCCESS = 'GET_USER_ADDRESSES_SUCCESS';
export const GET_USER_ADDRESSES_FAILURE = 'GET_USER_ADDRESSES_FAILURE';

export const CREATE_ADDRESS_REQUEST = 'CREATE_ADDRESS_REQUEST';
export const CREATE_ADDRESS_SUCCESS = 'CREATE_ADDRESS_SUCCESS';
export const CREATE_ADDRESS_FAILURE = 'CREATE_ADDRESS_FAILURE';

export const UPDATE_ADDRESS_REQUEST = 'UPDATE_ADDRESS_REQUEST';
export const UPDATE_ADDRESS_SUCCESS = 'UPDATE_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_FAILURE = 'UPDATE_ADDRESS_FAILURE';

export const DELETE_ADDRESS_REQUEST = 'DELETE_ADDRESS_REQUEST';
export const DELETE_ADDRESS_SUCCESS = 'DELETE_ADDRESS_SUCCESS';
export const DELETE_ADDRESS_FAILURE = 'DELETE_ADDRESS_FAILURE';

export const getUserAddressesRequest = (userId, forceRefresh = false) => ({
  type: GET_USER_ADDRESSES_REQUEST,
  payload: { userId, forceRefresh }
});

export const getUserAddressesSuccess = (addresses) => ({
  type: GET_USER_ADDRESSES_SUCCESS,
  payload: addresses
});

export const getUserAddressesFailure = (error) => ({
  type: GET_USER_ADDRESSES_FAILURE,
  payload: error
});

export const createAddressRequest = (addressData) => ({
  type: CREATE_ADDRESS_REQUEST,
  payload: addressData
});

export const createAddressSuccess = (address) => ({
  type: CREATE_ADDRESS_SUCCESS,
  payload: address
});

export const createAddressFailure = (error) => ({
  type: CREATE_ADDRESS_FAILURE,
  payload: error
});

export const updateAddressRequest = (addressId, addressData) => ({
  type: UPDATE_ADDRESS_REQUEST,
  payload: { addressId, addressData }
});

export const updateAddressSuccess = (address) => ({
  type: UPDATE_ADDRESS_SUCCESS,
  payload: address
});

export const updateAddressFailure = (error) => ({
  type: UPDATE_ADDRESS_FAILURE,
  payload: error
});

export const deleteAddressRequest = (addressId) => ({
  type: DELETE_ADDRESS_REQUEST,
  payload: addressId
});

export const deleteAddressSuccess = (addressId) => ({
  type: DELETE_ADDRESS_SUCCESS,
  payload: addressId
});

export const deleteAddressFailure = (error) => ({
  type: DELETE_ADDRESS_FAILURE,
  payload: error
});
