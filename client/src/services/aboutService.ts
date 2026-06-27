import api from './api';

export interface AboutData {
    heroTitle: string;
    heroMainTitlePrefix?: string;
    heroMainTitleGradient?: string;
    heroMainTitleSuffix?: string;
    availabilityText?: string;
    heroSubtitle: string;
    headline: string;
    profilePhotoUrl: string;
    email: string;
    phone: string;
    location: string;
    bioTitle: string;
    bioContent: string;
    yearsExperience: number;
    projectsCompleted: number;
    techStackCount: number;
    skills?: string[];
    defaultTheme?: string;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    heroDescription?: string;
    footerAbout?: string;
    footerCopyright?: string;
}

export const aboutService = {
    get: async () => {
        const response = await api.get<AboutData>('/about');
        return response.data;
    },
    update: async (data: AboutData) => {
        const response = await api.put<AboutData>('/about', data);
        return response.data;
    }
};
