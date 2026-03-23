import { api } from '@/services/api';
import type { AuthResponseDto, RegisterCommand, LoginCommand } from '../types';
export const authApi = {
    register: async (command: RegisterCommand): Promise<AuthResponseDto> => {
        const { data } = await api.post<AuthResponseDto>('/auth/register', command);
        return data;
    },
    login: async (command: LoginCommand): Promise<AuthResponseDto> => {
        const { data } = await api.post<AuthResponseDto>('/auth/login', command);
        return data;
    }
};