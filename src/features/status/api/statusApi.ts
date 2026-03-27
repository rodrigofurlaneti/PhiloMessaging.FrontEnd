import { api } from '@/services/api';
import type { UserStatusDto, StatusViewDto, CreateStatusRequest } from '../types';

export const statusApi = {
  create: (data: CreateStatusRequest) =>
    api.post<UserStatusDto>('/status', data).then(r => r.data),

  getMine: () =>
    api.get<UserStatusDto[]>('/status/mine').then(r => r.data),

  getContacts: () =>
    api.get<UserStatusDto[]>('/status/contacts').then(r => r.data),

  view: (statusId: number) =>
    api.post(`/status/${statusId}/view`),

  getViews: (statusId: number) =>
    api.get<StatusViewDto[]>(`/status/${statusId}/views`).then(r => r.data),

  delete: (statusId: number) =>
    api.delete(`/status/${statusId}`),
};
