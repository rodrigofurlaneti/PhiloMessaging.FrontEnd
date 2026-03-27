import { api } from '@/services/api';
import type { ChatMemberDto, AddMemberRequest } from '../types';

export const chatMembersApi = {
  getMembers: (chatId: number) =>
    api.get<ChatMemberDto[]>(`/chats/${chatId}/members`).then(r => r.data),

  addMember: (chatId: number, data: AddMemberRequest) =>
    api.post<ChatMemberDto>(`/chats/${chatId}/members`, data).then(r => r.data),

  removeMember: (chatId: number, userId: number) =>
    api.delete(`/chats/${chatId}/members/${userId}`),

  promote: (chatId: number, userId: number) =>
    api.patch(`/chats/${chatId}/members/${userId}/promote`),

  demote: (chatId: number, userId: number) =>
    api.patch(`/chats/${chatId}/members/${userId}/demote`),
};
