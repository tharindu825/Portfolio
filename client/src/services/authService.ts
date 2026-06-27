import api from './api';

export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await api.post<{ token: string; username: string }>('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },
};
