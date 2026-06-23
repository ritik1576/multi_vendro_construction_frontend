import {
  GET_WALLET_BALANCE_REQUEST,
  GET_WALLET_BALANCE_SUCCESS,
  GET_WALLET_BALANCE_FAILURE,
  GET_WALLET_TRANSACTIONS_REQUEST,
  GET_WALLET_TRANSACTIONS_SUCCESS,
  GET_WALLET_TRANSACTIONS_FAILURE,
  ADD_WALLET_MONEY_REQUEST,
  ADD_WALLET_MONEY_SUCCESS,
  ADD_WALLET_MONEY_FAILURE,
  ADD_WALLET_MONEY_RESET,
  WITHDRAW_WALLET_MONEY_REQUEST,
  WITHDRAW_WALLET_MONEY_SUCCESS,
  WITHDRAW_WALLET_MONEY_FAILURE,
  WITHDRAW_WALLET_MONEY_RESET,
} from './walletActions';

const initialState = {
  balanceData: null,
  loading: false,
  error: null,
  transactionsData: null,
  transactionsLoading: false,
  transactionsError: null,
  addMoneyLoading: false,
  addMoneyError: null,
  addMoneySuccess: false,
  withdrawMoneyLoading: false,
  withdrawMoneyError: null,
  withdrawMoneySuccess: false,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WALLET_BALANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_WALLET_BALANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        balanceData: action.payload,
        error: null,
      };
    case GET_WALLET_BALANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_WALLET_TRANSACTIONS_REQUEST:
      return {
        ...state,
        transactionsLoading: true,
        transactionsError: null,
      };
    case GET_WALLET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactionsLoading: false,
        transactionsData: action.payload,
        transactionsError: null,
      };
    case GET_WALLET_TRANSACTIONS_FAILURE:
      return {
        ...state,
        transactionsLoading: false,
        transactionsError: action.payload,
      };
    case ADD_WALLET_MONEY_REQUEST:
      return {
        ...state,
        addMoneyLoading: true,
        addMoneyError: null,
        addMoneySuccess: false,
      };
    case ADD_WALLET_MONEY_SUCCESS:
      return {
        ...state,
        addMoneyLoading: false,
        addMoneySuccess: true,
        addMoneyError: null,
      };
    case ADD_WALLET_MONEY_FAILURE:
      return {
        ...state,
        addMoneyLoading: false,
        addMoneyError: action.payload,
        addMoneySuccess: false,
      };
    case ADD_WALLET_MONEY_RESET:
      return {
        ...state,
        addMoneyLoading: false,
        addMoneyError: null,
        addMoneySuccess: false,
      };
    case WITHDRAW_WALLET_MONEY_REQUEST:
      return {
        ...state,
        withdrawMoneyLoading: true,
        withdrawMoneyError: null,
        withdrawMoneySuccess: false,
      };
    case WITHDRAW_WALLET_MONEY_SUCCESS:
      return {
        ...state,
        withdrawMoneyLoading: false,
        withdrawMoneySuccess: true,
        withdrawMoneyError: null,
      };
    case WITHDRAW_WALLET_MONEY_FAILURE:
      return {
        ...state,
        withdrawMoneyLoading: false,
        withdrawMoneyError: action.payload,
        withdrawMoneySuccess: false,
      };
    case WITHDRAW_WALLET_MONEY_RESET:
      return {
        ...state,
        withdrawMoneyLoading: false,
        withdrawMoneyError: null,
        withdrawMoneySuccess: false,
      };
    default:
      return state;
  }
};

export default walletReducer;
