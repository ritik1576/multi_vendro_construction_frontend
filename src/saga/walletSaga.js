import { call, put, takeLatest } from 'redux-saga/effects';
import { walletService } from '../services/walletService';
import {
  GET_WALLET_BALANCE_REQUEST,
  getWalletBalanceSuccess,
  getWalletBalanceFailure,
  GET_WALLET_TRANSACTIONS_REQUEST,
  getWalletTransactionsSuccess,
  getWalletTransactionsFailure,
  ADD_WALLET_MONEY_REQUEST,
  addWalletMoneySuccess,
  addWalletMoneyFailure,
  WITHDRAW_WALLET_MONEY_REQUEST,
  withdrawWalletMoneySuccess,
  withdrawWalletMoneyFailure,
  getWalletBalanceRequest,
  getWalletTransactionsRequest,
} from '../redux/walletActions';

function* handleGetWalletBalance() {
  try {
    const response = yield call(walletService.getBalance);
    const balanceData = response.data || response;
    yield put(getWalletBalanceSuccess(balanceData));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch wallet balance';
    yield put(getWalletBalanceFailure(message));
  }
}

function* handleGetWalletTransactions(action) {
  try {
    const { page, pageSize } = action.payload || { page: 1, pageSize: 10 };
    const response = yield call(walletService.getTransactions, page, pageSize);
    yield put(getWalletTransactionsSuccess(response));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch wallet transactions';
    yield put(getWalletTransactionsFailure(message));
  }
}

function* handleAddWalletMoney(action) {
  try {
    const { amount } = action.payload;
    const response = yield call(walletService.addMoney, amount);
    yield put(addWalletMoneySuccess(response));
    
    // Refresh wallet data after successful addition
    yield put(getWalletBalanceRequest());
    yield put(getWalletTransactionsRequest());
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add money to wallet';
    yield put(addWalletMoneyFailure(message));
  }
}

function* handleWithdrawWalletMoney(action) {
  try {
    const { amount } = action.payload;
    const response = yield call(walletService.withdrawMoney, amount);
    yield put(withdrawWalletMoneySuccess(response));
    
    // Refresh wallet data after successful withdrawal
    yield put(getWalletBalanceRequest());
    yield put(getWalletTransactionsRequest());
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to withdraw money from wallet';
    yield put(withdrawWalletMoneyFailure(message));
  }
}

export default function* walletSaga() {
  yield takeLatest(GET_WALLET_BALANCE_REQUEST, handleGetWalletBalance);
  yield takeLatest(GET_WALLET_TRANSACTIONS_REQUEST, handleGetWalletTransactions);
  yield takeLatest(ADD_WALLET_MONEY_REQUEST, handleAddWalletMoney);
  yield takeLatest(WITHDRAW_WALLET_MONEY_REQUEST, handleWithdrawWalletMoney);
}
