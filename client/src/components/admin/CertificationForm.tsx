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
    Box
} from '@mui/material';
import { X, Trash2 } from 'lucide-react';
import type { Certification } from '../../types';
import ImageUpload from '../common/ImageUpload';

interface CertificationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Certification>) => Promise<void>;
    certification?: Certification | null;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ open, onClose, onSubmit, certification }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<Certification>>({
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
        imageUrls: [],
    });

    useEffect(() => {
        if (certification) {
            setFormData({
                ...certification,
                imageUrls: certification.imageUrls || []
            });
        } else {
            setFormData({
                name: '',
                issuingOrganization: '',
                issueDate: '',
                expirationDate: '',
                credentialId: '',
                credentialUrl: '',
                imageUrls: [],
            });
        }
    }, [certification, open]);

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
                        {certification ? 'EDIT CERTIFICATION' : 'ADD NEW CERTIFICATION'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Typography variant="subtitle2" gutterBottom fontWeight={700}>Credential Images / Certificates</Typography>
                            <Box sx={{ mb: 2 }}>
                                <ImageUpload
                                    label="Add Certificate Image"
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
                                label="Certification Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Issuing Organization"
                                name="issuingOrganization"
                                value={formData.issuingOrganization || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Issue Date"
                                name="issueDate"
                                value={formData.issueDate || ''}
                                onChange={handleInputChange}
                                placeholder="MM/YYYY"
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Expiration Date"
                                name="expirationDate"
                                value={formData.expirationDate || ''}
                                onChange={handleInputChange}
                                placeholder="MM/YYYY or N/A"
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Credential ID"
                                name="credentialId"
                                value={formData.credentialId || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Credential URL"
                                name="credentialUrl"
                                value={formData.credentialUrl || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ px: 4 }}>
                        {certification ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CertificationForm;
