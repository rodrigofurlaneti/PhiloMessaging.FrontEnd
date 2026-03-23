import axios from 'axios';
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, 
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@PhiloMessaging:token');

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
            console.warn('Sessão expirada ou Token inválido. Redirecionando...');
        }
        return Promise.reject(error);
    }
);