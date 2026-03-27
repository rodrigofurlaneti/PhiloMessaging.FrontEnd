export interface NotificationDto {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  payload?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}
