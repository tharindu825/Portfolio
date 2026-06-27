import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Stack,
    Chip,
    Button,
    Grid,
    alpha,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectModalProps {
    project: Project | null;
    open: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    if (!project) return null;

    const mediaList = project.media || [];
    const currentMedia = mediaList[currentMediaIndex];

    const handleNext = () => {
        setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
    };

    const handlePrev = () => {
        setCurrentMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose();
                setCurrentMediaIndex(0);
            }}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                    borderRadius: fullScreen ? 0 : 4,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                },
            }}
        >
            <DialogTitle component="div" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{project.name}</Typography>
                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <X size={24} />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Grid container>
                    {/* Media Slider Section */}
                    <Grid size={12}>
                        <Box sx={{ width: '100%', position: 'relative', pt: '56.25%', bgcolor: '#000', overflow: 'hidden' }}>
                            {mediaList.length > 0 ? (
                                <>
                                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {currentMedia.type === 'IMAGE' ? (
                                            <Box
                                                component="img"
                                                src={currentMedia.url}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                component="video"
                                                src={currentMedia.url}
                                                controls
                                                autoPlay
                                                muted
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {mediaList.length > 1 && (
                                        <>
                                            <IconButton
                                                onClick={handlePrev}
                                                sx={{
                                                    position: 'absolute',
                                                    left: 10,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                                }}
                                            >
                                                <ChevronLeft size={32} />
                                            </IconButton>
                                            <IconButton
                                                onClick={handleNext}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                                }}
                                            >
                                                <ChevronRight size={32} />
                                            </IconButton>

                                            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                                                {mediaList.map((_, i) => (
                                                    <Box
                                                        key={i}
                                                        onClick={() => setCurrentMediaIndex(i)}
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            bgcolor: i === currentMediaIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="text.secondary">No Media Available</Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Details Section */}
                    <Grid size={12} sx={{ p: 4 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 700 }}>
                                    Project Overview
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                                    {project.fullDescription}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 700 }}>
                                    Technologies Used
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {project.techStack.map((tech) => (
                                        <Chip
                                            key={tech}
                                            label={tech}
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.light',
                                                fontWeight: 600,
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ExternalLink size={18} />}
                                    href={project.liveUrl}
                                    target="_blank"
                                    sx={{ flex: 1 }}
                                >
                                    Live Demo
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Github size={18} />}
                                    href={project.githubUrl}
                                    target="_blank"
                                    sx={{ flex: 1 }}
                                >
                                    GitHub Repository
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectModal;

