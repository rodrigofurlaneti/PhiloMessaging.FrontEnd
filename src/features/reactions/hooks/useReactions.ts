import { useState, useCallback } from 'react';
import { reactionsApi } from '../api/reactionsApi';
import type { ReactionDto } from '../types';

export const useReactions = (messageId: number | null) => {
  const [reactions, setReactions] = useState<ReactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReactions = useCallback(async () => {
    if (!messageId) return;
    setIsLoading(true);
    try {
      const data = await reactionsApi.getAll(messageId);
      setReactions(data);
    } catch (err) {
      console.error('Failed to fetch reactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messageId]);

  const addReaction = async (emoji: string) => {
    if (!messageId) return;
    await reactionsApi.addOrUpdate(messageId, { emoji });
    fetchReactions();
  };

  const removeReaction = async () => {
    if (!messageId) return;
    await reactionsApi.remove(messageId);
    fetchReactions();
  };

  return { reactions, isLoading, addReaction, removeReaction, refetch: fetchReactions };
};
