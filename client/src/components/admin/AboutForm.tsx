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
    Box,
    IconButton,
    useTheme,
    alpha,
    Avatar,
    Stack
} from '@mui/material';
import { X } from 'lucide-react';
import type { AboutData } from '../../services/aboutService';
import ImageUpload from '../common/ImageUpload';
import FileUpload from '../common/FileUpload';
import { getMediaUrl } from '../../services/api';

interface AboutFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: AboutData) => Promise<void>;
    about: AboutData | null;
}

const AboutForm: React.FC<AboutFormProps> = ({ open, onClose, onSubmit, about }) => {
    const [formData, setFormData] = useState<AboutData>({
        heroTitle: '',
        heroMainTitlePrefix: '',
        heroMainTitleGradient: '',
        heroMainTitleSuffix: '',
        availabilityText: '',
        headline: '',
        profilePhotoUrl: '',
        heroSubtitle: '',
        email: '',
        phone: '',
        location: '',
        bioTitle: '',
        bioContent: '',
        yearsExperience: 0,
        projectsCompleted: 0,
        techStackCount: 0,
        skills: [],
        resumeUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        heroDescription: '',
        footerAbout: '',
        footerCopyright: ''
    });
    const [skillsText, setSkillsText] = useState('');

    useEffect(() => {
        if (open && about) {
            // Load and merge data with safety fallbacks
            setFormData({
                ...about,
                heroTitle: about.heroTitle || '',
                heroMainTitlePrefix: about.heroMainTitlePrefix || '',
                heroMainTitleGradient: about.heroMainTitleGradient || '',
                heroMainTitleSuffix: about.heroMainTitleSuffix || '',
                availabilityText: about.availabilityText || '',
                headline: about.headline || '',
                profilePhotoUrl: about.profilePhotoUrl || '',
                heroSubtitle: about.heroSubtitle || '',
                email: about.email || '',
                phone: about.phone || '',
                location: about.location || '',
                bioTitle: about.bioTitle || '',
                bioContent: about.bioContent || '',
                yearsExperience: about.yearsExperience || 0,
                projectsCompleted: about.projectsCompleted || 0,
                techStackCount: about.techStackCount || 0,
                skills: about.skills || [],
                resumeUrl: about.resumeUrl || '',
                githubUrl: about.githubUrl || '',
                linkedinUrl: about.linkedinUrl || '',
                heroDescription: about.heroDescription || '',
                footerAbout: about.footerAbout || '',
                footerCopyright: about.footerCopyright || ''
            });
            setSkillsText(about.skills?.join(', ') || '');
        }
    }, [about, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: (name === 'yearsExperience' || name === 'projectsCompleted' || name === 'techStackCount')
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            skills: skillsText.split(',').map(s => s.trim()).filter(s => s !== '')
        };
        await onSubmit(finalData);
    };

    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            PaperProps={{
                sx: { borderRadius: 4, bgcolor: 'background.paper' }
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <DialogTitle component="div" sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2.5,
                    px: 4,
                    flexShrink: 0
                }}>
                    <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: 1 }}>
                        EDIT PROFESSIONAL PROFILE
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={24} />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 4, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
                    <Grid container spacing={4}>
                        {/* SECTION 1: HERO & IDENTITY */}
                        <Grid size={12}>
                            <Box sx={{ pb: 1, mb: 3, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                <Typography variant="subtitle1" fontWeight={900} color="primary.main" sx={{ letterSpacing: 1 }}>
                                    1. HERO & IDENTITY
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Full Name" name="heroTitle" value={formData.heroTitle || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Main Role / Headline" name="headline" value={formData.headline || ''} onChange={handleInputChange} />
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5, letterSpacing: 1 }}>ANIMATED HERO TITLE (PREFIX | GRADIENT | SUFFIX)</Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField fullWidth label="Prefix (e.g. Designing)" name="heroMainTitlePrefix" value={formData.heroMainTitlePrefix || ''} onChange={handleInputChange} />
                                        <TextField fullWidth label="Gradient (e.g. Digital)" name="heroMainTitleGradient" value={formData.heroMainTitleGradient || ''} onChange={handleInputChange} />
                                        <TextField fullWidth label="Suffix (e.g. Experiences.)" name="heroMainTitleSuffix" value={formData.heroMainTitleSuffix || ''} onChange={handleInputChange} />
                                    </Stack>
                                </Grid>

                                <Grid size={12}>
                                    <TextField fullWidth label="Hero Headline Description" name="heroDescription" value={formData.heroDescription || ''} onChange={handleInputChange} multiline rows={2} placeholder="This appears next to your name in the Hero section..." />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Hero Long Subtitle" name="heroSubtitle" value={formData.heroSubtitle || ''} onChange={handleInputChange} multiline rows={2} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Availability Status" name="availabilityText" value={formData.availabilityText || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={getMediaUrl(formData.profilePhotoUrl)} sx={{ width: 56, height: 56, border: `2px solid ${theme.palette.primary.main}` }} />
                                        <ImageUpload onUploadSuccess={(url) => setFormData(p => ({ ...p, profilePhotoUrl: url }))} circular />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* SECTION 2: PROFESSIONAL LINKS */}
                        <Grid size={12}>
                            <Box sx={{ pb: 1, mb: 3, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`, mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight={900} color="primary.main" sx={{ letterSpacing: 1 }}>
                                    2. CONTACT & LINKS
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Email" name="email" value={formData.email || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Location" name="location" value={formData.location || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                                        <FileUpload label="Update Resume/CV" currentFileUrl={formData.resumeUrl} onUploadSuccess={(url) => setFormData(p => ({ ...p, resumeUrl: url }))} onRemove={() => setFormData(p => ({ ...p, resumeUrl: '' }))} />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="GitHub Link" name="githubUrl" value={formData.githubUrl || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="LinkedIn Link" name="linkedinUrl" value={formData.linkedinUrl || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Skills (Separated by commas)" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Python, AWS..." />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* SECTION 3: BIO & FOOTER */}
                        <Grid size={12}>
                            <Box sx={{ pb: 1, mb: 3, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`, mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight={900} color="primary.main" sx={{ letterSpacing: 1 }}>
                                    3. STORY & FOOTER
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <TextField fullWidth label="Biography Title" name="bioTitle" value={formData.bioTitle || ''} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Biography Content" name="bioContent" value={formData.bioContent || ''} onChange={handleInputChange} multiline rows={8} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth type="number" label="Years Exp" name="yearsExperience" value={formData.yearsExperience || 0} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth type="number" label="Projects Done" name="projectsCompleted" value={formData.projectsCompleted || 0} onChange={handleInputChange} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField fullWidth type="number" label="Tech Stack Count" name="techStackCount" value={formData.techStackCount || 0} onChange={handleInputChange} />
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5, letterSpacing: 1 }}>FOOTER CREDITS</Typography>
                                    <Stack direction="column" spacing={3}>
                                        <TextField fullWidth label="Footer About Tagline" name="footerAbout" value={formData.footerAbout || ''} onChange={handleInputChange} multiline rows={2} />
                                        <TextField fullWidth label="Footer Copyright Text" name="footerCopyright" value={formData.footerCopyright || ''} onChange={handleInputChange} />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 4, bgcolor: 'background.paper' }}>
                    <Button onClick={onClose} variant="outlined" color="inherit" sx={{ px: 4, borderRadius: 2 }}>Cancel</Button>
                    <Button type="submit" variant="contained" size="large" sx={{ px: 8, borderRadius: 2, fontWeight: 900 }}>
                        Save All Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AboutForm;
