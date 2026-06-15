import { call, put, takeLatest, select } from 'redux-saga/effects';
import { productService } from '../services/productService';
import {
  GET_CATEGORIES_REQUEST,
  getCategoriesSuccess,
  getCategoriesFailure
} from '../redux/categoryActions';

function* handleGetCategories(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingCategories = yield select(state => state.category.categories);
    
    if (!forceRefresh && existingCategories && existingCategories.length > 0) {
      yield put(getCategoriesSuccess(existingCategories));
      return;
    }

    const response = yield call(productService.getCategories);
    const categories = Array.isArray(response) ? response : (response.data || []);
    yield put(getCategoriesSuccess(categories));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch categories';
    yield put(getCategoriesFailure(message));
  }
}

export default function* categorySaga() {
  yield takeLatest(GET_CATEGORIES_REQUEST, handleGetCategories);
}
