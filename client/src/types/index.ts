// Experience types
export interface Experience {
    id: string;
    companyName: string;
    role: string;
    startDate: string;
    endDate: string;
    shortDescription: string;
    fullDescription: string;
    logoUrl?: string;
}

// Project types
export interface ProjectMedia {
    id: string;
    projectId: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export interface Project {
    id: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    techStack: string[];
    githubUrl: string;
    liveUrl: string;
    status: 'Completed' | 'Ongoing';
    media: ProjectMedia[];
}

// Education types
export interface Education {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description?: string;
    logoUrl?: string;
}

// Certification types
export interface Certification {
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    logoUrl?: string;
    imageUrls?: string[];
}

// Achievement types
export interface Achievement {
    id: string;
    title: string;
    date: string;
    description: string;
    issuer?: string;
    imageUrls?: string[];
}

// User types
export interface User {
    username: string;
    isAdmin: boolean;
}
