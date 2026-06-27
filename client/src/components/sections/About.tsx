import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, alpha, useTheme, Stack, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Edit2, Code, User, Zap, Cpu, Rocket, Sparkles, Layout, Database, Globe, Layers, Activity, Server, Code2, Globe2, Flame, Box as BoxIcon, Cloud, Gem, Palette } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { experienceService } from '../../services/experienceService';
import type { AboutData } from '../../services/aboutService';
import AboutForm from '../admin/AboutForm';
import SectionHeader from '../common/SectionHeader';

import { useAbout } from '../../context/AboutContext';
import { successToast, errorToast } from '../../utils/toast';

const skillIcons: Record<string, React.ReactNode> = {
    'react': <Zap size={16} />,
    'node': <Server size={16} />,
    'python': <Code2 size={16} />,
    'javascript': <Code size={16} />,
    'typescript': <Code size={16} />,
    'html': <Globe size={16} />,
    'css': <Palette size={16} />,
    'aws': <Cloud size={16} />,
    'docker': <BoxIcon size={16} />,
    'git': <Rocket size={16} />,
    'figma': <Palette size={16} />,
    'sql': <Database size={16} />,
    'mongodb': <Database size={16} />,
    'firebase': <Flame size={16} />,
    'next': <Layers size={16} />,
    'angular': <Activity size={16} />,
    'vue': <Activity size={16} />,
    'tailwind': <Layout size={16} />,
    'bootstrap': <Layout size={16} />,
    'material': <Layout size={16} />,
    'rest': <Globe2 size={16} />,
    'graphql': <Globe2 size={16} />,
};

const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    for (const key in skillIcons) {
        if (s.includes(key)) return skillIcons[key];
    }
    return <Gem size={14} />;
};

const About: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const { aboutData, updateAbout } = useAbout();
    const [stats, setStats] = useState({ years: 0, projects: 0, techs: 0 });
    const [formOpen, setFormOpen] = useState(false);

    const fetchData = async () => {
        try {
            // Optimization: Skip massive database fetches if stats are already explicitly set in Admin Panel
            if (aboutData && aboutData.yearsExperience && aboutData.projectsCompleted && aboutData.techStackCount) {
                setStats({
                    years: aboutData.yearsExperience,
                    projects: aboutData.projectsCompleted,
                    techs: aboutData.techStackCount
                });
                return;
            }

            const [projects, experiences] = await Promise.all([
                projectService.getAll(),
                experienceService.getAll()
            ]);

            // Calculate Projects
            const projectsCount = projects.length;

            // Calculate Tech Stack
            const uniqueTechs = new Set(projects.flatMap(p => p.techStack || []));
            const techCount = uniqueTechs.size;

            // Calculate Years of Experience
            let minYear = new Date().getFullYear();
            experiences.forEach(exp => {
                const yearMatch = exp.startDate?.match(/\d{4}/);
                if (yearMatch) {
                    const year = parseInt(yearMatch[0]);
                    if (year < minYear) minYear = year;
                }
            });
            const years = Math.max(0, new Date().getFullYear() - minYear);

            setStats({
                years: (aboutData?.yearsExperience || years) || 0,
                projects: (aboutData?.projectsCompleted || projectsCount) || 0,
                techs: (aboutData?.techStackCount || techCount) || 0
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (aboutData) fetchData();
    }, [aboutData]);

    const handleFormSubmit = async (data: AboutData) => {
        try {
            await updateAbout(data);
            successToast('About information updated successfully');
            setFormOpen(false);
        } catch (error) {
            errorToast('Failed to update about info');
        }
    };

    const groupedSkills = [
        { name: 'Core Technology Stack', icon: <Code size={20} />, items: aboutData?.skills || [] },
    ];

    return (
        <Box id="about" sx={{ py: 6, position: 'relative' }}>
            {/* STICKY HEADER */}
            <SectionHeader
                index="01"
                title={aboutData?.bioTitle || ''}
                subtitle="Get to know me"
                icon={<User size={32} />}
                rightElement={isAdmin && (
                    <IconButton
                        sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                        }}
                        color="secondary"
                        onClick={() => setFormOpen(true)}
                    >
                        <Edit2 size={24} />
                    </IconButton>
                )}
            />

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                                {aboutData?.bioContent || ''}
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mt: 6 }}>
                                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1.5, flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary.main" fontStyle="Outfit" sx={{ fontWeight: 900 }}>{stats.years}+</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>Years Exp</Typography>
                                </Box>
                                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 1.5, flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h3" color="secondary.main" fontStyle="Outfit" sx={{ fontWeight: 900 }}>{stats.projects}+</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>Projects</Typography>
                                </Box>
                                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1.5, flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary.main" fontStyle="Outfit" sx={{ fontWeight: 900 }}>{stats.techs}+</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>Tech Stack</Typography>
                                </Box>
                            </Stack>
                        </motion.div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ position: 'relative' }}
                        >
                            {/* PREMIUM DECORATIVE ELEMENTS */}
                            <Box sx={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                                zIndex: 0,
                                borderRadius: '50%',
                                filter: 'blur(40px)'
                            }} />

                            <Box
                                sx={{
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    p: { xs: 3, md: 5 },
                                    minHeight: 300, // DECREASED HEIGHT
                                    borderRadius: '40px',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    backdropFilter: 'blur(30px)',
                                    boxShadow: `0px 40px 100px ${alpha(theme.palette.common.black, 0.3)}`,
                                    position: 'relative',
                                    zIndex: 1,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        padding: '2px',
                                        borderRadius: '40px',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, transparent, ${theme.palette.secondary.main})`,
                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'xor',
                                        maskComposite: 'exclude',
                                        opacity: 0.5
                                    },
                                    '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.4),
                                        boxShadow: `0px 60px 140px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        transform: 'translateY(-8px) scale(1.01)',
                                    },
                                    transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                }}
                            >
                                <Typography variant="h5" sx={{
                                    fontWeight: 950,
                                    mb: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    letterSpacing: -0.5,
                                    color: 'text.primary'
                                }}>
                                    <Box sx={{
                                        p: 1.2,
                                        borderRadius: '12px',
                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                        color: 'secondary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.2)}`
                                    }}>
                                        <Cpu size={24} />
                                    </Box>
                                    Core Skills & Tools
                                    <Sparkles size={20} color={theme.palette.primary.main} />
                                </Typography>

                                <Stack spacing={3}>
                                    {groupedSkills.map((skill) => (
                                        <Box key={skill.name}>
                                            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                                                {skill.items.map((item, idx) => (
                                                    <motion.div
                                                        key={`${item}-${idx}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.05, duration: 0.4 }}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                    >
                                                        <Chip
                                                            icon={getSkillIcon(item) as React.ReactElement}
                                                            label={item}
                                                            sx={{
                                                                borderRadius: '16px',
                                                                height: 'auto',
                                                                py: 1.2,
                                                                px: 0.8,
                                                                fontSize: '0.9rem',
                                                                fontWeight: 800,
                                                                bgcolor: alpha(theme.palette.background.paper, 0.9),
                                                                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                                                color: 'text.primary',
                                                                backdropFilter: 'blur(5px)',
                                                                '& .MuiChip-icon': {
                                                                    color: 'primary.main',
                                                                    mr: 0.5
                                                                },
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                                    borderColor: theme.palette.primary.main,
                                                                    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                                },
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>

                                {/* SUBTLE WATERMARK ICON */}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    right: '-20px',
                                    opacity: 0.03,
                                    transform: 'rotate(-15deg)',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}>
                                    <BoxIcon size={180} />
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <AboutForm
                open={formOpen}
                about={aboutData}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default About;
