import { call, put, takeLatest } from 'redux-saga/effects';
import {
  REGISTER_REQUEST,
  registerSuccess,
  registerFailure,
  LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
  FORGOT_PASSWORD_REQUEST,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  RESET_PASSWORD_REQUEST,
  resetPasswordSuccess,
  resetPasswordFailure
} from '../redux/authActions';
import authService from '../services/authService';

function* handleRegister(action) {
  try {
    const responseData = yield call(authService.register, action.payload);
    
    const userDetails = responseData.user || responseData;
    const token = responseData.token || null;
    
    yield put(registerSuccess({ user: userDetails, token }));
    alert('Account created successfully!');
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred during registration.';
      
    yield put(registerFailure(errorMessage));
  }
}

function* handleLogin(action) {
  try {
    const responseData = yield call(authService.login, action.payload);
    
    const userDetails = responseData.user || responseData;
    const token = responseData.token || null;
    
    yield put(loginSuccess({ user: userDetails, token }));
    alert('Logged in successfully!');
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred during login.';
      
    yield put(loginFailure(errorMessage));
  }
}

function* handleForgotPassword(action) {
  try {
    const responseData = yield call(authService.forgotPassword, action.payload);
    yield put(forgotPasswordSuccess(responseData.message || 'Reset link sent successfully!'));
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred while sending reset link.';
      
    yield put(forgotPasswordFailure(errorMessage));
  }
}

function* handleResetPassword(action) {
  try {
    const responseData = yield call(authService.resetPassword, action.payload);
    yield put(resetPasswordSuccess(responseData.message || 'Password reset successfully!'));
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred while resetting password.';
      
    yield put(resetPasswordFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(FORGOT_PASSWORD_REQUEST, handleForgotPassword);
  yield takeLatest(RESET_PASSWORD_REQUEST, handleResetPassword);
}
