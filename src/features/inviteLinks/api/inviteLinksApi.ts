import { api } from '@/services/api';
import type { InviteLinkDto, CreateInviteLinkRequest } from '../types';

export const inviteLinksApi = {
  getAll: (chatId: number) =>
    api.get<InviteLinkDto[]>(`/chats/${chatId}/invite-links`).then(r => r.data),

  create: (chatId: number, data?: CreateInviteLinkRequest) =>
    api.post<InviteLinkDto>(`/chats/${chatId}/invite-links`, data ?? {}).then(r => r.data),

  revoke: (chatId: number, token: string) =>
    api.delete(`/chats/${chatId}/invite-links/${token}`),
};
