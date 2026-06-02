import { call, put, takeLatest, select } from 'redux-saga/effects';
import { cartService } from '../services/cartService';
import {
  GET_CART_REQUEST, getCartSuccess, getCartFailure,
  ADD_TO_CART_REQUEST, addToCartSuccess, addToCartFailure,
  UPDATE_CART_ITEM_REQUEST, updateCartItemSuccess, updateCartItemFailure,
  REMOVE_CART_ITEM_REQUEST, removeCartItemSuccess, removeCartItemFailure
} from '../redux/cartActions';

function* handleGetCart() {
  try {
    const response = yield call(cartService.getCart);
    const cart = response.data || response;
    yield put(getCartSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch cart';
    yield put(getCartFailure(message));
  }
}

function* handleAddToCart(action) {
  try {
    const user = yield select((state) => state.auth.user);
    const payloadWithUser = {
      ...action.payload,
      UserId: user?.id || user?.userId || user?._id || ''
    };
    const response = yield call(cartService.addToCart, payloadWithUser);
    const cart = response.data || response;
    yield put(addToCartSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item to cart';
    yield put(addToCartFailure(message));
  }
}

function* handleUpdateCartItem(action) {
  try {
    const { id, updateData } = action.payload;
    const response = yield call(cartService.updateCartItem, id, updateData);
    const cart = response.data || response;
    yield put(updateCartItemSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update cart item';
    yield put(updateCartItemFailure(message));
  }
}

function* handleRemoveCartItem(action) {
  try {
    const response = yield call(cartService.removeCartItem, action.payload);
    const cart = response.data || response;
    yield put(removeCartItemSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove cart item';
    yield put(removeCartItemFailure(message));
  }
}

export default function* cartSaga() {
  yield takeLatest(GET_CART_REQUEST, handleGetCart);
  yield takeLatest(ADD_TO_CART_REQUEST, handleAddToCart);
  yield takeLatest(UPDATE_CART_ITEM_REQUEST, handleUpdateCartItem);
  yield takeLatest(REMOVE_CART_ITEM_REQUEST, handleRemoveCartItem);
}
