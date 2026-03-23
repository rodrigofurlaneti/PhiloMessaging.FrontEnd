import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponseDto, LoginCommand } from '../../auth/types';
import { authApi } from '../../auth/api/authApi';

interface AuthContextData {
    user: AuthResponseDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (command: LoginCommand) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persistência da sessão ao carregar o App
    useEffect(() => {
        const savedUser = localStorage.getItem('@PhiloMessaging:user');
        const token = localStorage.getItem('@PhiloMessaging:token');
        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Sessão corrompida:", e);
                localStorage.removeItem('@PhiloMessaging:user');
                localStorage.removeItem('@PhiloMessaging:token');
            }
        }
    }, []);

    const login = async (command: LoginCommand) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authApi.login(command);

            // 1. Persiste nos storages
            localStorage.setItem('@PhiloMessaging:token', data.accessToken);
            localStorage.setItem('@PhiloMessaging:user', JSON.stringify(data));

            // 2. Atualiza o estado global - Isso dispara o re-render do App.tsx na hora!
            setUser(data);
        } catch (err: any) {
            // Captura a mensagem vinda do seu Backend C# (DomainException)
            const message = err.response?.data?.Message || err.response?.data?.message || 'Erro na autenticação';
            setError(message);
            throw err; // Lança para o componente tratar se necessário (ex: parar animações)
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('@PhiloMessaging:token');
        localStorage.removeItem('@PhiloMessaging:user');
        setUser(null);
        // Opcional: window.location.href = '/'; para limpar estados de outros hooks
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para consumir o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};