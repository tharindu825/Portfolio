import api from './api';
import type { Education, Certification, Achievement } from '../types';

export const educationService = {
    getAll: async () => {
        const response = await api.get<Education[]>('/education');
        return response.data;
    },
    create: async (data: Partial<Education>) => {
        const response = await api.post<Education>('/education', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Education>) => {
        const response = await api.put<Education>(`/education/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/education/${id}`);
    }
};

export const certificationService = {
    getAll: async () => {
        const response = await api.get<Certification[]>('/certifications');
        return response.data;
    },
    create: async (data: Partial<Certification>) => {
        const response = await api.post<Certification>('/certifications', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Certification>) => {
        const response = await api.put<Certification>(`/certifications/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/certifications/${id}`);
    }
};

export const achievementService = {
    getAll: async () => {
        const response = await api.get<Achievement[]>('/achievements');
        return response.data;
    },
    create: async (data: Partial<Achievement>) => {
        const response = await api.post<Achievement>('/achievements', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Achievement>) => {
        const response = await api.put<Achievement>(`/achievements/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        await api.delete(`/achievements/${id}`);
    }
};
