import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:61799/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
const TOKEN_KEY = '@PhiloMessaging:token';
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        console.error(
            `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
            error.response?.data || error.message
        );
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn('Sessão expirada ou Token inválido. Limpando credenciais...');
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('@PhiloMessaging:user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        const errorMessage = error.response?.data?.message || error.message;
        return Promise.reject(new Error(errorMessage));
    }
);