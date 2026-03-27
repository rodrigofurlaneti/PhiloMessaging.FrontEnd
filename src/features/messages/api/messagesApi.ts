import { api } from '@/services/api';

export const messagesApi = {
  markRead: (chatId: number, messageId: number) =>
    api.patch(`/chats/${chatId}/messages/${messageId}/read`),

  deleteForEveryone: (chatId: number, messageId: number) =>
    api.delete(`/chats/${chatId}/messages/${messageId}/for-everyone`),
};
