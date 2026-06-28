import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
    useTheme,
} from '@mui/material';
import { X, Trash2 } from 'lucide-react';
import { Box } from '@mui/material';
import type { Achievement } from '../../types';
import ImageUpload from '../common/ImageUpload';

interface AchievementFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Achievement>) => Promise<void>;
    achievement?: Achievement | null;
}

const AchievementForm: React.FC<AchievementFormProps> = ({ open, onClose, onSubmit, achievement }) => {
    const [formData, setFormData] = useState<Partial<Achievement>>({
        title: '',
        date: '',
        description: '',
        issuer: '',
        imageUrls: [],
    });

    useEffect(() => {
        if (achievement) {
            setFormData({
                ...achievement,
                imageUrls: achievement.imageUrls || []
            });
        } else {
            setFormData({
                title: '',
                date: '',
                description: '',
                issuer: '',
                imageUrls: [],
            });
        }
    }, [achievement, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUploadSuccess = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            imageUrls: [...(prev.imageUrls || []), url],
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls?.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
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
                        {achievement ? 'EDIT ACHIEVEMENT' : 'ADD NEW ACHIEVEMENT'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={700}>Achievement Images</Typography>
                            <Box sx={{ mb: 2 }}>
                                <ImageUpload
                                    label="Add Image"
                                    onUploadSuccess={handleImageUploadSuccess}
                                />
                            </Box>
                            <Grid container spacing={2}>
                                {formData.imageUrls?.map((url, index) => (
                                    <Grid size={4} key={index}>
                                        <Box sx={{ position: 'relative', pt: '100%', borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                                            <Box
                                                component="img"
                                                src={url}
                                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'error.main' } }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <Trash2 size={14} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Issuer / Organization"
                                name="issuer"
                                value={formData.issuer || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Date"
                                name="date"
                                value={formData.date || ''}
                                onChange={handleInputChange}
                                placeholder="MM/YYYY"
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ px: 4 }}>
                        {achievement ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AchievementForm;
