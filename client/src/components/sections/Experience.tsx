import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, alpha, useTheme, Grid, Card, IconButton, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Edit2, Trash2, Plus } from 'lucide-react';
import type { Experience as ExperienceType } from '../../types';
import { experienceService } from '../../services/experienceService';
import ExperienceForm from '../admin/ExperienceForm';
import SectionHeader from '../common/SectionHeader';
import { confirmDeleteToast, successToast, errorToast } from '../../utils/toast';

const ExperienceCard: React.FC<{
    exp: ExperienceType;
    index: number;
    isAdmin?: boolean;
    onEdit: (exp: ExperienceType) => void;
    onDelete: (id: string) => void;
}> = ({ exp, index, isAdmin, onEdit, onDelete }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            const element = descriptionRef.current;
            if (element) {
                // Determine overflow by comparing scrollHeight against the fixed max height (140px)
                const isOverflown = element.scrollHeight > 140;
                // The button MUST show if there's text overflow OR if there's a full description to reveal
                setHasOverflow(isOverflown || !!exp.fullDescription);
            }
        };

        const observer = new ResizeObserver(() => checkOverflow());
        const element = descriptionRef.current;
        if (element) {
            observer.observe(element);
        }

        // Initial check
        checkOverflow();

        return () => {
            if (element) observer.unobserve(element);
            observer.disconnect();
        };
    }, [exp.shortDescription, exp.fullDescription]);

    return (
        <Box sx={{ mb: { xs: 4, md: -8 }, position: 'relative' }}>
            {/* Timeline Dot */}
            <Box
                sx={{
                    position: 'absolute',
                    left: { xs: 20, md: '50%' },
                    transform: 'translate(-50%, 0)',
                    width: 16,
                    height: 16,
                    bgcolor: 'primary.main',
                    border: `4px solid ${theme.palette.background.default}`,
                    borderRadius: '50%',
                    zIndex: 2,
                    top: 30,
                    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`
                }}
            />

            <Grid container justifyContent={index % 2 === 0 ? 'flex-start' : 'flex-end'}>
                <Grid size={{ xs: 12, md: 5.4 }} sx={{ pl: { xs: '60px', md: 0 } }}>
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card sx={{
                            p: { xs: 3, md: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'flex-start',
                            position: 'relative',
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            backdropFilter: 'blur(10px)',
                            height: isExpanded ? 'auto' : { xs: 'auto', md: 340 },
                            minHeight: { md: 340 },
                            width: '100%',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-10px) scale(1.01)',
                                borderColor: alpha(theme.palette.primary.main, 0.4),
                                boxShadow: `0 30px 60px ${alpha(theme.palette.primary.main, 0.2)}`
                            }
                        }}>
                            {isAdmin && (
                                <Box sx={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 1, zIndex: 10 }}>
                                    <IconButton size="small" onClick={() => onEdit(exp)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                        <Edit2 size={16} />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => onDelete(exp.id)} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2.5, width: '100%', mb: 0.5 }}>
                                <Box sx={{
                                    p: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    borderRadius: 3,
                                    display: { xs: 'none', sm: 'flex' },
                                    height: 'fit-content'
                                }}>
                                    <Briefcase size={28} color={theme.palette.primary.main} />
                                </Box>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: 'primary.main', fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
                                        {exp.role}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary', opacity: 0.9, fontSize: '0.95rem' }}>
                                        {exp.companyName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <Calendar size={14} />
                                        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                            {exp.startDate} - {exp.endDate}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                ref={descriptionRef}
                                sx={{
                                    width: '100%',
                                    flexGrow: 1,
                                    maxHeight: isExpanded ? 'none' : 140,
                                    overflowY: isExpanded ? 'visible' : 'auto',
                                    pr: isExpanded ? 0 : 1,
                                    mt: 1,
                                    '&::-webkit-scrollbar': { width: '4px' },
                                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: alpha(theme.palette.primary.main, 0.2),
                                        borderRadius: '10px',
                                    },
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" sx={{
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.9rem',
                                    opacity: 0.9,
                                    mb: isExpanded && exp.fullDescription ? 2 : 0
                                }}>
                                    {exp.shortDescription}
                                </Typography>

                                {isExpanded && exp.fullDescription && (
                                    <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                            Key Responsibilities & Achievements
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap',
                                            fontSize: '0.9rem',
                                            opacity: 0.8
                                        }}>
                                            {exp.fullDescription}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {hasOverflow && (
                                <Box sx={{ width: '100%', mt: 1, position: 'relative', zIndex: 50 }}>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            p: 1,
                                            pl: 0,
                                            '&:hover': { background: 'transparent', textDecoration: 'underline', color: 'primary.light' }
                                        }}
                                        disableRipple
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsExpanded(!isExpanded);
                                        }}
                                    >
                                        {isExpanded ? 'Show Less' : 'Read More'}
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

const Experience: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<ExperienceType | null>(null);

    const fetchExperiences = async () => {
        try {
            const data = await experienceService.getAll();
            setExperiences(data || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleAddClick = () => {
        setEditingExperience(null);
        setFormOpen(true);
    };

    const handleEditClick = (experience: ExperienceType) => {
        setEditingExperience(experience);
        setFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        confirmDeleteToast('Are you sure you want to delete this experience?', async () => {
            try {
                await experienceService.delete(id);
                successToast('Experience deleted successfully');
                fetchExperiences();
            } catch (error) {
                errorToast('Failed to delete experience');
            }
        });
    };

    const handleFormSubmit = async (expData: Partial<ExperienceType>) => {
        try {
            if (editingExperience) {
                await experienceService.update(editingExperience.id, expData);
                successToast('Experience updated successfully');
            } else {
                await experienceService.create(expData);
                successToast('New experience added successfully');
            }
            setFormOpen(false);
            fetchExperiences();
        } catch (error) {
            errorToast('Failed to save experience');
        }
    };

    return (
        <Box id="experience" sx={{ py: 6 }}>
            {/* STICKY HEADER */}
            <SectionHeader
                index="03"
                title="Professional Journey"
                subtitle="Career Timeline"
                icon={<Briefcase size={32} />}
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

            <Container maxWidth="xl" sx={{ mt: 8 }}>
                <Box sx={{ position: 'relative' }}>
                    {/* Vertical Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 20, md: '50%' },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            width: 3,
                            height: '100%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: '50px'
                        }}
                    />

                    {loading ? (
                        <Typography sx={{ textAlign: 'center', py: 4 }}>Loading timeline...</Typography>
                    ) : (
                        experiences.map((exp, index) => (
                            <ExperienceCard
                                key={exp.id}
                                exp={exp}
                                index={index}
                                isAdmin={isAdmin}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        ))
                    )}
                </Box>
            </Container>

            <ExperienceForm
                open={formOpen}
                experience={editingExperience}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default Experience;
