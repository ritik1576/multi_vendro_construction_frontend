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
      ProductName: action.payload.productName || action.payload.productname || action.payload.name,
      Quantity: action.payload.quantity,
      userId: userId
    };
    yield call(cartService.addToCart, payloadWithUser);
    yield put(addToCartSuccess(cartState));
    yield put({ type: GET_CART_REQUEST });
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item to cart';
    yield put(addToCartFailure(message));
  }
}

function* handleUpdateCartItem(action) {
  try {
    const user = yield select((state) => state.auth.user);
    const cartState = yield select((state) => state.cart.cart);
    const userId = user?.id || user?.userId || user?._id || cartState?.data?.userId || cartState?.userId || '';
    
    const { item, quantity } = action.payload;
    const updateData = {
      ProductName: item.productName || item.name || item.ProductName,
      Quantity: quantity,
      userId: userId,
      CartId: item.cartItemId || item.id
    };
    
    yield call(cartService.updateCartItem, updateData);
    yield put(updateCartItemSuccess(cartState));
    yield put({ type: GET_CART_REQUEST });
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update cart item';
    yield put(updateCartItemFailure(message));
  }
}

function* handleRemoveCartItem(action) {
  try {
    const cartState = yield select((state) => state.cart.cart);
    yield call(cartService.removeCartItem, action.payload);
    yield put(removeCartItemSuccess(cartState));
    yield put({ type: GET_CART_REQUEST });
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
