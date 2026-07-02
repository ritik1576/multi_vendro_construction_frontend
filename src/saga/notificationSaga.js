import { call, put, takeLatest, select } from 'redux-saga/effects';
import { notificationService } from '../features/notifications/services/notificationService';
import {
  GET_NOTIFICATIONS_REQUEST,
  getNotificationsSuccess,
  getNotificationsFailure
} from '../redux/notificationActions';

function* handleGetNotifications(action) {
  try {
    const existingNotifications = yield select(state => state.notification.notifications);
    if (existingNotifications && existingNotifications.length > 0) {
      // Already fetched and cached
      return;
    }

    const [data, countData] = yield Promise.all([
      notificationService.getNotifications(),
      notificationService.getUnreadCount()
    ]);
    
    const mappedData = (data || []).map(n => ({
      ...n,
      timestamp: n.createdAt || n.timestamp
    }));
    
    yield put(getNotificationsSuccess({
      notifications: mappedData,
      unreadCount: countData?.count || 0
    }));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch notifications';
    yield put(getNotificationsFailure(message));
  }
}

export default function* notificationSaga() {
  yield takeLatest(GET_NOTIFICATIONS_REQUEST, handleGetNotifications);
}
