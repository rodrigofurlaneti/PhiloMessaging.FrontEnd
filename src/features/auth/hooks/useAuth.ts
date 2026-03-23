import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { LoginCommand, AuthResponseDto } from '../types';
const TOKEN_KEY = '@PhiloMessaging:token';
const USER_KEY = '@PhiloMessaging:user';
export const useAuth = () => {
    const [user, setUser] = useState<AuthResponseDto | null>(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const login = async (command: LoginCommand) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(command);
            localStorage.setItem(TOKEN_KEY, response.accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(response));
            setUser(response);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Erro ao realizar login';
            setError(message);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };
    return {
        user,
        login,
        logout,
        isLoading,
        error,
        isAuthenticated: !!user
    };
};