import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import type { ChatFeedItemDto } from '../types';

export const useChatFeed = () => {
    const [chats, setChats] = useState<ChatFeedItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchFeed = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await chatApi.getChatFeed();
            setChats(data);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao carregar o feed de conversas.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);
    const updateChatInFeed = (updatedChat: ChatFeedItemDto) => {
        setChats(prev => {
            const filtered = prev.filter(c => c.chatId !== updatedChat.chatId);
            return [updatedChat, ...filtered]; 
        });
    };
    return {
        chats,
        isLoading,
        error,
        refreshFeed: fetchFeed,
        updateChatInFeed
    };
};