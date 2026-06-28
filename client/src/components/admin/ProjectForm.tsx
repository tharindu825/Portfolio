import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Stack,
    Chip,
    MenuItem,
    alpha,
    useTheme,
    IconButton,
} from '@mui/material';
import { X, Plus, Trash2, Video } from 'lucide-react';
import type { Project } from '../../types';
import ImageUpload from '../common/ImageUpload';
import VideoUpload from '../common/VideoUpload';
import { getMediaUrl } from '../../services/api';

interface ProjectFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (projectData: Partial<Project>) => Promise<void>;
    project?: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onClose, onSubmit, project }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        shortDescription: '',
        fullDescription: '',
        techStack: [],
        githubUrl: '',
        liveUrl: '',
        status: 'Ongoing',
        media: [],
    });
    const [newTech, setNewTech] = useState('');

    useEffect(() => {
        if (project) {
            setFormData(project);
        } else {
            setFormData({
                name: '',
                shortDescription: '',
                fullDescription: '',
                techStack: [],
                githubUrl: '',
                liveUrl: '',
                status: 'Ongoing',
                media: [],
            });
        }
    }, [project, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTech = () => {
        if (newTech && !formData.techStack?.includes(newTech)) {
            setFormData((prev) => ({
                ...prev,
                techStack: [...(prev.techStack || []), newTech],
            }));
            setNewTech('');
        }
    };

    const handleRemoveTech = (tech: string) => {
        setFormData((prev) => ({
            ...prev,
            techStack: prev.techStack?.filter((t) => t !== tech),
        }));
    };

    const handleMediaUploadSuccess = (url: string, type: 'IMAGE' | 'VIDEO' = 'IMAGE') => {
        setFormData((prev) => ({
            ...prev,
            media: [...(prev.media || []), {
                id: `temp-${Date.now()}`,
                projectId: project?.id || '',
                url: url,
                type: type
            }],
        }));
    };

    const handleRemoveMedia = (idOrIdx: string) => {
        setFormData((prev) => ({
            ...prev,
            // If idOrIdx is numeric (index), remove by index; otherwise remove by id match
            media: isNaN(Number(idOrIdx))
                ? prev.media?.filter((m) => m.id !== idOrIdx)
                : prev.media?.filter((_, i) => String(i) !== idOrIdx),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <DialogTitle component="div" sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    flexShrink: 0
                }}>
                    <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: 0.5 }}>
                        {project ? 'EDIT PROJECT DETAILS' : 'ADD NEW PROJECT'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="status"
                                value={formData.status || 'Ongoing'}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Short Description"
                                name="shortDescription"
                                value={formData.shortDescription || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Full Description"
                                name="fullDescription"
                                value={formData.fullDescription || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="GitHub URL"
                                name="githubUrl"
                                value={formData.githubUrl || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Live Preview URL"
                                name="liveUrl"
                                value={formData.liveUrl || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={700}>Tech Stack</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    size="small"
                                    label="Add Skill (e.g. React)"
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                />
                                <Button variant="outlined" startIcon={<Plus size={16} />} onClick={handleAddTech}>
                                    Add
                                </Button>
                            </Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {formData.techStack?.map((tech) => (
                                    <Chip
                                        key={tech}
                                        label={tech}
                                        onDelete={() => handleRemoveTech(tech)}
                                        size="small"
                                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                    />
                                ))}
                            </Stack>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={700}>Project Media (Images/Videos)</Typography>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <ImageUpload
                                        label="Add Project Image"
                                        onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'IMAGE')}
                                        aspectRatio={16 / 9}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <VideoUpload
                                        label="Add Project Video"
                                        onUploadSuccess={(url) => handleMediaUploadSuccess(url, 'VIDEO')}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {formData.media?.map((m, idx) => (
                                    <Grid size={4} key={`${m.url.slice(0, 40)}-${idx}`}>
                                        <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, bgcolor: 'black' }}>
                                            {m.type === 'IMAGE' ? (
                                                <Box
                                                    component="img"
                                                    src={getMediaUrl(m.url)}
                                                    sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', bgcolor: alpha(theme.palette.text.primary, 0.05) }}
                                                />
                                            ) : (
                                                <Box
                                                    component="video"
                                                    src={getMediaUrl(m.url)}
                                                    controls
                                                    sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            )}
                                            <IconButton
                                                size="small"
                                                sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'error.main' }, zIndex: 1 }}
                                                onClick={() => handleRemoveMedia(m.id || String(idx))}
                                            >
                                                <Trash2 size={14} />
                                            </IconButton>
                                            {m.type === 'VIDEO' && (
                                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.7, pointerEvents: 'none' }}>
                                                    <Video size={24} />
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ px: 4 }}>
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProjectForm;
