import React, { useState } from 'react';
import { IconButton, Modal, Box, Typography, Card, CardActionArea, Grid, Tooltip, Backdrop, Fade, alpha, useTheme } from '@mui/material';
import { Palette, X } from 'lucide-react';
import { useThemeContext, type ThemeName } from '../../theme/ThemeProvider';
import { aboutService } from '../../services/aboutService';
import { authService } from '../../services/authService';

interface ThemeOption {
    name: ThemeName;
    label: string;
    primary: string;
    secondary: string;
    bg: string;
}

const themeOptions: ThemeOption[] = [
    { name: 'dark', label: 'Classic Dark', primary: '#7c4dff', secondary: '#00e5ff', bg: '#0a192f' },
    { name: 'light', label: 'Pristine Light', primary: '#2563eb', secondary: '#db2777', bg: '#f8fafc' },
    { name: 'ocean', label: 'Tropical Ocean', primary: '#2dd4bf', secondary: '#a5f3fc', bg: '#002d36' },
    { name: 'slate', label: 'Professional Slate', primary: '#3b82f6', secondary: '#60a5fa', bg: '#0f172a' },
    { name: 'purple', label: 'Lavender Dream', primary: '#7c3aed', secondary: '#db2777', bg: '#faf5ff' },
    { name: 'corporate', label: 'Corporate Blue-Slate', primary: '#1e40af', secondary: '#64748b', bg: '#f3f2ef' },
    { name: 'emerald', label: 'Emerald Mint', primary: '#10b981', secondary: '#d1fae5', bg: '#050505' },
    { name: 'midnight', label: 'Midnight Obsidian', primary: '#3b82f6', secondary: '#ffffff', bg: '#000000' },
];

const ThemeSelector: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { currentTheme, setTheme } = useThemeContext();
    const theme = useTheme();
    const isAdmin = authService.isLoggedIn();

    const handleThemeChange = async (name: ThemeName) => {
        setTheme(name);
        localStorage.setItem('site-theme', name); // Persist for session/reloads

        // If Admin is selecting the theme, save it as global default
        if (isAdmin) {
            try {
                const currentData = await aboutService.get();
                await aboutService.update({
                    ...currentData,
                    defaultTheme: name
                });
            } catch (error) {
                console.error('Failed to save global theme:', error);
            }
        }

        setTimeout(() => setOpen(false), 300);
    };

    return (
        <>
            <Tooltip title="Personalize Theme">
                <IconButton onClick={() => setOpen(true)} color="primary" sx={{
                    ml: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { transform: 'rotate(15deg) scale(1.1)', bgcolor: alpha(theme.palette.primary.main, 0.2) },
                    transition: 'all 0.3s'
                }}>
                    <Palette size={24} />
                </IconButton>
            </Tooltip>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '95%', sm: 600 },
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        p: 4,
                        border: '1px solid rgba(255,255,255,0.1)',
                        outline: 'none',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Select Theme</Typography>
                                {isAdmin && (
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                                        * Admin: Selected theme will be set as SITE DEFAULT
                                    </Typography>
                                )}
                            </Box>
                            <IconButton onClick={() => setOpen(false)} size="small">
                                <X size={20} />
                            </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                            {themeOptions.map((option) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={option.name}>
                                    <Card
                                        sx={{
                                            borderRadius: 3,
                                            border: currentTheme === option.name ? `2px solid ${option.primary}` : '2px solid transparent',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            bgcolor: alpha(option.bg, 0.1),
                                            '&:hover': {
                                                transform: 'translateY(-10px) scale(1.02)',
                                                borderColor: alpha(option.primary, 0.4),
                                                boxShadow: `0 30px 60px ${alpha(option.primary, 0.2)}`
                                            }
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleThemeChange(option.name)} sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {/* Color Preview Swatch */}
                                                <Box sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    bgcolor: option.bg,
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', bgcolor: option.primary }} />
                                                    <Box sx={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', bgcolor: option.secondary }} />
                                                </Box>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {option.label}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.name === 'light' ? 'Standard Mode' : 'Dark Mode'}
                                                    </Typography>
                                                </Box>
                                                {currentTheme === option.name && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: option.primary, boxShadow: `0 0 10px ${option.primary}` }} />
                                                )}
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="caption" sx={{ display: 'block', mt: 3, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                            {isAdmin ? 'Your choice updates the portfolio for everyone.' : 'Temporary preview. Admin sets the permanent theme.'}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default ThemeSelector;
