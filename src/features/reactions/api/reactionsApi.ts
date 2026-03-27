import { api } from '@/services/api';
import type { ReactionDto, AddReactionRequest } from '../types';

export const reactionsApi = {
  getAll: (messageId: number) =>
    api.get<ReactionDto[]>(`/messages/${messageId}/reactions`).then(r => r.data),

  addOrUpdate: (messageId: number, data: AddReactionRequest) =>
    api.post<ReactionDto>(`/messages/${messageId}/reactions`, data).then(r => r.data),

  remove: (messageId: number) =>
    api.delete(`/messages/${messageId}/reactions`),
};
