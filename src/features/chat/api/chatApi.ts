import { api } from '@/services/api';
import type { ChatDto, ChatFeedItemDto, CreateChatRequest, SendMessageSagaResult, MessageDto } from '../types';
export const chatApi = {
    getMessages: async (chatId: number, page = 1, pageSize = 50): Promise<MessageDto[]> => {
        const response = await api.get<MessageDto[]>(`/chats/${chatId}/messages`, {
            params: { page, pageSize }
        });
        return response.data;
    },
    sendMessageText: async (chatId: number, content: string): Promise<SendMessageSagaResult> => {
        const request = {
            type: 1,
            content: content,
            contentEncrypted: true
        };
        const response = await api.post<SendMessageSagaResult>(`/chats/${chatId}/messages`, request);
        return response.data;
    },
    createChat: async (request: CreateChatRequest): Promise<ChatDto> => {
        const response = await api.post<ChatDto>('/chats', request);
        return response.data;
    },
    getChatFeed: async (): Promise<ChatFeedItemDto[]> => {
        const response = await api.get<ChatFeedItemDto[]>('/chats/feed');
        return response.data;
    },
    joinViaLink: async (token: string): Promise<void> => {
        await api.post(`/chats/join/${token}`);
    }
};