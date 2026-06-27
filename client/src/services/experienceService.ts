import api from './api';
import type { Experience } from '../types';

export const experienceService = {
    getAll: async () => {
        const response = await api.get<Experience[]>('/experiences');
        return response.data;
    },

    create: async (expData: Partial<Experience>) => {
        const response = await api.post<Experience>('/experiences', expData);
        return response.data;
    },

    update: async (id: string, expData: Partial<Experience>) => {
        const response = await api.put<Experience>(`/experiences/${id}`, expData);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/experiences/${id}`);
    },
};
