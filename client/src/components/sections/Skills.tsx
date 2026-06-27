import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Chip,
    alpha,
    useTheme,
    IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code, Code2, Edit2, Trash2, Plus, Layout, Layers, Database, Shield, Zap, Cpu, Globe, Rocket,
    TerminalSquare, BrainCircuit, Sparkles, Diamond, Smartphone, Palette, Microscope, Server, Activity,
    Wrench, Cloud, Flame, Box as BoxIcon
} from 'lucide-react';
import { skillService } from '../../services/skillService';
import type { SkillSectionData } from '../../services/skillService';
import SectionHeader from '../common/SectionHeader';
import { successToast, errorToast, confirmDeleteToast } from '../../utils/toast';
import SkillForm from '../admin/SkillForm';
const categoryIcons: Record<string, React.ReactNode> = {
    'frontend': <Layout size={28} />,
    'backend': <Database size={28} />,
    'database': <Layers size={28} />,
    'languages': <Code2 size={28} />,
    'tools': <Wrench size={28} />,
    'security': <Shield size={28} />,
    'performance': <Zap size={28} />,
    'cloud': <Cloud size={28} />,
    'devops': <Cpu size={28} />,
    'architect': <Rocket size={28} />,
    'ai': <BrainCircuit size={28} />,
    'mobile': <Smartphone size={28} />,
    'design': <Palette size={28} />,
    'testing': <Microscope size={28} />,
    'server': <Server size={28} />,
    'deployment': <Globe size={28} />,
    'analytics': <Activity size={28} />,
    'infrastructure': <Layers size={28} />,
};

const skillIcons: Record<string, React.ReactNode> = {
    'react': <Zap size={14} />,
    'node': <Server size={14} />,
    'python': <Code2 size={14} />,
    'javascript': <Code size={14} />,
    'typescript': <Code size={14} />,
    'html': <Globe size={14} />,
    'css': <Palette size={14} />,
    'aws': <Cloud size={14} />,
    'docker': <BoxIcon size={14} />,
    'git': <Rocket size={14} />,
    'figma': <Palette size={14} />,
    'sql': <Database size={14} />,
    'mongodb': <Database size={14} />,
    'firebase': <Flame size={14} />,
    'next': <Layers size={14} />,
    'angular': <Activity size={14} />,
    'vue': <Activity size={14} />,
    'tailwind': <Layout size={14} />,
};

const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    for (const key in skillIcons) {
        if (s.includes(key)) return skillIcons[key];
    }
    return <Diamond size={10} />;
};

const getIconForTitle = (title: string): React.ReactNode => {
    const t = title.toLowerCase();
    for (const key in categoryIcons) {
        if (t.includes(key)) return categoryIcons[key];
    }
    return <TerminalSquare size={26} />;
};

