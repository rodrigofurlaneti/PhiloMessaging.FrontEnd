import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/usersApi';
import type { UserProfileDto } from '../types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.getMe();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return { profile, isLoading, refetch: fetchProfile };
};
