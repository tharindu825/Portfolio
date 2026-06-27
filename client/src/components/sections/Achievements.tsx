import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, alpha, useTheme, Grid, Card,
    IconButton, Button, Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Edit2, Trash2, Plus, Star, ChevronLeft, ChevronRight, Award, X } from 'lucide-react';
import type { Achievement as AchievementType } from '../../types';
import { achievementService } from '../../services/extraService';
import AchievementForm from '../admin/AchievementForm';
import SectionHeader from '../common/SectionHeader';
import { confirmDeleteToast, successToast, errorToast } from '../../utils/toast';
import { getMediaUrl } from '../../services/api';

// IMAGE CAROUSEL COMPONENT
const ImageCarousel: React.FC<{ images: string[], onImageClick?: (index: number) => void }> = ({ images, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();

    if (!images || !images.length) return null;

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={getMediaUrl(images[currentIndex])}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => onImageClick?.(currentIndex)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        cursor: 'zoom-in'
                    }}
                />
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <IconButton
                        onClick={prev}
                        sx={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: 'blur(10px)',
                            color: 'text.primary',
                            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.7) }
                        }}
                        size="small"
                    >
                        <ChevronLeft size={20} />
                    </IconButton>
                    <IconButton
                        onClick={next}
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: 'blur(10px)',
                            color: 'text.primary',
                            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.7) }
                        }}
                        size="small"
                    >
                        <ChevronRight size={20} />
                    </IconButton>

                    {/* Pagination Dots */}
                    <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                        {images.map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: i === currentIndex ? 'secondary.main' : 'rgba(255,255,255,0.4)',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                        ))}
                    </Stack>
                </>
            )}
        </Box>
    );
};

