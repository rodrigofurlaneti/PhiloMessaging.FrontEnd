import { api } from '@/services/api';
import type { ChatDto, ChatFeedItemDto, CreateChatRequest } from '../types';
export const chatApi = {
    createChat: async (request: CreateChatRequest): Promise<ChatDto> => {
        const response = await api.post<ChatDto>('/chats', request);
        return response.data;
    },
    joinViaLink: async (token: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(`/chats/join/${token}`);
        return response.data;
    },
    getChatFeed: async (): Promise<ChatFeedItemDto[]> => {
        const response = await api.get<ChatFeedItemDto[]>('/chats/feed');
        return response.data;
    }
};