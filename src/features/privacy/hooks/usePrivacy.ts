import { useState, useEffect, useCallback } from 'react';
import { privacyApi } from '../api/privacyApi';
import type { PrivacySettingsDto, UpdatePrivacySettingsRequest } from '../types';

export const usePrivacy = () => {
  const [settings, setSettings] = useState<PrivacySettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await privacyApi.get();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch privacy settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSettings = async (data: UpdatePrivacySettingsRequest) => {
    const updated = await privacyApi.update(data);
    setSettings(updated);
  };

  return { settings, isLoading, updateSettings, refetch: fetchSettings };
};
