import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (role) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [data, countData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      
      const mappedData = (data || []).map(n => ({
        ...n,
        timestamp: n.createdAt || n.timestamp
      }));
      
      setNotifications(mappedData);
      setUnreadCount(countData?.count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData?.count || 0);
    } catch (err) {
      console.error('Failed to refresh unread count:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await notificationService.markAsRead(id);
      await refreshUnreadCount();
    } catch (err) {
      // Revert on failure
      fetchNotifications();
    }
  }, [refreshUnreadCount, fetchNotifications]);

  const markAsUnread = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n));
    setUnreadCount(prev => prev + 1);
    try {
      await notificationService.markAsUnread(id);
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [refreshUnreadCount, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationService.markAllAsRead();
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [refreshUnreadCount, fetchNotifications]);

  const markAllAsUnread = useCallback(async () => {
    const readNotifications = notifications.filter(n => n.isRead);
    if (readNotifications.length === 0) return;
    
    setNotifications(prev => prev.map(n => ({ ...n, isRead: false })));
    setUnreadCount(prev => prev + readNotifications.length);
    
    try {
      await Promise.all(readNotifications.map(n => notificationService.markAsUnread(n.id)));
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [notifications, refreshUnreadCount, fetchNotifications]);

  const deleteNotification = useCallback(async (id) => {
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    try {
      await notificationService.deleteNotification(id);
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [notifications, refreshUnreadCount, fetchNotifications]);

  const deleteAllNotifications = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await notificationService.deleteAllNotifications();
      await refreshUnreadCount();
    } catch (err) {
      fetchNotifications();
    }
  }, [refreshUnreadCount, fetchNotifications]);

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
