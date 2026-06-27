import React, { useState } from 'react';
import { Container, Typography, Button, Box, Stack, alpha, useTheme, IconButton, Avatar } from '@mui/material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Edit2, ChevronDown, X, Mail } from 'lucide-react';
import type { AboutData } from '../../services/aboutService';
import AboutForm from '../admin/AboutForm';

import { useAbout } from '../../context/AboutContext';
import { getMediaUrl } from '../../services/api';
import { successToast, errorToast } from '../../utils/toast';

const Hero: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const { scrollY } = useScroll();
    const { aboutData, updateAbout } = useAbout();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity1 = useTransform(scrollY, [0, 300], [1, 0]);

    const [formOpen, setFormOpen] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const handleFormSubmit = async (data: AboutData) => {
        try {
            await updateAbout(data);
            successToast('Hero information updated successfully');
            setFormOpen(false);
        } catch (error) {
            errorToast('Failed to update hero info');
        }
    };

    return (
        <Box
            id="home"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pt: { xs: 10, md: 0 },
                position: 'relative',
                overflow: 'hidden',
                background: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 40%)`
            }}
        >
            {/* Animated Background Shapes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    filter: 'blur(100px)',
                    zIndex: -1,
                }}
            />

            <Container maxWidth="xl">
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'center',
                    gap: { xs: 4, md: 10 },
                    textAlign: { xs: 'center', md: 'left' }
                }}>

                    <Box sx={{ flex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '50px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mb: 3 }}>
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                </motion.div>
                                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1 }}>{aboutData?.availabilityText?.toUpperCase() || ''}</Typography>
                            </Box>

                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                                    lineHeight: 1,
                                    mb: 2,
                                    letterSpacing: -2
                                }}
                            >
                                {aboutData?.heroMainTitlePrefix || ''} <br />
                                <Box component="span" sx={{
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitFillColor: 'transparent',
                                    WebkitTextFillColor: 'transparent',
                                }}>{aboutData?.heroMainTitleGradient || ''}</Box> {aboutData?.heroMainTitleSuffix || ''}
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 2,
                                    fontWeight: 500,
                                    maxWidth: '600px',
                                    lineHeight: 1.4,
                                    fontSize: { xs: '1.2rem', md: '1.8rem' }
                                }}
                            >
                                {aboutData?.heroSubtitle || ''}
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 4,
                                    fontWeight: 400,
                                    maxWidth: '600px',
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1rem', md: '1.2rem' }
                                }}
                            >
                                {aboutData && (
                                    <>
                                        I'm <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{aboutData.heroTitle}</Box>, a {aboutData.headline} {aboutData.heroDescription}
                                    </>
                                )}
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowRight size={20} />}
                                    href="#projects"
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            boxShadow: `0 25px 60px ${alpha(theme.palette.primary.main, 0.5)}`,
                                            transform: 'translateY(-8px) scale(1.02)',
                                            bgcolor: 'primary.dark',
                                        }
                                    }}
                                >
                                    View Projects
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<Download size={20} />}
                                    href={aboutData?.resumeUrl ? getMediaUrl(aboutData.resumeUrl) : '#'}
                                    download="Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    disabled={!aboutData?.resumeUrl}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        borderWidth: '2px',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            borderWidth: '2px',
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            transform: 'translateY(-8px)',
                                            borderColor: 'primary.main',
                                            boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.15)}`
                                        },
                                        '&.Mui-disabled': {
                                            borderColor: alpha(theme.palette.divider, 0.1),
                                            color: alpha(theme.palette.text.secondary, 0.3)
                                        }
                                    }}
                                >
                                    {aboutData?.resumeUrl ? 'Download Resume' : 'Resume N/A'}
                                </Button>
                            </Stack>

                            {/* Social Icons with Tooltips look */}
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 2 }}>FOLLOW ME</Typography>
                                <Box sx={{ width: 40, height: 1, bgcolor: alpha(theme.palette.divider, 0.1) }} />
                                {[
                                    { Icon: Github, url: aboutData?.githubUrl || '#' },
                                    { Icon: Linkedin, url: aboutData?.linkedinUrl || '#' }
                                ].map((item, i) => (
                                    <IconButton
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: 'text.secondary',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            p: 1.5,
                                            bgcolor: alpha(theme.palette.background.paper, 0.1),
                                            '&:hover': {
                                                color: 'primary.main',
                                                transform: 'translateY(-5px) rotate(8deg) scale(1.15)',
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.1)}`
                                            }
                                        }}
                                    >
                                        <item.Icon size={22} />
                                    </IconButton>
                                ))}
                                <IconButton
                                    href="#contact"
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        p: 1.5,
                                        bgcolor: alpha(theme.palette.background.paper, 0.1),
                                        '&:hover': {
                                            color: 'primary.main',
                                            transform: 'translateY(-5px) rotate(-8deg) scale(1.15)',
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.1)}`
                                        }
                                    }}
                                >
                                    <Mail size={22} />
                                </IconButton>
                            </Stack>
                        </motion.div>
                    </Box>

                    <Box sx={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ y: y1 }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                {/* Floating Background Circles */}
                                <Box sx={{
                                    position: 'absolute',
                                    inset: -20,
                                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                                    borderRadius: '50%',
                                    animation: 'spin 20s linear infinite'
                                }} />

                                <Avatar
                                    src={getMediaUrl(aboutData?.profilePhotoUrl)}
                                    onClick={() => aboutData?.profilePhotoUrl && setPreviewPhoto(getMediaUrl(aboutData.profilePhotoUrl))}
                                    sx={{
                                        width: { xs: 240, sm: 300, md: 400 },
                                        height: { xs: 240, sm: 300, md: 400 },
                                        border: `10px solid ${alpha(theme.palette.background.paper, 0.5)}`,
                                        boxShadow: `0 30px 60px ${alpha(theme.palette.common.black, 0.4)}`,
                                        fontSize: '8rem',
                                        fontWeight: 900,
                                        cursor: aboutData?.profilePhotoUrl ? 'pointer' : 'default',
                                        transition: 'all 0.4s ease',
                                        '&:hover': aboutData?.profilePhotoUrl ? {
                                            transform: 'scale(1.02) rotate(2deg)',
                                            boxShadow: `0 40px 80px ${alpha(theme.palette.primary.main, 0.3)}`
                                        } : {}
                                    }}
                                >
                                    {aboutData?.heroTitle?.[0] || 'S'}
                                </Avatar>

                                {isAdmin && (
                                    <IconButton
                                        onClick={() => setFormOpen(true)}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 30,
                                            right: 30,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            boxShadow: 10,
                                            zIndex: 2,
                                            '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.1)' }
                                        }}
                                    >
                                        <Edit2 size={24} />
                                    </IconButton>
                                )}
                            </Box>
                        </motion.div>
                    </Box>
                </Box>
            </Container>

            {/* Profile Photo Lightbox */}
            <AnimatePresence>
                {previewPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewPhoto(null)}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            backgroundColor: alpha(theme.palette.background.default, 0.95),
                            backdropFilter: 'blur(20px)',
                            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '40px', cursor: 'zoom-out'
                        }}
                    >
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                            <img
                                src={getMediaUrl(previewPhoto)}
                                alt="Profile Preview"
                                style={{
                                    maxWidth: '80vw',
                                    maxHeight: '80vh',
                                    borderRadius: '24px',
                                    boxShadow: `0 30px 100px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    objectFit: 'contain',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                }}
                            />
                            <IconButton
                                onClick={() => setPreviewPhoto(null)}
                                sx={{ position: 'absolute', top: -50, right: 0, color: 'text.primary' }}
                            >
                                <X size={32} />
                            </IconButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Indicator */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: opacity1,
                    textAlign: 'center'
                }}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.5, letterSpacing: 1 }}>SCROLL DOWN</Typography>
                    <ChevronDown size={20} style={{ opacity: 0.5 }} />
                </Box>
            </motion.div>

            <AboutForm
                open={formOpen}
                about={aboutData}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Box>
    );
};

export default Hero;
