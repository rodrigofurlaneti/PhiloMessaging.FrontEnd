import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import type { NotificationDto } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, count] = await Promise.all([
        notificationsApi.getAll(),
        notificationsApi.getUnreadCount(),
      ]);
      setNotifications(data);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id: number) => {
    await notificationsApi.markRead(id);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    fetchNotifications();
  };

  return { notifications, unreadCount, isLoading, markRead, markAllRead, refetch: fetchNotifications };
};
