import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, alpha, useTheme, Grid, Card, IconButton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Edit2, Trash2, Plus, School } from 'lucide-react';
import type { Education as EducationType } from '../../types';
import { educationService } from '../../services/extraService';
import EducationForm from '../admin/EducationForm';
import SectionHeader from '../common/SectionHeader';
import { confirmDeleteToast, successToast, errorToast } from '../../utils/toast';

const Education: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [educationList, setEducationList] = useState<EducationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<EducationType | null>(null);

    const fetchEducation = async () => {
        try {
            const data = await educationService.getAll();
            setEducationList(data || []);
        } catch (error) {
            console.error('Error fetching education:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleAddClick = () => {
        setEditingEducation(null);
        setFormOpen(true);
    };

    const handleEditClick = (edu: EducationType) => {
        setEditingEducation(edu);
        setFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        confirmDeleteToast('Are you sure you want to delete this education entry?', async () => {
            try {
                await educationService.delete(id);
                successToast('Education entry deleted successfully');
                fetchEducation();
            } catch (error) {
                errorToast('Failed to delete education');
            }
        });
    };

    const handleFormSubmit = async (eduData: Partial<EducationType>) => {
        try {
            if (editingEducation) {
                await educationService.update(editingEducation.id, eduData);
                successToast('Education entry updated successfully');
            } else {
                await educationService.create(eduData);
                successToast('New education entry added successfully');
            }
            setFormOpen(false);
            fetchEducation();
        } catch (error) {
            errorToast('Failed to save education');
        }
    };

    return (
        <Box id="education" sx={{ py: 6 }}>
            {/* STICKY HEADER */}
            <SectionHeader
                index="04"
                title="Academic Foundation"
                subtitle="Qualifications"
                icon={<School size={32} />}
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
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography>Loading academic history...</Typography>
                        </Box>
                    ) : (
                        educationList.map((edu, index) => (
                            <Box key={edu.id} sx={{ mb: { xs: 4, md: -8 }, position: 'relative' }}>
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
                                                p: { xs: 3, sm: 5 },
                                                display: 'flex',
                                                gap: 4,
                                                alignItems: 'flex-start',
                                                position: 'relative',
                                                borderRadius: 4,
                                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                '&:hover': {
                                                    transform: 'translateY(-10px) scale(1.01)',
                                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                                    boxShadow: `0 30px 60px ${alpha(theme.palette.primary.main, 0.15)}`
                                                }
                                            }}>
                                                {isAdmin && (
                                                    <Box sx={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 1 }}>
                                                        <IconButton size="small" onClick={() => handleEditClick(edu)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                                            <Edit2 size={16} />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(edu.id)} sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </Box>
                                                )}

                                                <Box sx={{
                                                    p: 2,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: 2,
                                                    display: { xs: 'none', sm: 'flex' },
                                                    boxShadow: `0 10px 15px -5px ${alpha(theme.palette.primary.main, 0.1)}`
                                                }}>
                                                    <GraduationCap size={32} color={theme.palette.primary.main} />
                                                </Box>

                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: 'primary.main' }}>
                                                        {edu.degree}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                                        {edu.institution}
                                                    </Typography>

                                                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                            <Calendar size={14} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                {edu.startDate} - {edu.endDate}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'secondary.main' }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                {edu.fieldOfStudy}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                        {edu.description}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                    )}
                </Box>
            </Container>

            <EducationForm
                open={formOpen}
                education={editingEducation}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default Education;
