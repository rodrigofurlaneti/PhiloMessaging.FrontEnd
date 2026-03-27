import { api } from '@/services/api';
import type { NotificationDto } from '../types';

export const notificationsApi = {
  getAll: (page = 1, pageSize = 20) =>
    api.get<NotificationDto[]>('/notifications', { params: { page, pageSize } }).then(r => r.data),

  getUnreadCount: () =>
    api.get<number>('/notifications/unread-count').then(r => r.data),

  markRead: (notificationId: number) =>
    api.patch(`/notifications/${notificationId}/read`),

  markAllRead: () =>
    api.post('/notifications/mark-all-read'),
};
