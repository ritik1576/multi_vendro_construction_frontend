import { call, put, takeLatest, select } from 'redux-saga/effects';
import { getVendorDashboard, getVendorStatus, getVendorOrders, updateOrderStatus, deleteVendorOrder } from '../services/vendorApi';
import {
  GET_VENDOR_DASHBOARD_REQUEST,
  getVendorDashboardSuccess,
  getVendorDashboardFailure,
  GET_VENDOR_STATUS_REQUEST,
  getVendorStatusSuccess,
  getVendorStatusFailure,
  GET_VENDOR_ORDERS_REQUEST,
  getVendorOrdersSuccess,
  getVendorOrdersFailure,
  UPDATE_VENDOR_ORDER_STATUS_REQUEST,
  updateVendorOrderStatusSuccess,
  updateVendorOrderStatusFailure,
  DELETE_VENDOR_ORDER_REQUEST,
  deleteVendorOrderSuccess,
  deleteVendorOrderFailure
} from '../redux/vendorActions';

function* handleGetVendorDashboard(action) {
  try {
    const { userId, forceRefresh } = action.payload;
    const existingDashboard = yield select(state => state.vendor?.dashboard);
    
    if (!forceRefresh && existingDashboard) {
      yield put(getVendorDashboardSuccess(existingDashboard));
      return;
    }

    const response = yield call(getVendorDashboard, userId);
    yield put(getVendorDashboardSuccess(response));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch vendor dashboard';
    yield put(getVendorDashboardFailure(message));
  }
}

function* handleGetVendorStatus(action) {
  try {
    const { vendorId, forceRefresh } = action.payload;
    const existingStatus = yield select(state => state.vendor?.status);
    
    if (!forceRefresh && existingStatus) {
      yield put(getVendorStatusSuccess(existingStatus));
      return;
    }

    const response = yield call(getVendorStatus, vendorId);
    yield put(getVendorStatusSuccess(response));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch vendor status';
    yield put(getVendorStatusFailure(message));
  }
}

function* handleGetVendorOrders(action) {
  try {
    const { vendorId, forceRefresh } = action.payload;
    const existingOrders = yield select(state => state.vendor?.orders);
    
    if (!forceRefresh && existingOrders && existingOrders.length > 0) {
      yield put(getVendorOrdersSuccess(existingOrders));
      return;
    }

    const response = yield call(getVendorOrders, vendorId);
    yield put(getVendorOrdersSuccess(response));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch vendor orders';
    yield put(getVendorOrdersFailure(message));
  }
}

function* handleUpdateVendorOrderStatus(action) {
  try {
    const { vendorId, orderId, status } = action.payload;
    yield call(updateOrderStatus, vendorId, orderId, status);
    yield put(updateVendorOrderStatusSuccess(orderId, status));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status';
    yield put(updateVendorOrderStatusFailure(message));
  }
}

function* handleDeleteVendorOrder(action) {
  try {
    const { vendorId, orderId } = action.payload;
    yield call(deleteVendorOrder, vendorId, orderId);
    yield put(deleteVendorOrderSuccess(orderId));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete order';
    yield put(deleteVendorOrderFailure(message));
  }
}

export default function* vendorSaga() {
  yield takeLatest(GET_VENDOR_DASHBOARD_REQUEST, handleGetVendorDashboard);
  yield takeLatest(GET_VENDOR_STATUS_REQUEST, handleGetVendorStatus);
  yield takeLatest(GET_VENDOR_ORDERS_REQUEST, handleGetVendorOrders);
  yield takeLatest(UPDATE_VENDOR_ORDER_STATUS_REQUEST, handleUpdateVendorOrderStatus);
  yield takeLatest(DELETE_VENDOR_ORDER_REQUEST, handleDeleteVendorOrder);
}
