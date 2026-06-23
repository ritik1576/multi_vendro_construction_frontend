import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import productSaga from './productSaga';
import categorySaga from './categorySaga';
import cartSaga from './cartSaga';
import orderSaga from './orderSaga';
import adminSaga from './adminSaga';
import addressSaga from './addressSaga';
import vendorSaga from './vendorSaga';
import walletSaga from './walletSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    productSaga(),
    categorySaga(),
    cartSaga(),
    orderSaga(),
    adminSaga(),
    addressSaga(),
    vendorSaga(),
    walletSaga(),
  ]);
}
