import { useState, useCallback } from 'react';
import { pinnedMessagesApi } from '../api/pinnedMessagesApi';
import type { PinnedMessageDto } from '../types';

export const usePinnedMessages = (chatId: number) => {
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPinned = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await pinnedMessagesApi.getAll(chatId);
      setPinnedMessages(data);
    } catch (err) {
      console.error('Failed to fetch pinned messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  const pin = async (messageId: number) => {
    const pinned = await pinnedMessagesApi.pin(chatId, messageId);
    setPinnedMessages(prev => [...prev, pinned]);
  };

  const unpin = async (messageId: number) => {
    await pinnedMessagesApi.unpin(chatId, messageId);
    setPinnedMessages(prev => prev.filter(p => p.messageId !== messageId));
  };

  return { pinnedMessages, isLoading, fetchPinned, pin, unpin };
};
