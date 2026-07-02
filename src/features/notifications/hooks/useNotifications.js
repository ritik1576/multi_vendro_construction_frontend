import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../services/notificationService';
import { getNotificationsRequest, getNotificationsSuccess } from '../../../redux/notificationActions';

export const useNotifications = (role) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading: isLoading, error } = useSelector(state => state.notification);

  const fetchNotifications = useCallback(() => {
    dispatch(getNotificationsRequest());
  }, [dispatch]);

  // Initial fetch only if not loaded yet
  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const countData = await notificationService.getUnreadCount();
      dispatch(getNotificationsSuccess({ notifications, unreadCount: countData?.count || 0 }));
    } catch (err) {
      console.error('Failed to refresh unread count:', err);
    }
  }, [dispatch, notifications]);

  const markAsRead = useCallback(async (id) => {
    const updatedNotifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    const updatedUnreadCount = Math.max(0, unreadCount - 1);
    dispatch(getNotificationsSuccess({ notifications: updatedNotifications, unreadCount: updatedUnreadCount }));
    try {
      await notificationService.markAsRead(id);
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, notifications, unreadCount, refreshUnreadCount, fetchNotifications]);

  const markAsUnread = useCallback(async (id) => {
    const updatedNotifications = notifications.map(n => n.id === id ? { ...n, isRead: false } : n);
    const updatedUnreadCount = unreadCount + 1;
    dispatch(getNotificationsSuccess({ notifications: updatedNotifications, unreadCount: updatedUnreadCount }));
    try {
      await notificationService.markAsUnread(id);
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, notifications, unreadCount, refreshUnreadCount, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    dispatch(getNotificationsSuccess({ notifications: updatedNotifications, unreadCount: 0 }));
    try {
      await notificationService.markAllAsRead();
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, notifications, refreshUnreadCount, fetchNotifications]);

  const markAllAsUnread = useCallback(async () => {
    const readNotifications = notifications.filter(n => n.isRead);
    if (readNotifications.length === 0) return;
    
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: false }));
    const updatedUnreadCount = unreadCount + readNotifications.length;
    dispatch(getNotificationsSuccess({ notifications: updatedNotifications, unreadCount: updatedUnreadCount }));
    
    try {
      await Promise.all(readNotifications.map(n => notificationService.markAsUnread(n.id)));
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, notifications, unreadCount, refreshUnreadCount, fetchNotifications]);

  const deleteNotification = useCallback(async (id) => {
    const notif = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(n => n.id !== id);
    const updatedUnreadCount = notif && !notif.isRead ? Math.max(0, unreadCount - 1) : unreadCount;
    dispatch(getNotificationsSuccess({ notifications: updatedNotifications, unreadCount: updatedUnreadCount }));
    try {
      await notificationService.deleteNotification(id);
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, notifications, unreadCount, refreshUnreadCount, fetchNotifications]);

  const deleteAllNotifications = useCallback(async () => {
    dispatch(getNotificationsSuccess({ notifications: [], unreadCount: 0 }));
    try {
      await notificationService.deleteAllNotifications();
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [dispatch, refreshUnreadCount, fetchNotifications]);

  return {
    notifications,
    isLoading,
    unreadCount,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markAllAsUnread,
    deleteNotification,
    deleteAllNotifications
  };
};
