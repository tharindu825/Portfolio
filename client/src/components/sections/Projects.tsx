import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, alpha, useTheme, Grid, Card, CardContent,
    CardMedia, IconButton, Chip, Stack, Button, Dialog, DialogTitle,
    DialogContent
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Edit2, Trash2, Plus, Code2, X, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project as ProjectType } from '../../types';
import { projectService } from '../../services/projectService';
import ProjectForm from '../admin/ProjectForm';
import SectionHeader from '../common/SectionHeader';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { confirmDeleteToast, successToast, errorToast } from '../../utils/toast';
import { getMediaUrl } from '../../services/api';

const Projects: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const [demoProject, setDemoProject] = useState<ProjectType | null>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
    const [previewMediaState, setPreviewMediaState] = useState<{ projectId: string, index: number } | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Lazy-load full media for a project (only when user opens detail/demo)
    const fetchFullProject = async (project: ProjectType, mode: 'detail' | 'demo' | 'edit') => {
        // Set basic info immediately for UI responsiveness
        if (mode === 'detail') setSelectedProject(project);
        else if (mode === 'demo') setDemoProject(project);
        else if (mode === 'edit') { setEditingProject(project); setFormOpen(true); }

        setLoadingDetail(true);
        try {
            const full = await projectService.getOne(project.id);
            if (mode === 'detail') setSelectedProject(prev => prev?.id === full.id ? { ...prev, ...full } : full);
            else if (mode === 'demo') setDemoProject(prev => prev?.id === full.id ? { ...prev, ...full } : full);
            else if (mode === 'edit') { 
                setEditingProject(full); 
                // Don't setFormOpen true again as it might have been opened with partial data
            }
        } catch {
            // Error handled by partial data already set
            console.error('Failed to fetch full project details');
        } finally {
            setLoadingDetail(false);
        }
    };

    const nextMedia = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewMediaState) return;
        const project = projects.find(p => p.id === previewMediaState.projectId);
        if (project?.media?.length) {
            setPreviewMediaState({ ...previewMediaState, index: (previewMediaState.index + 1) % project.media.length });
        }
    };

    const prevMedia = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!previewMediaState) return;
        const project = projects.find(p => p.id === previewMediaState.projectId);
        if (project?.media?.length) {
            setPreviewMediaState({ ...previewMediaState, index: (previewMediaState.index - 1 + project.media.length) % project.media.length });
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const toggleDescription = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddClick = () => {
        setEditingProject(null);
        setFormOpen(true);
    };

    const handleEditClick = (project: ProjectType) => {
        fetchFullProject(project, 'edit');
    };

    const handleDeleteClick = (id: string) => {
        confirmDeleteToast('Are you sure you want to delete this project?', async () => {
            try {
                await projectService.delete(id);
                successToast('Project deleted successfully');
                fetchProjects();
            } catch (error) {
                errorToast('Failed to delete project');
            }
        });
    };

    const handleFormSubmit = async (projectData: Partial<ProjectType>) => {
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, projectData);
                successToast('Project updated successfully');
            } else {
                await projectService.create(projectData);
                successToast('New project added successfully');
            }
            setFormOpen(false);
            fetchProjects();
        } catch (error) {
            errorToast('Failed to save project');
        }
    };

    return (
        <Box id="projects" sx={{ py: 10, bgcolor: alpha(theme.palette.background.default, 0.3) }}>
            <SectionHeader
                index="06"
                title="PROJECTS"
                subtitle="INNOVATION PORTFOLIO"
                icon={<Code2 size={32} />}
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

                <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                    {loading ? (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography sx={{ fontWeight: 800, opacity: 0.5 }}>FETCHING INNOVATIONS...</Typography>
                        </Box>
                    ) : (
                        projects.map((project, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    style={{ width: '100%', maxWidth: 400, display: 'flex' }}
                                >
                                    <Card sx={{
                                        width: '100%',
                                        height: 600,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        bgcolor: alpha(theme.palette.background.paper, 0.4),
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-12px)',
                                            boxShadow: `0 30px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
                                            borderColor: alpha(theme.palette.primary.main, 0.3)
                                        }
                                    }}>
                                        {isAdmin && (
                                            <Box sx={{ position: 'absolute', top: 15, right: 15, zIndex: 10, display: 'flex', gap: 1 }}>
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditClick(project); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' }, boxShadow: 5 }}>
                                                    <Edit2 size={16} />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(project.id); }} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.9), '&:hover': { bgcolor: 'error.main', color: 'white' }, boxShadow: 5 }}>
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Box>
                                        )}
                                        <Box
                                            sx={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in', height: 240, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                                            onClick={() => {
                                                if (project.media && project.media.length > 0) {
                                                    setPreviewMediaState({ projectId: project.id, index: 0 });
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={(project.media && project.media.filter(m => m.type === 'IMAGE').length > 0)
                                                    ? getMediaUrl(project.media.filter(m => m.type === 'IMAGE')[0].url)
                                                    : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111827'/%3E%3Crect x='240' y='150' width='120' height='100' rx='8' fill='%231f2937'/%3E%3Cpath d='M270 185 L270 215 L300 200Z' fill='%234f46e5'/%3E%3Ctext x='300' y='290' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='14'%3ENo Preview%3C/text%3E%3C/svg%3E`}
                                                alt={project.name}
                                                sx={{ objectFit: 'contain', transition: 'transform 0.8s ease', '&:hover': { transform: 'scale(1.05)' } }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 15,
                                                left: 15,
                                                bgcolor: 'background.paper',
                                                color: 'text.primary',
                                                px: 1.2,
                                                py: 0.4,
                                                borderRadius: 1.5,
                                                fontSize: '0.6rem',
                                                fontWeight: 900,
                                                letterSpacing: 1,
                                                boxShadow: 10
                                            }}>
                                                {project.status.toUpperCase()}
                                            </Box>
                                            {project.media?.some(m => m.type === 'VIDEO') && (
                                                <Box sx={{ position: 'absolute', bottom: 15, right: 15, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', p: 0.8, borderRadius: '50%', display: 'flex', backdropFilter: 'blur(5px)' }}>
                                                    <Video size={14} />
                                                </Box>
                                            )}
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 3, pb: 2, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 900,
                                                mb: 1.5,
                                                fontSize: '1.25rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {project.name}
                                            </Typography>

                                            <Box sx={{
                                                mb: 2,
                                                maxHeight: expandedDescriptions[project.id] ? 200 : 'none',
                                                overflowY: expandedDescriptions[project.id] ? 'auto' : 'visible',
                                                pr: expandedDescriptions[project.id] ? 1 : 0,
                                                '&::-webkit-scrollbar': { width: '4px' },
                                                '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: '4px' }
                                            }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    lineHeight: 1.6,
                                                    fontSize: '0.9rem',
                                                    display: expandedDescriptions[project.id] ? 'block' : '-webkit-box',
                                                    WebkitLineClamp: expandedDescriptions[project.id] ? 'unset' : 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    {project.shortDescription}
                                                </Typography>
                                                {project.shortDescription.length > 100 && (
                                                    <Button
                                                        size="small"
                                                        onClick={(e) => toggleDescription(project.id, e)}
                                                        sx={{ p: 0, minWidth: 0, mt: 0.5, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none' }}
                                                    >
                                                        {expandedDescriptions[project.id] ? 'Read Less' : 'Read More'}
                                                    </Button>
                                                )}
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={loadingDetail}
                                            onClick={() => fetchFullProject(project, 'detail')}
                                                    sx={{
                                                        borderRadius: 2,
                                                        py: 1,
                                                        fontWeight: 900,
                                                        fontSize: '0.75rem',
                                                        letterSpacing: 1,
                                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                        '&:hover': {
                                                            transform: 'translateY(-5px) scale(1.02)',
                                                            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                            filter: 'brightness(1.1)'
                                                        }
                                                    }}
                                                >
                                                    EXPLORE PROJECT
                                                </Button>
                                                {project.media?.some(m => m.type === 'VIDEO') && (
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                        startIcon={<Video size={16} />}
                                                        onClick={(e) => { e.stopPropagation(); fetchFullProject(project, 'demo'); }}
                                                        sx={{
                                                            borderRadius: 2,
                                                            py: 0.8,
                                                            fontWeight: 900,
                                                            fontSize: '0.7rem',
                                                            letterSpacing: 1,
                                                            borderColor: alpha(theme.palette.secondary.main, 0.5),
                                                            color: 'secondary.main',
                                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                            '&:hover': {
                                                                borderColor: 'secondary.main',
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.08),
                                                                transform: 'translateY(-5px)',
                                                                boxShadow: `0 8px 16px ${alpha(theme.palette.secondary.main, 0.15)}`
                                                            }
                                                        }}
                                                    >
                                                        VIEW DEMO
                                                    </Button>
                                                )}
                                            </Box>

                                            <Box sx={{ pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', alignItems: 'center' }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ width: '85%' }}>
                                                    {project.techStack?.slice(0, 4).map((tech) => (
                                                        <Chip
                                                            key={tech}
                                                            label={tech.toUpperCase()}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.65rem',
                                                                fontWeight: 900,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                                color: 'primary.main',
                                                                borderRadius: '5px',
                                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                                <Box sx={{ width: '15%', display: 'flex', justifyContent: 'flex-end' }}>
                                                    {project.githubUrl && (
                                                        <IconButton
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            size="small"
                                                            sx={{
                                                                p: 0.8,
                                                                bgcolor: alpha(theme.palette.text.primary, 0.05),
                                                                color: 'text.primary',
                                                                '&:hover': {
                                                                    bgcolor: 'primary.main',
                                                                    color: 'white',
                                                                    transform: 'rotate(10deg) scale(1.1)'
                                                                },
                                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                            }}
                                                        >
                                                            <Github size={18} />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

            {/* THUMBNAIL PREVIEW LIGHTBOX */}
            <AnimatePresence>
                {previewMediaState && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewMediaState(null)}
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
                            {projects.find(p => p.id === previewMediaState.projectId)?.media?.length! > 1 && (
                                <>
                                    <IconButton
                                        onClick={prevMedia}
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
                                        onClick={nextMedia}
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

                            {projects.find(p => p.id === previewMediaState.projectId)?.media![previewMediaState.index]?.type === 'VIDEO' ? (
                                <video
                                    src={getMediaUrl(projects.find(p => p.id === previewMediaState.projectId)?.media![previewMediaState.index]?.url)}
                                    controls
                                    autoPlay
                                    style={{
                                        maxWidth: '85%',
                                        maxHeight: '80vh',
                                        borderRadius: '16px',
                                        boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.3)}`
                                    }}
                                />
                            ) : (
                                <img
                                    src={getMediaUrl(projects.find(p => p.id === previewMediaState.projectId)?.media![previewMediaState.index]?.url)}
                                    alt="Project Preview"
                                    style={{
                                        maxWidth: '85%',
                                        maxHeight: '80vh',
                                        borderRadius: '16px',
                                        boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.3)}`,
                                        objectFit: 'contain',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                    }}
                                />
                            )}

                            <IconButton
                                onClick={() => setPreviewMediaState(null)}
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
                            {projects.find(p => p.id === previewMediaState.projectId)?.media?.length! > 1 && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    color: 'text.primary',
                                    fontWeight: 900,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    px: 2, py: 0.5, borderRadius: '20px'
                                }}>
                                    {previewMediaState.index + 1} / {projects.find(p => p.id === previewMediaState.projectId)?.media?.length}
                                </Box>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProjectForm
                open={formOpen}
                project={editingProject}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            {/* Project Details Dialog */}
            <ProjectDetailsDialog
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />

            <ProjectDemoDialog
                project={demoProject}
                onClose={() => setDemoProject(null)}
            />
        </Box>
    );
};

const ProjectDetailsDialog: React.FC<{ project: ProjectType | null, onClose: () => void }> = ({ project, onClose }) => {
    const theme = useTheme();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        setCurrentMediaIndex(0);
        setZoom(1);
    }, [project]);

    if (!project) return null;

    const nextMedia = () => {
        if (project.media && project.media.length > 0) {
            setCurrentMediaIndex((prev) => (prev + 1) % project.media!.length);
            setZoom(1);
        }
    };

    const prevMedia = () => {
        if (project.media && project.media.length > 0) {
            setCurrentMediaIndex((prev) => (prev - 1 + project.media!.length) % project.media!.length);
            setZoom(1);
        }
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

    return (
        <Dialog
            open={Boolean(project)}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 6, overflow: 'hidden', bgcolor: 'background.paper' }
            }}
        >
            <DialogTitle component="div" sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 3,
                px: 4
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>{project.name.toUpperCase()}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 2 }}>PROJECT SHOWCASE</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}>
                    <X size={28} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, border: 'none' }}>
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    {/* Featured Media Carousel */}
                    <Box sx={{
                        width: '100%',
                        borderRadius: 4,
                        overflow: 'hidden',
                        mb: 5,
                        position: 'relative',
                        boxShadow: 20,
                        aspectRatio: { xs: '4/3', md: '16/9' },
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                        {project.media && project.media.length > 0 ? (
                            <>
                                <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <motion.div
                                        key={currentMediaIndex}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{
                                            opacity: 1,
                                            scale: (project.media[currentMediaIndex]?.type === 'IMAGE' ? zoom : 1)
                                        }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {!project.media[currentMediaIndex]?.url ? (
                                            <Box sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2
                                            }}>
                                                <Box sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    border: '3px solid',
                                                    borderColor: alpha(theme.palette.primary.main, 0.1),
                                                    borderTopColor: theme.palette.primary.main,
                                                    animation: 'spin 1s linear infinite',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' }
                                                    }
                                                }} />
                                                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.5, letterSpacing: 2 }}>
                                                    STREAMING MEDIA...
                                                </Typography>
                                            </Box>
                                        ) : project.media[currentMediaIndex].type === 'IMAGE' ? (
                                            <Box
                                                component="img"
                                                src={getMediaUrl(project.media[currentMediaIndex].url)}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    cursor: zoom > 1 ? 'grab' : 'default',
                                                    transformOrigin: 'center center'
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                component="video"
                                                src={getMediaUrl(project.media[currentMediaIndex].url)}
                                                controls
                                                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        )}
                                    </motion.div>
                                </Box>

                                {/* Zoom Controls */}
                                {project.media[currentMediaIndex]?.type === 'IMAGE' && project.media[currentMediaIndex]?.url && (
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 25,
                                        right: 25,
                                        display: 'flex',
                                        gap: 1.5,
                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                        p: 1,
                                        borderRadius: 2,
                                        backdropFilter: 'blur(10px)',
                                        zIndex: 10
                                    }}>
                                        <IconButton size="small" onClick={handleZoomOut} sx={{ color: 'text.primary' }} disabled={zoom <= 0.5}>
                                            <ZoomOut size={18} />
                                        </IconButton>
                                        <Typography
                                            onClick={() => setZoom(1)}
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 900,
                                                minWidth: 40,
                                                textAlign: 'center',
                                                alignSelf: 'center',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                '&:hover': { color: 'primary.main' }
                                            }}
                                        >
                                            {Math.round(zoom * 100)}%
                                        </Typography>
                                        <IconButton size="small" onClick={handleZoomIn} sx={{ color: 'text.primary' }} disabled={zoom >= 5}>
                                            <ZoomIn size={18} />
                                        </IconButton>
                                    </Box>
                                )}

                                {project.media.length > 1 && (
                                    <>
                                        {/* Glassmorphism Arrows */}
                                        <IconButton
                                            onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                            sx={{
                                                position: 'absolute',
                                                left: 20,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: alpha(theme.palette.background.paper, 0.6),
                                                backdropFilter: 'blur(8px)',
                                                color: 'text.primary',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                p: 1.5,
                                                '&:hover': { bgcolor: 'primary.main', border: '1px solid transparent', color: 'white' },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <ChevronLeft size={28} />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                            sx={{
                                                position: 'absolute',
                                                right: 20,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: alpha(theme.palette.background.paper, 0.6),
                                                backdropFilter: 'blur(8px)',
                                                color: 'text.primary',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                p: 1.5,
                                                '&:hover': { bgcolor: 'primary.main', border: '1px solid transparent', color: 'white' },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <ChevronRight size={28} />
                                        </IconButton>

                                        {/* Image Counter Badge */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 20,
                                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                                            backdropFilter: 'blur(10px)',
                                            color: 'text.primary',
                                            px: 2,
                                            py: 0.8,
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 900,
                                            letterSpacing: 1,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                        }}>
                                            {currentMediaIndex + 1} / {project.media.length}
                                        </Box>

                                        {/* Dot Indicators */}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 25,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            display: 'flex',
                                            gap: 1.5,
                                            bgcolor: alpha(theme.palette.background.paper, 0.4),
                                            p: 1,
                                            px: 2,
                                            borderRadius: '50px',
                                            backdropFilter: 'blur(5px)'
                                        }}>
                                            {(project.media || []).map((_, i) => (
                                                <Box
                                                    key={i}
                                                    onClick={() => setCurrentMediaIndex(i)}
                                                    sx={{
                                                        width: i === currentMediaIndex ? 24 : 8,
                                                        height: 8,
                                                        borderRadius: '50px',
                                                        bgcolor: i === currentMediaIndex ? 'primary.main' : alpha(theme.palette.text.primary, 0.2),
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.divider, 0.1) }}>
                                <Typography variant="h6" color="text.secondary">NO MEDIA AVAILABLE</Typography>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>About the Project</Typography>
                             <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, fontSize: '1.1rem', mb: 5, whiteSpace: 'pre-wrap' }}>
                                {project.fullDescription || project.shortDescription}
                            </Typography>

                            <Box sx={{ pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
                                {/* Skills Section in Footer Area */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 3 }}>
                                        TECH STACK & TOOLS
                                    </Typography>
                                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                                        {project.techStack?.map((tech) => (
                                            <Chip
                                                key={tech}
                                                label={tech.toUpperCase()}
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: '0.75rem',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    color: 'primary.main',
                                                    borderRadius: 2,
                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    px: 1,
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.3s'
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                {project.liveUrl && (
                                    <Button
                                        variant="contained"
                                        startIcon={<ExternalLink />}
                                        href={project.liveUrl}
                                        target="_blank"
                                        sx={{
                                            borderRadius: 3,
                                            py: 1.5,
                                            px: 4,
                                            fontWeight: 800,
                                            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                                        }}
                                    >
                                        LIVE DEMO
                                    </Button>
                                )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

const ProjectDemoDialog: React.FC<{ project: ProjectType | null, onClose: () => void }> = ({ project, onClose }) => {
    const theme = useTheme();
    const video = project?.media?.find(m => m.type === 'VIDEO');

    if (!project || !video) return null;

    return (
        <Dialog
            open={Boolean(project)}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper' }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                py: 2,
                px: 3
            }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 0 }}>{project.name.toUpperCase()} - DEMO VIDEO</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 1 }}>EXPERIENCE THE INNOVATION</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}>
                    <X size={24} />
                </IconButton>
            </DialogTitle>
            <Box sx={{ width: '100%', aspectRatio: '16/9', display: 'flex', bgcolor: alpha(theme.palette.primary.main, 0.05), position: 'relative' }}>
                <Box
                    component="video"
                    src={getMediaUrl(video.url)}
                    controls
                    autoPlay
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </Box>
        </Dialog>
    );
};

export default Projects;
