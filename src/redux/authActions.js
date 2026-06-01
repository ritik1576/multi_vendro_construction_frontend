export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

export const loginRequest = (payload) => ({ type: LOGIN_REQUEST, payload });
export const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const registerRequest = (payload) => ({ type: REGISTER_REQUEST, payload });
export const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
export const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const forgotPasswordRequest = (payload) => ({ type: FORGOT_PASSWORD_REQUEST, payload });
export const forgotPasswordSuccess = (message) => ({ type: FORGOT_PASSWORD_SUCCESS, payload: message });
export const forgotPasswordFailure = (error) => ({ type: FORGOT_PASSWORD_FAILURE, payload: error });

export const resetPasswordRequest = (payload) => ({ type: RESET_PASSWORD_REQUEST, payload });
export const resetPasswordSuccess = (message) => ({ type: RESET_PASSWORD_SUCCESS, payload: message });
export const resetPasswordFailure = (error) => ({ type: RESET_PASSWORD_FAILURE, payload: error });
