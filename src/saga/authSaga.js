import { call, put, takeLatest, race, delay } from 'redux-saga/effects';
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
    const { responseData, timeout } = yield race({
      responseData: call(authService.register, action.payload),
      timeout: delay(5000)
    });

    if (timeout) {
      throw new Error('Request timed out. The server is not responding.');
    }
    
    const userDetails = responseData.user || responseData;
    const token = responseData.token || null;
    
    yield put(registerSuccess({ user: userDetails, token }));
    alert('Account created successfully!');
  } catch (error) {
    let errorMessage = error.message || 'An unexpected error occurred during registration.';
    if (error.response?.data) {
      if (typeof error.response.data.message === 'string') errorMessage = error.response.data.message;
      else if (typeof error.response.data.error === 'string') errorMessage = error.response.data.error;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    }
    yield put(registerFailure(errorMessage));
  }
}

function* handleLogin(action) {
  try {

    const { responseData, timeout } = yield race({
      responseData: call(authService.login, action.payload),
      timeout: delay(5000)
    });

    if (timeout) {
      console.warn('⚠️ [Saga] Login request timed out after 5s');
      throw new Error('Request timed out. The server is not responding.');
    }
    

    const userDetails = responseData.user || responseData;
    const token = responseData.token || null;
    
    yield put(loginSuccess({ user: userDetails, token }));

    alert('Logged in successfully!');
  } catch (error) {
    console.error('❌ [Saga] Login Error Caught:', error);
    let errorMessage = error.message || 'An unexpected error occurred during login.';
    if (error.response?.data) {
      if (typeof error.response.data.message === 'string') errorMessage = error.response.data.message;
      else if (typeof error.response.data.error === 'string') errorMessage = error.response.data.error;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    }
    yield put(loginFailure(errorMessage));
  }
}

function* handleForgotPassword(action) {
  try {
    const { responseData, timeout } = yield race({
      responseData: call(authService.forgotPassword, action.payload),
      timeout: delay(5000)
    });

    if (timeout) {
      throw new Error('Request timed out. The server is not responding.');
    }

    yield put(forgotPasswordSuccess(responseData.message || 'Reset link sent successfully!'));
  } catch (error) {
    let errorMessage = error.message || 'An unexpected error occurred while sending reset link.';
    if (error.response?.data) {
      if (typeof error.response.data.message === 'string') errorMessage = error.response.data.message;
      else if (typeof error.response.data.error === 'string') errorMessage = error.response.data.error;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    }
    yield put(forgotPasswordFailure(errorMessage));
  }
}

function* handleResetPassword(action) {
  try {
    const { responseData, timeout } = yield race({
      responseData: call(authService.resetPassword, action.payload),
      timeout: delay(5000)
    });

    if (timeout) {
      throw new Error('Request timed out. The server is not responding.');
    }

    yield put(resetPasswordSuccess(responseData.message || 'Password reset successfully!'));
  } catch (error) {
    let errorMessage = error.message || 'An unexpected error occurred while resetting password.';
    if (error.response?.data) {
      if (typeof error.response.data.message === 'string') errorMessage = error.response.data.message;
      else if (typeof error.response.data.error === 'string') errorMessage = error.response.data.error;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    }
    yield put(resetPasswordFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(FORGOT_PASSWORD_REQUEST, handleForgotPassword);
  yield takeLatest(RESET_PASSWORD_REQUEST, handleResetPassword);
}