const Skills: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [sections, setSections] = useState<SkillSectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [editingSection, setEditingSection] = useState<SkillSectionData | null>(null);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const data = await skillService.getAll();
            setSections(data || []);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAddClick = () => {
        setEditingSection(null);
        setOpenForm(true);
    };

    const handleCreate = async (data: SkillSectionData) => {
        try {
            await skillService.create(data);
            successToast('Skill section created!');
            setOpenForm(false);
            fetchSkills();
        } catch (error) {
            errorToast('Failed to create skill section');
        }
    };

    const handleUpdate = async (data: SkillSectionData) => {
        if (!data.id) return;
        try {
            await skillService.update(data.id, data);
            successToast('Skill section updated!');
            setOpenForm(false);
            setEditingSection(null);
            fetchSkills();
        } catch (error) {
            errorToast('Failed to update skill section');
        }
    };

    const handleDelete = async (id: string) => {
        confirmDeleteToast('This will remove this Entire Skill Category. Proceed?', async () => {
            try {
                await skillService.delete(id);
                successToast('Skill section removed!');
                fetchSkills();
            } catch (error) {
                errorToast('Failed to remove skill section');
            }
        });
    };

    return (
        <Box id="skills" sx={{ py: 6, position: 'relative' }}>
            <SectionHeader
                index="02"
                title="TECHNICAL MASTERY"
                subtitle="EXPERT CAPABILITIES"
                icon={<BrainCircuit size={32} />}
                rightElement={isAdmin && (
                    <IconButton
                        sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                        }}
                        color="secondary"
                        onClick={handleAddClick}
                    >
                        <Plus size={28} />
                    </IconButton>
                )}
            />

            <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 8 } }}>
                {loading ? (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                        <Typography sx={{ opacity: 0.5, fontWeight: 950, letterSpacing: 2 }}>ANALYZING STACK...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        <AnimatePresence mode="popLayout">
                            {sections.map((section, idx) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={section.id || idx}>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: idx * 0.1, type: 'spring', damping: 20 }}
                                    >
                                        <Box
                                            sx={{
                                                height: 340, // DECREASED HEIGHT
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                                borderRadius: '32px',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                backdropFilter: 'blur(40px)',
                                                overflow: 'hidden',
                                                boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.2)}`,
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: 0,
                                                    padding: '2px',
                                                    borderRadius: '32px',
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.5)}, transparent, ${alpha(theme.palette.secondary.main, 0.5)})`,
                                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                    WebkitMaskComposite: 'xor',
                                                    maskComposite: 'exclude',
                                                    opacity: 0.3,
                                                    transition: 'opacity 0.5s ease'
                                                },
                                                '&:hover': {
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    transform: 'translateY(-12px) scale(1.01)',
                                                    boxShadow: `0 40px 80px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                    '&::before': { opacity: 1 },
                                                    '& .card-header-bg': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                                                    '& .shimmer-line': { left: '150%' }
                                                },
                                                transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                            }}
                                        >
                                            {/* DIAMOND SHIMMER LINE */}
                                            <Box
                                                className="shimmer-line"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '-120%',
                                                    width: '60%',
                                                    height: '100%',
                                                    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent)',
                                                    transition: 'left 1s ease-in-out',
                                                    zIndex: 2,
                                                    pointerEvents: 'none'
                                                }}
                                            />

                                            {/* THEMED HEADER SECTION */}
                                            <Box
                                                className="card-header-bg"
                                                sx={{
                                                    p: 3,
                                                    pb: 2.5,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                                    transition: 'background-color 0.4s ease',
                                                    zIndex: 1
                                                }}
                                            >
                                                <Stack direction="row" spacing={2.5} alignItems="center">
                                                    <Box sx={{
                                                        p: 1.8,
                                                        borderRadius: '18px',
                                                        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : 'white',
                                                        color: 'primary.main',
                                                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {getIconForTitle(section.title)}
                                                    </Box>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: -0.8, color: 'text.primary', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {section.title}
                                                            {idx === 0 && <Sparkles size={16} color={theme.palette.primary.main} />}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', opacity: 0.8, letterSpacing: 1.5 }}>
                                                            SKILLS OVERVIEW
                                                        </Typography>
                                                    </Box>

                                                    {isAdmin && (
                                                        <Stack direction="row" spacing={0.5}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    setEditingSection(section);
                                                                    setOpenForm(true);
                                                                }}
                                                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                                                            >
                                                                <Edit2 size={16} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => section.id && handleDelete(section.id)}
                                                                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* SUB SKILLS SECTION WITH TOP PADDING */}
                                            <Box sx={{
                                                flexGrow: 1,
                                                overflowY: 'auto',
                                                p: 3,
                                                pt: 5, // INCREASED TOP PADDING
                                                pr: 2,
                                                bgcolor: alpha(theme.palette.background.default, 0.2),
                                                zIndex: 1,
                                                '&::-webkit-scrollbar': { width: '4px' },
                                                '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.2), borderRadius: 10 }
                                            }}>
                                                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                                    {(section.skills || []).map((skill, skIdx) => (
                                                        <Chip
                                                            key={skIdx}
                                                            label={skill}
                                                            icon={getSkillIcon(skill) as React.ReactElement}
                                                            sx={{
                                                                borderRadius: '14px',
                                                                height: 'auto',
                                                                py: 1,
                                                                px: 0.5,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 800,
                                                                bgcolor: alpha(theme.palette.background.paper, 0.7),
                                                                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                                                color: 'text.primary',
                                                                '& .MuiChip-icon': {
                                                                    color: 'primary.main',
                                                                    transition: 'transform 0.3s ease'
                                                                },
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    borderColor: alpha(theme.palette.primary.main, 0.5),
                                                                    transform: 'scale(1.08) translateY(-3px)',
                                                                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                                    '& .MuiChip-icon': {
                                                                        transform: 'rotate(15deg) scale(1.2)',
                                                                        color: 'secondary.main'
                                                                    }
                                                                },
                                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </Container>

            <SkillForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={editingSection ? handleUpdate : handleCreate}
                initialData={editingSection}
            />
        </Box>
    );
};

export default Skills;