const Achievements: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [achievements, setAchievements] = useState<AchievementType[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<AchievementType | null>(null);
    const [previewState, setPreviewState] = useState<{ id: string, index: number } | null>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

    const toggleDescription = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewState) return;
        const achievement = achievements.find(a => a.id === previewState.id);
        if (achievement?.imageUrls?.length) {
            setPreviewState({ ...previewState, index: (previewState.index + 1) % achievement.imageUrls.length });
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewState) return;
        const achievement = achievements.find(a => a.id === previewState.id);
        if (achievement?.imageUrls?.length) {
            setPreviewState({ ...previewState, index: (previewState.index - 1 + achievement.imageUrls.length) % achievement.imageUrls.length });
        }
    };

    const fetchAchievements = async () => {
        try {
            const data = await achievementService.getAll();
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleAddClick = () => {
        setEditingAchievement(null);
        setFormOpen(true);
    };

    const handleEditClick = (achievement: AchievementType) => {
        setEditingAchievement(achievement);
        setFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        confirmDeleteToast('Are you sure you want to delete this achievement?', async () => {
            try {
                await achievementService.delete(id);
                successToast('Achievement deleted successfully');
                fetchAchievements();
            } catch (error) {
                errorToast('Failed to delete achievement');
            }
        });
    };

    const handleFormSubmit = async (achievementData: Partial<AchievementType>) => {
        try {
            if (editingAchievement) {
                await achievementService.update(editingAchievement.id, achievementData);
                successToast('Achievement updated successfully');
            } else {
                await achievementService.create(achievementData);
                successToast('New achievement added successfully');
            }
            setFormOpen(false);
            fetchAchievements();
        } catch (error) {
            errorToast('Failed to save achievement');
        }
    };

    return (
        <Box id="achievements" sx={{ py: 6 }}>
            <SectionHeader
                index="07"
                title="Honors & Awards"
                subtitle="Milestones"
                icon={<Star size={32} />}
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
                {loading ? (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                        <Typography>Loading achievements...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={6} justifyContent="center">
                        {achievements.map((achievement, index) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={achievement.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: index * 0.1 }}
                                    style={{ width: '100%', maxWidth: 450 }} // Centered and responsive
                                >
                                    <Card sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '580px', // Uniform Height
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 6,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        backdropFilter: 'blur(30px)',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        overflow: 'hidden',
                                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            transform: 'translateY(-14px) scale(1.02)',
                                            borderColor: alpha(theme.palette.secondary.main, 0.5),
                                            boxShadow: `0 40px 80px -20px ${alpha(theme.palette.secondary.main, 0.4)}`,
                                            '& .award-image-container': {
                                                transform: 'scale(1.08)',
                                            }
                                        }
                                    }}>
                                        {/* IMAGE CONTAINER */}
                                        <Box className="award-image-container" sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '240px', // Fixed height for visual consistency
                                            transition: 'transform 0.6s ease',
                                            bgcolor: alpha(theme.palette.secondary.main, 0.05)
                                        }}>
                                            {achievement.imageUrls && achievement.imageUrls.length > 0 ? (
                                                <ImageCarousel
                                                    images={achievement.imageUrls}
                                                    onImageClick={(idx) => setPreviewState({ id: achievement.id, index: idx })}
                                                />
                                            ) : (
                                                <Box sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: alpha(theme.palette.divider, 0.05)
                                                }}>
                                                    <Trophy size={48} opacity={0.2} />
                                                </Box>
                                            )}

                                            {isAdmin && (
                                                <Box sx={{ position: 'absolute', top: 15, right: 15, zIndex: 10, display: 'flex', gap: 1 }}>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(achievement); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' }, boxShadow: 5 }}>
                                                        <Edit2 size={16} />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(achievement.id); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 5 }}>
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Box>
                                            )}

                                            <Box sx={{
                                                position: 'absolute',
                                                top: 15,
                                                left: 15,
                                                px: 2,
                                                py: 0.8,
                                                bgcolor: alpha(theme.palette.background.paper, 0.9),
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 10,
                                                zIndex: 10,
                                                boxShadow: theme.shadows[2],
                                                border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
                                            }}>
                                                <Typography variant="caption" sx={{ fontWeight: 950, color: 'secondary.main', letterSpacing: 1.5, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                                    {achievement.date}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* CARD CONTENT */}
                                        <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '50px',
                                                    mb: 2,
                                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                                                }}>
                                                    <Trophy size={14} color={theme.palette.secondary.main} />
                                                    <Typography variant="overline" sx={{ fontWeight: 900, color: 'secondary.main', letterSpacing: 2, fontSize: '0.7rem', lineHeight: 1 }}>
                                                        Achievement
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h5" sx={{
                                                    fontWeight: 950, color: 'text.primary', lineHeight: 1.25, mb: 1, letterSpacing: -0.5,
                                                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                }}>
                                                    {achievement.title}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                                                    <Award size={16} /> {achievement.issuer}
                                                </Typography>
                                            </Box>

                                            <Box
                                                className="description-scroll-box"
                                                sx={{
                                                    flex: 1,
                                                    maxHeight: expandedDescriptions[achievement.id] ? 300 : '140px',
                                                    overflowY: 'auto',
                                                    pr: 1,
                                                    bgcolor: alpha(theme.palette.background.default, 0.2),
                                                    p: 2.5,
                                                    borderRadius: 3,
                                                    borderLeft: `3px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                                                    '&::-webkit-scrollbar': { width: '4px' },
                                                    '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.secondary.main, 0.2), borderRadius: 10 },
                                                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                                    transition: 'max-height 0.4s ease'
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    lineHeight: 1.8,
                                                    fontSize: '0.92rem',
                                                    fontStyle: 'italic',
                                                    opacity: 0.9,
                                                    fontWeight: 500,
                                                    display: expandedDescriptions[achievement.id] ? 'block' : '-webkit-box',
                                                    WebkitLineClamp: expandedDescriptions[achievement.id] ? 'unset' : 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}>
                                                    "{achievement.description}"
                                                </Typography>
                                                {achievement.description.length > 100 && (
                                                    <Button
                                                        size="small"
                                                        onClick={(e) => toggleDescription(achievement.id, e)}
                                                        sx={{ p: 0, minWidth: 0, mt: 1, fontWeight: 800, fontSize: '0.7rem', textTransform: 'none', color: 'secondary.main' }}
                                                    >
                                                        {expandedDescriptions[achievement.id] ? 'READ LESS' : 'READ MORE'}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* FULL SCREEN IMAGE PREVIEW */}
            <AnimatePresence>
                {previewState && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewState(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: alpha(theme.palette.background.default, 0.95),
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                            padding: '40px',
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {/* Navigation Arrows */}
                            {achievements.find(a => a.id === previewState.id)?.imageUrls?.length! > 1 && (
                                <>
                                    <IconButton
                                        onClick={prevImage}
                                        sx={{
                                            position: 'absolute',
                                            left: -80,
                                            color: 'text.primary',
                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8) }
                                        }}
                                    >
                                        <ChevronLeft size={48} />
                                    </IconButton>
                                    <IconButton
                                        onClick={nextImage}
                                        sx={{
                                            position: 'absolute',
                                            right: -80,
                                            color: 'text.primary',
                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                            '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8) }
                                        }}
                                    >
                                        <ChevronRight size={48} />
                                    </IconButton>
                                </>
                            )}

                            <img
                                src={getMediaUrl(achievements.find(a => a.id === previewState.id)?.imageUrls![previewState.index])}
                                alt="Achievement Expanded"
                                style={{
                                    maxWidth: '85%',
                                    maxHeight: '80vh',
                                    borderRadius: '16px',
                                    boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.3)}`,
                                    objectFit: 'contain',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                }}
                            />

                            <IconButton
                                onClick={() => setPreviewState(null)}
                                sx={{
                                    position: 'absolute',
                                    top: -60,
                                    right: 0,
                                    color: 'text.primary',
                                    '&:hover': { transform: 'rotate(90deg)' },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <X size={32} />
                            </IconButton>

                            {/* Counter */}
                            {achievements.find(a => a.id === previewState.id)?.imageUrls?.length! > 1 && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    color: 'text.primary',
                                    fontWeight: 900,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    px: 2, py: 0.5, borderRadius: '20px'
                                }}>
                                    {previewState.index + 1} / {achievements.find(a => a.id === previewState.id)?.imageUrls?.length}
                                </Box>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AchievementForm
                open={formOpen}
                achievement={editingAchievement}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default Achievements;
