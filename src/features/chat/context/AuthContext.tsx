import React, { createContext, useContext, useState, useEffect } from 'react';
// CORREÇÃO TS1484: Usando 'import type' para satisfazer o verbatimModuleSyntax
import type { AuthResponseDto } from '../../auth/types';

interface AuthContextData {
    user: AuthResponseDto | null;
    isAuthenticated: boolean;
    login: (data: AuthResponseDto) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponseDto | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('@PhiloMessaging:user');
        const token = localStorage.getItem('@PhiloMessaging:token');
        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Erro ao recuperar sessão:", e);
                localStorage.removeItem('@PhiloMessaging:user');
            }
        }
    }, []);

    const login = (data: AuthResponseDto) => {
        // Sincronizado com seu Swagger: accessToken
        localStorage.setItem('@PhiloMessaging:token', data.accessToken);
        localStorage.setItem('@PhiloMessaging:user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('@PhiloMessaging:token');
        localStorage.removeItem('@PhiloMessaging:user');
        setUser(null);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);