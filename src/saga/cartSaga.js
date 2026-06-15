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
    const user = yield select((state) => state.auth.user);
    const cartState = yield select((state) => state.cart.cart);
    const userId = user?.id || user?.userId || user?._id || cartState?.data?.userId || cartState?.userId || '';
    const response = yield call(cartService.getCart, userId);
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
    const cartState = yield select((state) => state.cart.cart);
    const userId = user?.id || user?.userId || user?._id || cartState?.data?.userId || cartState?.userId || '';
    
    const payloadWithUser = {
      ...action.payload,
      UserID: user?.id || user?.userId || user?._id || ''
    };
    yield call(cartService.addToCart, payloadWithUser);
    yield put({ type: 'GET_CART_REQUEST' });
    const cart = yield select((state) => state.cart.cart);
    yield put(addToCartSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item to cart';
    yield put(addToCartFailure(message));
  }
}

function* handleUpdateCartItem(action) {
  try {
    const user = yield select((state) => state.auth.user);
    const userId = user?.id || user?.userId || user?._id || '';

    const payloadWithUser = {
      ...action.payload,
      UserID: userId
    };

    yield call(cartService.updateCartItem, payloadWithUser);
    yield put({ type: 'GET_CART_REQUEST' });
    const cart = yield select((state) => state.cart.cart);
    yield put(updateCartItemSuccess(cart));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update cart item';
    yield put(updateCartItemFailure(message));
  }
}

function* handleRemoveCartItem(action) {
  try {
    yield call(cartService.removeCartItem, action.payload);
    
    // Optimistic update
    const currentCart = yield select((state) => state.cart.cart);
    let optimisticCart = null;
    if (currentCart) {
      if (Array.isArray(currentCart)) {
        optimisticCart = currentCart.filter(item => (item.id || item.cartItemId || item.cartitemID || item._id) !== action.payload);
      } else if (currentCart.items) {
        optimisticCart = {
          ...currentCart,
          items: currentCart.items.filter(item => (item.id || item.cartItemId || item.cartitemID || item._id) !== action.payload)
        };
      }
    }
    
    yield put(removeCartItemSuccess(optimisticCart || currentCart));
    yield put({ type: 'GET_CART_REQUEST' });
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
