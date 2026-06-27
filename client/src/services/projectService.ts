import api from './api';
import type { Project } from '../types';

export const projectService = {
    getAll: async () => {
        const response = await api.get<Project[]>('/projects');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    create: async (projectData: Partial<Project>) => {
        const response = await api.post<Project>('/projects', projectData);
        return response.data;
    },

    update: async (id: string, projectData: Partial<Project>) => {
        const response = await api.put<Project>(`/projects/${id}`, projectData);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/projects/${id}`);
    },
};
