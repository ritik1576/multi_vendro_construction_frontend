import { call, put, takeLatest, delay } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
  REGISTER_REQUEST,
  registerSuccess,
  registerFailure
} from '../redux/authActions';

// Simulated API calls
const apiLogin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({ id: 1, name: 'Test User', email: credentials.email, role: credentials.role || 'Customer' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1500);
  });
};

const apiRegister = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        resolve({ id: 2, ...userData });
      } else {
        reject(new Error('Registration failed'));
      }
    }, 1500);
  });
};

function* handleLogin(action) {
  try {
    const user = yield call(apiLogin, action.payload);
    yield put(loginSuccess(user));
    // Optional: add redirection here or handle it in component
    alert('Logged in successfully!');
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action) {
  try {
    const user = yield call(apiRegister, action.payload);
    yield put(registerSuccess(user));
    alert('Account created successfully!');
  } catch (error) {
    yield put(registerFailure(error.message));
  }
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(REGISTER_REQUEST, handleRegister);
}
