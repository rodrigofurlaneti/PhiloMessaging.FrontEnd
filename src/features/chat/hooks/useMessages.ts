// src/features/chat/hooks/useMessages.ts
import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';

export const useMessages = (chatId: number | undefined) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                // Aqui você usa o chatApi para buscar as mensagens
                const data = await chatApi.getMessages(chatId);
                setMessages(data);
            } catch (error) {
                console.error("Erro ao carregar mensagens:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chatId]);

    return { messages, isLoading };
};