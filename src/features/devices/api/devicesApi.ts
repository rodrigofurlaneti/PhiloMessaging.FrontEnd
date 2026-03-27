import { api } from '@/services/api';
import type { UserDeviceDto, RegisterDeviceRequest } from '../types';

export const devicesApi = {
  getAll: () =>
    api.get<UserDeviceDto[]>('/devices').then(r => r.data),

  register: (data: RegisterDeviceRequest) =>
    api.post<UserDeviceDto>('/devices', data).then(r => r.data),

  remove: (deviceId: number) =>
    api.delete(`/devices/${deviceId}`),
};
