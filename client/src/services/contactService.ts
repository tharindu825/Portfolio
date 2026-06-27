import api from './api';

export interface ContactData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactService = {
    sendEmail: async (data: ContactData) => {
        const response = await api.post('/contact', data);
        return response.data;
    }
};
