import { api } from '@/services/api';
import type { PrivacySettingsDto, UpdatePrivacySettingsRequest } from '../types';

export const privacyApi = {
  get: () =>
    api.get<PrivacySettingsDto>('/privacy').then(r => r.data),

  update: (data: UpdatePrivacySettingsRequest) =>
    api.put<PrivacySettingsDto>('/privacy', data).then(r => r.data),
};
