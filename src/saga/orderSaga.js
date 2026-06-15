import { call, put, takeLatest, select } from 'redux-saga/effects';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import {
  GET_ORDERS_REQUEST, getOrdersSuccess, getOrdersFailure,
  GET_ORDER_DETAILS_REQUEST, getOrderDetailsSuccess, getOrderDetailsFailure,
  PLACE_ORDER_REQUEST, placeOrderSuccess, placeOrderFailure,
  CANCEL_ORDER_REQUEST, cancelOrderSuccess, cancelOrderFailure,
  TRACK_ORDER_REQUEST, trackOrderSuccess, trackOrderFailure
} from '../redux/orderActions';

function* handleGetOrders(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingOrders = yield select(state => state.order.orders);
    
    if (!forceRefresh && existingOrders && existingOrders.length > 0) {
      yield put(getOrdersSuccess(existingOrders));
      return;
    }

    const response = yield call(orderService.getOrders, action.payload);
    const orders = Array.isArray(response) ? response : (response.data || []);
    yield put(getOrdersSuccess(orders));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch orders';
    yield put(getOrdersFailure(message));
  }
}

function* handleGetOrderDetails(action) {
  try {
    const response = yield call(orderService.getOrderById, action.payload);
    const order = response.data || response;
    yield put(getOrderDetailsSuccess(order));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch order details';
    yield put(getOrderDetailsFailure(message));
  }
}

function* handlePlaceOrder(action) {
  try {
    const response = yield call(orderService.placeOrder, action.payload);
    const order = response.data || response;
    yield put(placeOrderSuccess(order));
    
    // Clear cart items that were successfully ordered
    if (action.payload.items && action.payload.items.length > 0) {
      for (const item of action.payload.items) {
        if (item.cartItemId) {
          try {
            yield call(cartService.removeCartItem, item.cartItemId);
          } catch (e) {
            console.error("Failed to remove cart item after order:", e);
          }
        }
      }
      // Refresh the cart to reflect the cleared items
      yield put({ type: 'GET_CART_REQUEST' });
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to place order';
    yield put(placeOrderFailure(message));
  }
}

function* handleCancelOrder(action) {
  try {
    const response = yield call(orderService.cancelOrder, action.payload);
    const order = response.data || response;
    yield put(cancelOrderSuccess(order));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to cancel order';
    yield put(cancelOrderFailure(message));
  }
}

function* handleTrackOrder(action) {
  try {
    const response = yield call(orderService.trackOrder, action.payload);
    const trackingInfo = response.data || response;
    yield put(trackOrderSuccess(trackingInfo));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to track order';
    yield put(trackOrderFailure(message));
  }
}

export default function* orderSaga() {
  yield takeLatest(GET_ORDERS_REQUEST, handleGetOrders);
  yield takeLatest(GET_ORDER_DETAILS_REQUEST, handleGetOrderDetails);
  yield takeLatest(PLACE_ORDER_REQUEST, handlePlaceOrder);
  yield takeLatest(CANCEL_ORDER_REQUEST, handleCancelOrder);
  yield takeLatest(TRACK_ORDER_REQUEST, handleTrackOrder);
}
