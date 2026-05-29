import { call, put, takeLatest } from 'redux-saga/effects';
import {
  REGISTER_REQUEST,
  registerSuccess,
  registerFailure
} from '../redux/authActions';
import authService from '../services/authService';
import { setToken } from '../utils/token';

function* handleRegister(action) {
  try {
    const responseData = yield call(authService.register, action.payload);
    
    // Check if a token was returned and persist it
    if (responseData.token) {
      setToken(responseData.token);
    }
    
    // Store user data in Redux (fallback to the whole response if user object isn't wrapped)
    const userDetails = responseData.user || responseData;
    
    yield put(registerSuccess(userDetails));
    alert('Account created successfully!');
  } catch (error) {
    // Extract backend error message cleanly
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred during registration.';
      
    yield put(registerFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(REGISTER_REQUEST, handleRegister);
}
