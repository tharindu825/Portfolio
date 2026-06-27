import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, alpha } from '@mui/material/styles';
import { aboutService } from '../services/aboutService';

export type ThemeName = 'dark' | 'light' | 'corporate' | 'slate' | 'ocean' | 'purple' | 'emerald' | 'midnight';

interface ThemeContextType {
    currentTheme: ThemeName;
    setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'light',
    setTheme: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

const getThemeOptions = (name: ThemeName) => {
    let primaryMain = '#7c4dff';
    let secondaryMain = '#00e5ff';
    let backgroundDefault = '#0a192f';
    let backgroundPaper = '#112240';
    let mode: 'light' | 'dark' = 'dark';
    let textPrimary = '#ccd6f6';
    let textSecondary = '#8892b0';

    switch (name) {
        case 'light':
            mode = 'light';
            primaryMain = '#2563eb'; // Blue
            secondaryMain = '#db2777'; // Pink - "that super"
            backgroundDefault = '#f8fafc';
            backgroundPaper = '#ffffff';
            textPrimary = '#1d4ed8'; // standard blue instead of black
            textSecondary = '#475569';
            break;
        case 'corporate':
            mode = 'light';
            primaryMain = '#1e40af'; // Professional Navy Blue
            secondaryMain = '#64748b'; // Steel Blue / Slate Gray
            backgroundDefault = '#f3f2ef';
            backgroundPaper = '#ffffff';
            textPrimary = '#1e293b'; // Very Dark Blue-Slate
            textSecondary = '#475569';
            break;
        case 'slate':
            mode = 'dark';
            primaryMain = '#3b82f6';
            secondaryMain = '#60a5fa';
            backgroundDefault = '#0f172a';
            backgroundPaper = '#1e293b';
            textPrimary = '#f8fafc';
            textSecondary = '#94a3b8';
            break;
        case 'ocean':
            mode = 'dark';
            primaryMain = '#2dd4bf'; // Bright Teal
            secondaryMain = '#a5f3fc'; // Light Aqua
            backgroundDefault = '#002d36'; // Deep Ocean Teal
            backgroundPaper = '#003a46';
            textPrimary = '#f0fdfa'; // Soft Mint-White
            textSecondary = '#99f6e4';
            break;
        case 'purple':
            mode = 'light';
            primaryMain = '#7c3aed'; // Deep Violet
            secondaryMain = '#db2777'; // Fuchsia Pink - "that super"
            backgroundDefault = '#faf5ff'; // Lavender White
            backgroundPaper = '#ffffff';
            textPrimary = '#2e1065'; // Deep Plum letters
            textSecondary = '#5b21b6';
            break;
        case 'emerald':
            mode = 'dark';
            primaryMain = '#10b981'; // Vivid Emerald
            secondaryMain = '#d1fae5'; // Mint White
            backgroundDefault = '#050505'; // Obsidian Black
            backgroundPaper = '#0f0f0f'; // Lighter Obsidian
            textPrimary = '#f8fafc'; // Pure White
            textSecondary = '#94a3b8';
            break;
        case 'midnight':
            mode = 'dark';
            primaryMain = '#3b82f6'; // Bright Electric Blue
            secondaryMain = '#ffffff'; // Stark White
            backgroundDefault = '#000000'; // Pure Black
            backgroundPaper = '#080808'; // Darkest Gray
            textPrimary = '#ffffff'; // High Contrast
            textSecondary = '#94a3b8';
            break;
        case 'dark':
        default:
            mode = 'dark';
            primaryMain = '#7c4dff';
            secondaryMain = '#00e5ff';
            backgroundDefault = '#0a192f';
            backgroundPaper = '#112240';
            textPrimary = '#ccd6f6';
            textSecondary = '#8892b0';
            break;
    }

    return {
        palette: {
            mode,
            primary: { main: primaryMain },
            secondary: { main: secondaryMain },
            background: { default: backgroundDefault, paper: backgroundPaper },
            text: { primary: textPrimary, secondary: textSecondary },
        },
        primaryMain,
        secondaryMain,
        backgroundDefault,
        backgroundPaper,
    };
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Try to get from localStorage first for immediate results, fallback to 'dark'
    const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
        const saved = localStorage.getItem('site-theme') as ThemeName;
        return saved || 'dark';
    });

    // Fetch site default theme on load
    useEffect(() => {
        const fetchDefaultTheme = async () => {
            try {
                const aboutData = await aboutService.get();
                if (aboutData.defaultTheme) {
                    const fetchedTheme = aboutData.defaultTheme as ThemeName;
                    setCurrentTheme(fetchedTheme);
                    localStorage.setItem('site-theme', fetchedTheme);
                }
            } catch (error) {
                console.error('Error fetching site theme:', error);
            }
        };
        fetchDefaultTheme();
    }, []);

    useEffect(() => {
        const options = getThemeOptions(currentTheme);
        const { primaryMain, secondaryMain, backgroundDefault, backgroundPaper } = options;

        // Update CSS variables for global use
        document.documentElement.style.setProperty('--primary', primaryMain);
        document.documentElement.style.setProperty('--secondary', secondaryMain);
        document.documentElement.style.setProperty('--bg-dark', backgroundDefault);
        document.documentElement.style.setProperty('--bg-paper', backgroundPaper);

        // Set scrolling colors or standard body colors if needed
        document.body.style.backgroundColor = backgroundDefault;
        document.body.style.color = options.palette.text.primary;
    }, [currentTheme]);

    const theme = useMemo(() => {
        const options = getThemeOptions(currentTheme);
        return createTheme({
            palette: options.palette,
            typography: {
                fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
                h1: { fontWeight: 700, fontSize: '3.5rem', letterSpacing: '-0.02em', '@media (max-width:600px)': { fontSize: '2.5rem' } },
                h2: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01em' },
                h3: { fontWeight: 600, fontSize: '1.75rem' },
                body1: { lineHeight: 1.7 },
                button: { textTransform: 'none', fontWeight: 600 },
            },
            shape: { borderRadius: 4 },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            padding: '10px 24px',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${alpha(options.primaryMain, 0.3)}`,
                            },
                        },
                        containedPrimary: {
                            background: `linear-gradient(45deg, ${options.primaryMain} 30%, ${options.secondaryMain} 90%)`,
                            '&:hover': {
                                background: `linear-gradient(45deg, ${options.primaryMain} 40%, ${options.secondaryMain} 100%)`,
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            background: alpha(options.backgroundPaper, 0.8),
                            backdropFilter: 'blur(10px)',
                            transition: 'transform 0.3s ease, border-color 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                borderColor: alpha(options.primaryMain, 0.4),
                            },
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: { backgroundImage: 'none' },
                    },
                },
                MuiInputBase: {
                    styleOverrides: {
                        input: {
                            '&:-webkit-autofill': {
                                WebkitBoxShadow: `0 0 0 1000px ${options.backgroundPaper} inset !important`,
                                WebkitTextFillColor: `${options.palette.text.primary} !important`,
                                transition: 'background-color 5000s ease-in-out 0s',
                            },
                        },
                    },
                },
            },
        });
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
