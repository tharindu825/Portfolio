import { createTheme, alpha } from '@mui/material/styles';

const primaryMain = '#7c4dff'; // Soft Purple
const secondaryMain = '#00e5ff'; // Cyan
const backgroundDefault = '#0a192f'; // Deep Dark Navy
const backgroundPaper = '#112240'; // Slightly lighter Navy

// NEW PREMIUM DARK COLORS
export const obsidianBlack = '#050505'; // Ultra-Dark/Obsidian
export const deepOceanBlue = '#1a1a2e'; // Rich Midnight Ocean Blue
export const emeraldNight = '#064e3b'; // Deep Forest Emerald
export const crimsonNight = '#450a0a'; // Dark Ruby/Midnight Crimson

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryMain,
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: '#63ffff',
      dark: '#00b2cc',
      contrastText: '#000000',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      primary: '#ccd6f6',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    body1: {
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${alpha(primaryMain, 0.3)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryMain} 30%, ${secondaryMain} 90%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${primaryMain} 40%, ${secondaryMain} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: alpha(backgroundPaper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          transition: 'transform 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            borderColor: alpha(primaryMain, 0.4),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            '-webkit-box-shadow': `0 0 0 1000px ${backgroundPaper} inset !important`,
            '-webkit-text-fill-color': '#ccd6f6 !important',
            'transition': 'background-color 5000s ease-in-out 0s',
          },
        },
      },
    },
  },
});
