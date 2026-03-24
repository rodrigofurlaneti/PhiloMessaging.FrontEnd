// src/features/chat/hooks/useMessages.ts
import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chatApi';

export const useMessages = (chatId: number | undefined) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!chatId) return;
        setIsLoading(true);
        try {
            const data = await chatApi.getMessages(chatId);
            setMessages(data);
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        } finally {
            setIsLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return { messages, isLoading, refetch: fetchMessages };
};