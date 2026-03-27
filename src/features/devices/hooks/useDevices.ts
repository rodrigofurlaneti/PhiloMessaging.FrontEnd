import { useState, useEffect, useCallback } from 'react';
import { devicesApi } from '../api/devicesApi';
import type { UserDeviceDto } from '../types';

export const useDevices = () => {
  const [devices, setDevices] = useState<UserDeviceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await devicesApi.getAll();
      setDevices(data);
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const removeDevice = async (deviceId: number) => {
    await devicesApi.remove(deviceId);
    fetchDevices();
  };

  return { devices, isLoading, removeDevice, refetch: fetchDevices };
};
