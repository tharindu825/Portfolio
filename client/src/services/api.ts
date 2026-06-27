import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : `http://${window.location.hostname}:5000/api`);

export const getMediaUrl = (url: string | undefined | null) => {
    const fallbackProject = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111827'/%3E%3Crect x='240' y='150' width='120' height='100' rx='8' fill='%231f2937'/%3E%3Cpath d='M270 185 L270 215 L300 200Z' fill='%234f46e5'/%3E%3Ctext x='300' y='290' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='14'%3ENo Preview%3C/text%3E%3C/svg%3E`;

    if (!url) return fallbackProject;

    // Block broken placeholder services
    if (url.includes('via.placeholder.com')) return fallbackProject;

    // All small media is stored as base64 data URLs in MongoDB Atlas
    if (url.startsWith('data:')) return url;

    // External URLs (e.g. GitHub avatar, CDN images pasted by user)
    if (url.startsWith('http')) return url;

    // GridFS large-file streaming URLs (/api/media/:id) — prepend server origin in dev
    if (url.startsWith('/api/media/')) {
        const serverBase = import.meta.env.PROD ? '' : `http://${window.location.hostname}:5000`;
        return `${serverBase}${url}`;
    }

    // Relative URL fallback
    return url;
};


const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to add the JWT token to the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (expired tokens)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired or invalid
            localStorage.removeItem('token');
            // If we are not already on the main page/logged out state, dispatch an event or reload
            // A simple reload will trigger the App.tsx to see no token and log them out
            // But to avoid infinite loops, only do it if token was actually removed
            window.dispatchEvent(new Event('auth-expired'));
        }
        return Promise.reject(error);
    }
);

export default api;
