import { useState } from 'react';
import { authApi } from '../api/authApi';
import type { RegisterCommand, AuthResponseDto } from '../types';
const TOKEN_KEY = '@PhiloMessaging:token';
const USER_KEY = '@PhiloMessaging:user';
export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (command: RegisterCommand): Promise<AuthResponseDto | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.register(command);

            // AUTO-LOGIN: Persiste o token e os dados do usuário após o sucesso
            // Note o uso de 'response.token' para bater com o DTO do C#
            if (response && response.token) {
                localStorage.setItem(TOKEN_KEY, response.token);
                localStorage.setItem(USER_KEY, JSON.stringify(response));
            }

            return response;
        } catch (err: any) {
            // Captura a mensagem real enviada pelo FluentValidation no Backend
            const message = err.response?.data?.message || err.message || 'Erro ao realizar o registro.';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
};