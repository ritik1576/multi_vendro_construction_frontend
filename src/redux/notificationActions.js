export const GET_NOTIFICATIONS_REQUEST = 'GET_NOTIFICATIONS_REQUEST';
export const GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS';
export const GET_NOTIFICATIONS_FAILURE = 'GET_NOTIFICATIONS_FAILURE';

export const getNotificationsRequest = () => ({
  type: GET_NOTIFICATIONS_REQUEST
});

export const getNotificationsSuccess = (payload) => ({
  type: GET_NOTIFICATIONS_SUCCESS,
  payload
});

export const getNotificationsFailure = (error) => ({
  type: GET_NOTIFICATIONS_FAILURE,
  payload: error
});
