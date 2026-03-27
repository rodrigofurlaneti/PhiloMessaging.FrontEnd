import { api } from '@/services/api';
import type { PollDto, CreatePollRequest, VotePollRequest } from '../types';

export const pollsApi = {
  create: (data: CreatePollRequest) =>
    api.post<PollDto>('/polls', data).then(r => r.data),

  get: (messageId: number) =>
    api.get<PollDto>(`/polls/${messageId}`).then(r => r.data),

  vote: (data: VotePollRequest) =>
    api.post('/polls/vote', data),

  removeVote: (pollOptionId: number) =>
    api.delete(`/polls/vote/${pollOptionId}`),
};
