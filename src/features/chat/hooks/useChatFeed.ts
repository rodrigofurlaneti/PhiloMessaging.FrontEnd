import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/chatApi';
import { useChatStore } from '@/store/useChatStore';

/**
 * useChatFeed — Hook para o feed de conversas da sidebar.
 *
 * Sincronizado com o useChatStore para que o SignalR possa atualizar
 * o feed em tempo real sem precisar recarregar da API.
 *
 * Expõe tanto `refetch` quanto `refreshFeed` como alias para compatibilidade.
 */
export const useChatFeed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatFeed = useChatStore(state => state.chatFeed);
  const setChatFeed = useChatStore(state => state.setChatFeed);
  const updateChatInFeed = useChatStore(state => state.updateChatInFeed);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatApi.getChatFeed();
      setChatFeed(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar o feed de conversas.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setChatFeed]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return {
    chats: chatFeed,
    isLoading,
    error,
    refetch: fetchFeed,       // ← alias principal (usado no ChatShell)
    refreshFeed: fetchFeed,   // ← alias de compatibilidade
    updateChatInFeed,
  };
};