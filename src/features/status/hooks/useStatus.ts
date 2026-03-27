import { useState, useEffect, useCallback } from 'react';
import { statusApi } from '../api/statusApi';
import type { UserStatusDto } from '../types';

export const useStatus = () => {
  const [myStatuses, setMyStatuses] = useState<UserStatusDto[]>([]);
  const [contactStatuses, setContactStatuses] = useState<UserStatusDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true);
    try {
      const [mine, contacts] = await Promise.all([
        statusApi.getMine(),
        statusApi.getContacts(),
      ]);
      setMyStatuses(mine);
      setContactStatuses(contacts);
    } catch (err) {
      console.error('Failed to fetch statuses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

  return { myStatuses, contactStatuses, isLoading, refetch: fetchStatuses };
};
