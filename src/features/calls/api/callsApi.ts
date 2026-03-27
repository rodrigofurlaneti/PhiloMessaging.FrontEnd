import { api } from '@/services/api';
import type { CallDto, InitiateCallRequest, UpdateCallStatusRequest } from '../types';

export const callsApi = {
  initiate: (data: InitiateCallRequest) =>
    api.post<CallDto>('/calls', data).then(r => r.data),

  getHistory: (page = 1, pageSize = 20) =>
    api.get<CallDto[]>('/calls/history', { params: { page, pageSize } }).then(r => r.data),

  getById: (callId: number) =>
    api.get<CallDto>(`/calls/${callId}`).then(r => r.data),

  updateStatus: (callId: number, data: UpdateCallStatusRequest) =>
    api.patch<CallDto>(`/calls/${callId}/status`, data).then(r => r.data),

  join: (callId: number) =>
    api.post(`/calls/${callId}/join`),

  leave: (callId: number) =>
    api.post(`/calls/${callId}/leave`),
};
