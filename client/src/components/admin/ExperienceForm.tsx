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
import { X } from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (expData: Partial<Experience>) => Promise<void>;
    experience?: Experience | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ open, onClose, onSubmit, experience }) => {
    const [formData, setFormData] = useState<Partial<Experience>>({
        companyName: '',
        role: '',
        startDate: '',
        endDate: '',
        shortDescription: '',
        fullDescription: '',
    });

    useEffect(() => {
        if (experience) {
            setFormData(experience);
        } else {
            setFormData({
                companyName: '',
                role: '',
                startDate: '',
                endDate: '',
                shortDescription: '',
                fullDescription: '',
            });
        }
    }, [experience, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                        {experience ? 'EDIT PROFESSIONAL JOURNEY' : 'ADD NEW EXPERIENCE'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Role / Title"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Start Date (e.g. 2021)"
                                name="startDate"
                                value={formData.startDate || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="End Date (e.g. Present)"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Short Summary"
                                name="shortDescription"
                                value={formData.shortDescription || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={2}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Key Responsibilities / Details"
                                name="fullDescription"
                                value={formData.fullDescription || ''}
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
                        {experience ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ExperienceForm;
