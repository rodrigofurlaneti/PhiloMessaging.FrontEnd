import { useState, useCallback } from 'react';
import { pollsApi } from '../api/pollsApi';
import type { PollDto } from '../types';

export const usePolls = () => {
  const [poll, setPoll] = useState<PollDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPoll = useCallback(async (messageId: number) => {
    setIsLoading(true);
    try {
      const data = await pollsApi.get(messageId);
      setPoll(data);
    } catch (err) {
      console.error('Failed to fetch poll:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const vote = async (messageId: number, optionId: number) => {
    await pollsApi.vote({ optionId });
    fetchPoll(messageId);
  };

  const removeVote = async (messageId: number, pollOptionId: number) => {
    await pollsApi.removeVote(pollOptionId);
    fetchPoll(messageId);
  };

  return { poll, isLoading, fetchPoll, vote, removeVote };
};
