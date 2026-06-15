import { call, put, takeLatest, select } from 'redux-saga/effects';
import { addressService } from '../services/addressService';
import {
  GET_USER_ADDRESSES_REQUEST,
  getUserAddressesSuccess,
  getUserAddressesFailure,
  CREATE_ADDRESS_REQUEST,
  createAddressSuccess,
  createAddressFailure,
  UPDATE_ADDRESS_REQUEST,
  updateAddressSuccess,
  updateAddressFailure,
  DELETE_ADDRESS_REQUEST,
  deleteAddressSuccess,
  deleteAddressFailure
} from '../redux/addressActions';

function* handleGetUserAddresses(action) {
  try {
    const { userId, forceRefresh } = action.payload;
    const existingAddresses = yield select(state => state.address.addresses);
    
    // Cache check: return if addresses are already loaded and not forcing a refresh
    if (!forceRefresh && existingAddresses && existingAddresses.length > 0) {
      yield put(getUserAddressesSuccess(existingAddresses));
      return;
    }

    const response = yield call(addressService.getUserAddresses, userId);
    const fetchedAddresses = Array.isArray(response) ? response : (response.data || []);
    
    const mappedAddresses = fetchedAddresses.map(addr => ({
      id: addr.id || addr._id,
      name: addr.fullName,
      phone: addr.phone,
      line1: addr.addressLine1,
      line2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.postalCode,
      country: addr.country || 'India',
      addressType: addr.addressType || 'Home',
      isDefault: addr.isDefault
    }));

    yield put(getUserAddressesSuccess(mappedAddresses));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch addresses';
    yield put(getUserAddressesFailure(message));
  }
}

function* handleCreateAddress(action) {
  try {
    const response = yield call(addressService.createAddress, action.payload);
    const responseData = response.data || response;
    
    const savedAddress = {
      id: responseData.id || responseData._id || Date.now(),
      name: responseData.fullName || action.payload.fullName,
      phone: responseData.phone || action.payload.phone,
      line1: responseData.addressLine1 || action.payload.addressLine1,
      line2: responseData.addressLine2 || action.payload.addressLine2 || '',
      city: responseData.city || action.payload.city,
      state: responseData.state || action.payload.state,
      pincode: responseData.postalCode || action.payload.postalCode,
      country: responseData.country || action.payload.country || 'India',
      addressType: responseData.addressType || action.payload.addressType || 'Home',
      isDefault: responseData.isDefault || action.payload.isDefault
    };
    
    yield put(createAddressSuccess(savedAddress));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create address';
    yield put(createAddressFailure(message));
  }
}

function* handleUpdateAddress(action) {
  try {
    const { addressId, addressData } = action.payload;
    const response = yield call(addressService.updateAddress, addressId, addressData);
    const responseData = response.data || response;
    
    const savedAddress = {
      id: responseData.id || addressId,
      name: responseData.fullName || addressData.fullName,
      phone: responseData.phone || addressData.phone,
      line1: responseData.addressLine1 || addressData.addressLine1,
      line2: responseData.addressLine2 || addressData.addressLine2 || '',
      city: responseData.city || addressData.city,
      state: responseData.state || addressData.state,
      pincode: responseData.postalCode || addressData.postalCode,
      country: responseData.country || addressData.country || 'India',
      addressType: responseData.addressType || addressData.addressType || 'Home',
      isDefault: responseData.isDefault || addressData.isDefault
    };
    
    yield put(updateAddressSuccess(savedAddress));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update address';
    yield put(updateAddressFailure(message));
  }
}

function* handleDeleteAddress(action) {
  try {
    yield call(addressService.deleteAddress, action.payload);
    yield put(deleteAddressSuccess(action.payload));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete address';
    yield put(deleteAddressFailure(message));
  }
}

export default function* addressSaga() {
  yield takeLatest(GET_USER_ADDRESSES_REQUEST, handleGetUserAddresses);
  yield takeLatest(CREATE_ADDRESS_REQUEST, handleCreateAddress);
  yield takeLatest(UPDATE_ADDRESS_REQUEST, handleUpdateAddress);
  yield takeLatest(DELETE_ADDRESS_REQUEST, handleDeleteAddress);
}
