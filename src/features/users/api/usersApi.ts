import { api } from '@/services/api';

export interface UserProfileDto {
  userId: number;
  username: string | null;
  isAuthenticated: boolean;
}

export const usersApi = {
  /**
   * GET /api/v1/users/me
   * Retorna o perfil do usuário autenticado (dados do JWT).
   */
  getProfile: async (): Promise<UserProfileDto> => {
    const { data } = await api.get<UserProfileDto>('/users/me');
    return data;
  },
};
