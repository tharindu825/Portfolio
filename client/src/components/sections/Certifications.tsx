import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, alpha, useTheme, Grid, Card, IconButton, Button, Stack, Link } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Edit2, Trash2, Plus, BadgeCheck, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Certification as CertificationType } from '../../types';
import { certificationService } from '../../services/extraService';
import CertificationForm from '../admin/CertificationForm';
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

const Certifications: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [certifications, setCertifications] = useState<CertificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCertification, setEditingCertification] = useState<CertificationType | null>(null);
    const [previewState, setPreviewState] = useState<{ id: string, index: number } | null>(null);

    const fetchCertifications = async () => {
        try {
            const data = await certificationService.getAll();
            setCertifications(data || []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewState) return;
        const cert = certifications.find(c => c.id === previewState.id);
        if (cert?.imageUrls?.length) {
            setPreviewState({ ...previewState, index: (previewState.index + 1) % cert.imageUrls.length });
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewState) return;
        const cert = certifications.find(c => c.id === previewState.id);
        if (cert?.imageUrls?.length) {
            setPreviewState({ ...previewState, index: (previewState.index - 1 + cert.imageUrls.length) % cert.imageUrls.length });
        }
    };

    const handleAddClick = () => {
        setEditingCertification(null);
        setFormOpen(true);
    };

    const handleEditClick = (cert: CertificationType) => {
        setEditingCertification(cert);
        setFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        confirmDeleteToast('Are you sure you want to delete this certification?', async () => {
            try {
                await certificationService.delete(id);
                successToast('Certification deleted successfully');
                fetchCertifications();
            } catch (error) {
                errorToast('Failed to delete certification');
            }
        });
    };

    const handleFormSubmit = async (certData: Partial<CertificationType>) => {
        try {
            if (editingCertification) {
                await certificationService.update(editingCertification.id, certData);
                successToast('Certification updated successfully');
            } else {
                await certificationService.create(certData);
                successToast('New certification added successfully');
            }
            setFormOpen(false);
            fetchCertifications();
        } catch (error) {
            errorToast('Failed to save certification');
        }
    };

    return (
        <Box id="certifications" sx={{ py: 6 }}>
            <SectionHeader
                index="05"
                title="Professional Credentials"
                subtitle="Badges of Honor"
                icon={<BadgeCheck size={32} />}
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
                <Grid container spacing={6} justifyContent="center">
                    {loading ? (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography sx={{ opacity: 0.5, fontWeight: 800 }}>FETCHING CREDENTIALS...</Typography>
                        </Box>
                    ) : certifications.length === 0 ? (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4, opacity: 0.5 }}>

                        </Box>
                    ) : (
                        certifications.map((cert, index) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={cert.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    style={{ width: '100%', maxWidth: 450 }}
                                >
                                    <Card sx={{
                                        p: 0,
                                        height: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        borderRadius: 6,
                                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                                        backdropFilter: 'blur(30px)',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        overflow: 'hidden',
                                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            transform: 'translateY(-15px) scale(1.01)',
                                            boxShadow: `0 40px 80px ${alpha(theme.palette.primary.main, 0.25)}`,
                                            borderColor: alpha(theme.palette.primary.main, 0.4)
                                        }
                                    }}>
                                        {/* TOP IMAGE CONTAINER */}
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '200px',
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                position: 'relative'
                                            }}
                                        >
                                            {cert.imageUrls && cert.imageUrls.length > 0 ? (
                                                <ImageCarousel
                                                    images={cert.imageUrls}
                                                    onImageClick={(idx) => setPreviewState({ id: cert.id, index: idx })}
                                                />
                                            ) : (
                                                <Box sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: alpha(theme.palette.divider, 0.05)
                                                }}>
                                                    <Award size={80} color={theme.palette.primary.main} opacity={0.3} />
                                                </Box>
                                            )}

                                            {isAdmin && (
                                                <Box sx={{ position: 'absolute', top: 15, right: 15, zIndex: 10, display: 'flex', gap: 1 }}>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(cert); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' }, boxShadow: 5 }}>
                                                        <Edit2 size={16} />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(cert.id); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 5 }}>
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" sx={{
                                                    fontWeight: 900,
                                                    color: 'secondary.main',
                                                    px: 2,
                                                    py: 0.8,
                                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                    borderRadius: '50px',
                                                    fontSize: '0.7rem',
                                                    letterSpacing: 2,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    ISSUED {cert.issueDate}
                                                </Typography>
                                            </Box>

                                            <Typography variant="h5" sx={{
                                                fontWeight: 950,
                                                mb: 1,
                                                letterSpacing: -0.5,
                                                lineHeight: 1.2,
                                                color: 'text.primary'
                                            }}>
                                                {cert.name}
                                            </Typography>

                                            <Typography variant="h6" sx={{
                                                fontSize: '1.1rem',
                                                mb: 1.5,
                                                opacity: 0.8,
                                                fontWeight: 700,
                                                color: 'primary.main'
                                            }}>
                                                {cert.issuingOrganization}
                                            </Typography>

                                            <Box sx={{ mt: 0, pt: 0 }}>
                                                {cert.credentialUrl && (
                                                    <Button
                                                        component={Link}
                                                        href={cert.credentialUrl}
                                                        target="_blank"
                                                        variant="outlined"
                                                        fullWidth
                                                        endIcon={<ExternalLink size={16} />}
                                                        sx={{
                                                            borderRadius: '50px',
                                                            py: 1.2,
                                                            fontWeight: 900,
                                                            letterSpacing: 1,
                                                            borderWidth: 2,
                                                            '&:hover': {
                                                                borderWidth: 2,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s'
                                                        }}
                                                    >
                                                        VERIFY CREDENTIAL
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    )}
                </Grid>
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
                            {certifications.find(c => c.id === previewState.id)?.imageUrls?.length! > 1 && (
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
                                src={getMediaUrl(certifications.find(c => c.id === previewState.id)?.imageUrls![previewState.index])}
                                alt="Certification Expanded"
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
                            {certifications.find(c => c.id === previewState.id)?.imageUrls?.length! > 1 && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    color: 'text.primary',
                                    fontWeight: 900,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    px: 2, py: 0.5, borderRadius: '20px'
                                }}>
                                    {previewState.index + 1} / {certifications.find(c => c.id === previewState.id)?.imageUrls?.length}
                                </Box>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CertificationForm
                open={formOpen}
                certification={editingCertification}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default Certifications;
