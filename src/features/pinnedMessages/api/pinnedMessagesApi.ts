import { api } from '@/services/api';
import type { PinnedMessageDto } from '../types';

export const pinnedMessagesApi = {
  getAll: (chatId: number) =>
    api.get<PinnedMessageDto[]>(`/chats/${chatId}/pinned`).then(r => r.data),

  pin: (chatId: number, messageId: number) =>
    api.post<PinnedMessageDto>(`/chats/${chatId}/pinned/${messageId}`).then(r => r.data),

  unpin: (chatId: number, messageId: number) =>
    api.delete(`/chats/${chatId}/pinned/${messageId}`),
};
