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
    useTheme
} from '@mui/material';
import { X } from 'lucide-react';
import type { Education } from '../../types';

interface EducationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Education>) => Promise<void>;
    education?: Education | null;
}

const EducationForm: React.FC<EducationFormProps> = ({ open, onClose, onSubmit, education }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<Education>>({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    useEffect(() => {
        if (education) {
            setFormData(education);
        } else {
            setFormData({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                description: '',
            });
        }
    }, [education, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

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
                        {education ? 'EDIT EDUCATION' : 'ADD NEW EDUCATION'}
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
                                label="Institution"
                                name="institution"
                                value={formData.institution || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Degree"
                                name="degree"
                                value={formData.degree || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Field of Study"
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                name="startDate"
                                value={formData.startDate || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 2018"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="End Date"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. 2022"
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
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ px: 4 }}>
                        {education ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EducationForm;
