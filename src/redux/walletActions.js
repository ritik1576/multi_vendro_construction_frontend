export const GET_WALLET_BALANCE_REQUEST = 'GET_WALLET_BALANCE_REQUEST';
export const GET_WALLET_BALANCE_SUCCESS = 'GET_WALLET_BALANCE_SUCCESS';
export const GET_WALLET_BALANCE_FAILURE = 'GET_WALLET_BALANCE_FAILURE';

export const GET_WALLET_TRANSACTIONS_REQUEST = 'GET_WALLET_TRANSACTIONS_REQUEST';
export const GET_WALLET_TRANSACTIONS_SUCCESS = 'GET_WALLET_TRANSACTIONS_SUCCESS';
export const GET_WALLET_TRANSACTIONS_FAILURE = 'GET_WALLET_TRANSACTIONS_FAILURE';

export const getWalletBalanceRequest = () => ({
  type: GET_WALLET_BALANCE_REQUEST,
});

export const getWalletBalanceSuccess = (balanceData) => ({
  type: GET_WALLET_BALANCE_SUCCESS,
  payload: balanceData,
});

export const getWalletBalanceFailure = (error) => ({
  type: GET_WALLET_BALANCE_FAILURE,
  payload: error,
});

export const getWalletTransactionsRequest = (page = 1, pageSize = 10) => ({
  type: GET_WALLET_TRANSACTIONS_REQUEST,
  payload: { page, pageSize },
});

export const getWalletTransactionsSuccess = (transactionsData) => ({
  type: GET_WALLET_TRANSACTIONS_SUCCESS,
  payload: transactionsData,
});

export const getWalletTransactionsFailure = (error) => ({
  type: GET_WALLET_TRANSACTIONS_FAILURE,
  payload: error,
});

export const ADD_WALLET_MONEY_REQUEST = 'ADD_WALLET_MONEY_REQUEST';
export const ADD_WALLET_MONEY_SUCCESS = 'ADD_WALLET_MONEY_SUCCESS';
export const ADD_WALLET_MONEY_FAILURE = 'ADD_WALLET_MONEY_FAILURE';
export const ADD_WALLET_MONEY_RESET = 'ADD_WALLET_MONEY_RESET';

export const addWalletMoneyRequest = (amount) => ({
  type: ADD_WALLET_MONEY_REQUEST,
  payload: { amount },
});

export const addWalletMoneySuccess = (data) => ({
  type: ADD_WALLET_MONEY_SUCCESS,
  payload: data,
});

export const addWalletMoneyFailure = (error) => ({
  type: ADD_WALLET_MONEY_FAILURE,
  payload: error,
});

export const addWalletMoneyReset = () => ({
  type: ADD_WALLET_MONEY_RESET,
});

export const WITHDRAW_WALLET_MONEY_REQUEST = 'WITHDRAW_WALLET_MONEY_REQUEST';
export const WITHDRAW_WALLET_MONEY_SUCCESS = 'WITHDRAW_WALLET_MONEY_SUCCESS';
export const WITHDRAW_WALLET_MONEY_FAILURE = 'WITHDRAW_WALLET_MONEY_FAILURE';
export const WITHDRAW_WALLET_MONEY_RESET = 'WITHDRAW_WALLET_MONEY_RESET';

export const withdrawWalletMoneyRequest = (amount) => ({
  type: WITHDRAW_WALLET_MONEY_REQUEST,
  payload: { amount },
});

export const withdrawWalletMoneySuccess = (data) => ({
  type: WITHDRAW_WALLET_MONEY_SUCCESS,
  payload: data,
});

export const withdrawWalletMoneyFailure = (error) => ({
  type: WITHDRAW_WALLET_MONEY_FAILURE,
  payload: error,
});

export const withdrawWalletMoneyReset = () => ({
  type: WITHDRAW_WALLET_MONEY_RESET,
});
