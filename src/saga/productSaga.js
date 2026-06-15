import { call, put, takeLatest, select } from 'redux-saga/effects';
import { productService } from '../services/productService';
import {
  GET_PRODUCTS_REQUEST,
  getProductsSuccess,
  getProductsFailure,
  GET_PRODUCT_DETAILS_REQUEST,
  getProductDetailsSuccess,
  getProductDetailsFailure,
  SEARCH_PRODUCTS_REQUEST,
  searchProductsSuccess,
  searchProductsFailure
} from '../redux/productActions';

function* handleGetProducts(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingProducts = yield select(state => state.product.products);
    
    if (!forceRefresh && existingProducts && existingProducts.length > 0) {
      yield put(getProductsSuccess(existingProducts));
      return;
    }

    const response = yield call(productService.getAllProducts);
    // Assuming the backend returns an array of products or an object with a products array
    const products = Array.isArray(response) ? response : (response.data || []);
    yield put(getProductsSuccess(products));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch products';
    yield put(getProductsFailure(message));
  }
}

function* handleGetProductDetails(action) {
  try {
    const response = yield call(productService.getProductById, action.payload);
    // Assuming response is the product object
    const product = response.data || response;
    yield put(getProductDetailsSuccess(product));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch product details';
    yield put(getProductDetailsFailure(message));
  }
}

function* handleSearchProducts(action) {
  try {
    const response = yield call(productService.searchProducts, action.payload);
    const products = Array.isArray(response) ? response : (response.data || []);
    yield put(searchProductsSuccess(products));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to search products';
    yield put(searchProductsFailure(message));
  }
}

export default function* productSaga() {
  yield takeLatest(GET_PRODUCTS_REQUEST, handleGetProducts);
  yield takeLatest(GET_PRODUCT_DETAILS_REQUEST, handleGetProductDetails);
  yield takeLatest(SEARCH_PRODUCTS_REQUEST, handleSearchProducts);
}
