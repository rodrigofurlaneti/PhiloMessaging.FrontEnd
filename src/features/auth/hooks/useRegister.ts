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
            if (response && response.accessToken) {
                localStorage.setItem(TOKEN_KEY, response.accessToken);
                localStorage.setItem(USER_KEY, JSON.stringify({
                    userId: response.userId,
                    displayName: response.displayName,
                    phoneNumber: response.phoneNumber,
                    countryCode: response.countryCode
                }));
            }
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Erro ao realizar o registro.';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
};