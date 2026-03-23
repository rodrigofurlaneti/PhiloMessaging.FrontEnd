import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { LoginCommand, AuthResponseDto } from '../types';

export const useAuth = () => {
    const [user, setUser] = useState<AuthResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (command: LoginCommand) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(command);
            setUser(response);
            // Aqui você salvaria o token no LocalStorage ou Zustand
            localStorage.setItem('token', response.accessToken);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar login');
        } finally {
            setIsLoading(false);
        }
    };

    return { user, login, isLoading, error };
};