import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import { useChatStore } from '@/store/useChatStore';
import type { AnyMessage } from '../types';

/**
 * useMessages — Hook de mensagens com suporte ao padrão SAGA.
 *
 * Integrado ao useChatStore para:
 * - Persistir mensagens localmente (permite mensagens otimistas)
 * - Expor `refetch` para recarregar sob demanda
 * - Suporte a atualização via SignalR (appendIncomingMessage)
 */
export const useMessages = (chatId: number | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesByChatId = useChatStore(state => state.messagesByChatId);
  const setMessages = useChatStore(state => state.setMessages);

  const messages: AnyMessage[] = chatId ? (messagesByChatId[chatId] ?? []) : [];

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatApi.getMessages(chatId);
      setMessages(chatId, data);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Não foi possível carregar as mensagens.');
    } finally {
      setIsLoading(false);
    }
  }, [chatId, setMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    refetch: fetchMessages, // ← exposto para uso no ChatShell
  };
};