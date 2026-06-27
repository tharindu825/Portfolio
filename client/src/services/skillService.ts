import api from './api';

export interface SkillSectionData {
    id?: string;
    title: string;
    skills: string[];
}

export const skillService = {
    getAll: async (): Promise<SkillSectionData[]> => {
        const response = await api.get('/skills');
        return response.data;
    },

    create: async (data: SkillSectionData): Promise<SkillSectionData> => {
        const response = await api.post('/skills', data);
        return response.data;
    },

    update: async (id: string, data: SkillSectionData): Promise<SkillSectionData> => {
        const response = await api.put(`/skills/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/skills/${id}`);
    }
};
