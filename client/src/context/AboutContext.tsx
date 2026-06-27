import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { aboutService } from '../services/aboutService';
import type { AboutData } from '../services/aboutService';

interface AboutContextType {
    aboutData: AboutData | null;
    loading: boolean;
    updateAbout: (data: AboutData) => Promise<void>;
    refreshData: () => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const AboutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const data = await aboutService.get();
            if (data) setAboutData(data);
        } catch (error) {
            console.error('Failed to fetch about context data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAbout = async (data: AboutData) => {
        try {
            await aboutService.update(data);
            setAboutData(data); // Immediate local update for real-time response
        } catch (error) {
            console.error('Failed to update about context data', error);
            throw error;
        }
    };

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return (
        <AboutContext.Provider value={{ aboutData, loading, updateAbout, refreshData }}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = () => {
    const context = useContext(AboutContext);
    if (context === undefined) {
        throw new Error('useAbout must be used within an AboutProvider');
    }
    return context;
};
