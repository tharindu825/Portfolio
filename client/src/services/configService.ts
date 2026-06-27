import api from './api';

export const configService = {
    getAll: async () => {
        const response = await api.get('/config');
        return response.data;
    },
    update: async (configData: Record<string, string>) => {
        const response = await api.put('/config', configData);
        return response.data;
    }
};
