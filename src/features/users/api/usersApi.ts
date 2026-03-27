import { api } from '@/services/api';
import type { UserProfileDto, UpdateProfileRequest, UpdateAvatarRequest } from '../types';

export const usersApi = {
  getMe: () =>
    api.get<UserProfileDto>('/users/me').then(r => r.data),

  getById: (userId: number) =>
    api.get<UserProfileDto>(`/users/${userId}`).then(r => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<UserProfileDto>('/users/me', data).then(r => r.data),

  updateAvatar: (data: UpdateAvatarRequest) =>
    api.patch('/users/me/avatar', data),

  deleteAccount: () =>
    api.delete('/users/me'),
};
