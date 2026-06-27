import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    useTheme,
    useMediaQuery,
    alpha,
} from '@mui/material';
import { Menu as MenuIcon, X as CloseIcon, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSelector from './ThemeSelector';

const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
    onAdminClick: () => void;
    isAdmin: boolean;
    onLogout: () => void;
    brandName: string;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, isAdmin, onLogout, brandName }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('home');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            setScrollProgress(percent);
            setScrolled(window.scrollY > 20);

            // Active section detection
            const sections = navItems.map(item => item.href.substring(1));
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= element.offsetTop - 100) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: scrolled
                    ? alpha(theme.palette.background.default, 0.8)
                    : 'transparent',
                backdropFilter: scrolled ? 'blur(15px)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: theme.zIndex.drawer + 1,
                py: scrolled ? 0.5 : 1.5,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 70 } }}>
                    {/* Logo Area */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { md: 4 } }}>
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                                }}
                            >
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1 }}>{brandName.charAt(0).toUpperCase()}</Typography>
                            </Box>
                        </motion.div>
                        <Typography
                            variant="h5"
                            component="div"
                            noWrap
                            sx={{
                                fontWeight: 900,
                                letterSpacing: -0.5,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: { xs: '1rem', md: '1.4rem' },
                                display: 'block',
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {brandName}
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}
                    {!isMobile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{
                                display: 'flex',
                                bgcolor: alpha(theme.palette.background.paper, 0.5),
                                backdropFilter: 'blur(20px)',
                                borderRadius: '50px',
                                p: 0.8,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.05)}`,
                                gap: 0.5
                            }}>
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.href.substring(1);
                                    return (
                                        <Button
                                            key={item.label}
                                            href={item.href}
                                            sx={{
                                                color: isActive ? (theme.palette.mode === 'dark' ? '#fff' : 'primary.main') : 'text.secondary',
                                                px: 2.5,
                                                py: 0.8,
                                                fontWeight: isActive ? 800 : 600,
                                                letterSpacing: 0.5,
                                                textTransform: 'none',
                                                fontSize: '0.9rem',
                                                borderRadius: '50px',
                                                position: 'relative',
                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    background: alpha(theme.palette.primary.main, 0.05),
                                                },
                                            }}
                                        >
                                            {item.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : theme.palette.common.white,
                                                        boxShadow: theme.palette.mode === 'light' ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                                                        borderRadius: '50px',
                                                        zIndex: -1,
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                                    }}
                                                />
                                            )}
                                        </Button>
                                    );
                                })}
                            </Box>

                            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ThemeSelector />
                                <Button
                                    variant="contained"
                                    color={isAdmin ? "secondary" : "primary"}
                                    startIcon={isAdmin ? <CloseIcon size={18} /> : <LogIn size={18} />}
                                    onClick={isAdmin ? onLogout : onAdminClick}
                                    sx={{
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        px: 3,
                                        fontWeight: 700,
                                        boxShadow: scrolled ? theme.shadows[4] : 'none',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            transform: 'translateY(-2px) scale(1.05)',
                                            boxShadow: theme.shadows[8]
                                        }
                                    }}
                                >
                                    {isAdmin ? 'Logout' : 'Admin'}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ThemeSelector />
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    borderRadius: '12px'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>

                {/* Scroll Progress Bar */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        width: `${scrollProgress}%`,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transition: 'width 0.1s linear',
                        boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`
                    }}
                />
            </Container>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <Drawer
                        anchor="right"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        PaperProps={{
                            sx: {
                                width: '100vw',
                                maxWidth: '350px',
                                bgcolor: alpha(theme.palette.background.default, 0.98),
                                backdropFilter: 'blur(10px)',
                                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                p: 0
                            },
                        }}
                    >
                        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>MENU</Typography>
                                <IconButton onClick={handleDrawerToggle} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <List sx={{ flexGrow: 1 }}>
                                {navItems.map((item, index) => {
                                    const isActive = activeSection === item.href.substring(1);
                                    return (
                                        <motion.div
                                            key={item.label}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ListItem disablePadding sx={{ mb: 1.5 }}>
                                                <Button
                                                    fullWidth
                                                    href={item.href}
                                                    onClick={handleDrawerToggle}
                                                    sx={{
                                                        py: 2,
                                                        px: 3,
                                                        justifyContent: 'space-between',
                                                        borderRadius: '16px',
                                                        color: isActive ? 'primary.main' : 'text.primary',
                                                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                                        fontWeight: 800,
                                                        fontSize: '1.1rem',
                                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                                    }}
                                                >
                                                    {item.label}
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isActive ? 'primary.main' : alpha(theme.palette.divider, 0.2) }} />
                                                </Button>
                                            </ListItem>
                                        </motion.div>
                                    );
                                })}
                            </List>

                            <Box sx={{ mt: 'auto', p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: '24px', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={isAdmin ? <CloseIcon size={20} /> : <LogIn size={20} />}
                                    onClick={() => {
                                        if (isAdmin) onLogout();
                                        else onAdminClick();
                                        handleDrawerToggle();
                                    }}
                                    sx={{ py: 2, borderRadius: '16px', fontWeight: 800, textTransform: 'none' }}
                                >
                                    {isAdmin ? 'Logout' : 'Admin Portal'}
                                </Button>

                            </Box>
                        </Box>
                    </Drawer>
                )}
            </AnimatePresence>
        </AppBar>
    );
};

export default Navbar;
