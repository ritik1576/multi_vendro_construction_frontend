import { call, put, takeLatest, race, delay } from 'redux-saga/effects';
import {
  REGISTER_REQUEST,
  registerSuccess,
  registerFailure,
  LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
  ADMIN_LOGIN_REQUEST,
  adminLoginSuccess,
  adminLoginFailure,
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
    const { isVendor, ...payloadToSend } = action.payload;
    const apiCall = isVendor ? authService.vendorRegister : authService.register;

    const { responseData, timeout } = yield race({
      responseData: call(apiCall, payloadToSend),
      timeout: delay(60000)
    });

    if (timeout) {
      throw new Error('Request timed out. The server is not responding.');
    }
    
    const token = responseData.token || null;
    const { token: _, ...restData } = responseData;
    const userDetails = responseData.user || restData;
    
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
    const { role, email, password } = action.payload;
    const credentials = { email, password };
    const apiCall = role === 'vendor' ? authService.vendorLogin : authService.login;

    const { responseData, timeout } = yield race({
      responseData: call(apiCall, credentials),
      timeout: delay(60000)
    });

    if (timeout) {
      console.warn('⚠️ [Saga] Login request timed out after 60s');
      throw new Error('Request timed out. The server is not responding.');
    }
    

    // Extract token safely and create a user object with remaining data
    const token = responseData.token || null;
    const { token: _, ...restData } = responseData;
    const userDetails = responseData.user || restData;
    
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

function* handleAdminLogin(action) {
  try {
    const { email, password, navigate } = action.payload;
    const credentials = { email, password };

    const { responseData, timeout } = yield race({
      responseData: call(authService.adminLogin, credentials),
      timeout: delay(60000)
    });

    if (timeout) {
      throw new Error('Request timed out. The server is not responding.');
    }
    
    // Admin login may return { token: '...' } or { token: '...', user: {...} }
    const token = responseData.token || null;
    const { token: _, ...restData } = responseData;
    const userDetails = responseData.user || restData;
    
    // Store token
    if (token) {
      localStorage.setItem('adminToken', token);
    }
    
    yield put(adminLoginSuccess({ user: userDetails, token }));
    if (navigate) {
      navigate('/admin/dashboard');
    }
  } catch (error) {
    let errorMessage = error.message || 'An unexpected error occurred during admin login.';
    if (error.response?.data) {
      if (typeof error.response.data.message === 'string') errorMessage = error.response.data.message;
      else if (typeof error.response.data.error === 'string') errorMessage = error.response.data.error;
      else if (typeof error.response.data === 'string') errorMessage = error.response.data;
    }
    yield put(adminLoginFailure(errorMessage));
  }
}

function* handleForgotPassword(action) {
  try {
    const { responseData, timeout } = yield race({
      responseData: call(authService.forgotPassword, action.payload),
      timeout: delay(60000)
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
      timeout: delay(60000)
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
  yield takeLatest(ADMIN_LOGIN_REQUEST, handleAdminLogin);
  yield takeLatest(FORGOT_PASSWORD_REQUEST, handleForgotPassword);
  yield takeLatest(RESET_PASSWORD_REQUEST, handleResetPassword);
}
