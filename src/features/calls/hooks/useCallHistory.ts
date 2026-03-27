import { useState, useEffect, useCallback } from 'react';
import { callsApi } from '../api/callsApi';
import type { CallDto } from '../types';

export const useCallHistory = () => {
  const [calls, setCalls] = useState<CallDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await callsApi.getHistory();
      setCalls(data);
    } catch (err) {
      console.error('Failed to fetch call history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  return { calls, isLoading, refetch: fetchCalls };
};
