import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Stack, alpha, useTheme, IconButton, Alert, Snackbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Edit2, MessageSquare, CheckCircle2, Settings } from 'lucide-react';
import { contactService } from '../../services/contactService';
import type { AboutData } from '../../services/aboutService';
import AboutForm from '../admin/AboutForm';
import ConfigForm from '../admin/ConfigForm';
import SectionHeader from '../common/SectionHeader';

import { useAbout } from '../../context/AboutContext';
import { successToast, errorToast } from '../../utils/toast';

const Contact: React.FC<{ isAdmin?: boolean }> = ({ isAdmin }) => {
    const theme = useTheme();
    const { aboutData, updateAbout } = useAbout();
    const [formOpen, setFormOpen] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleFormSubmit = async (data: AboutData) => {
        try {
            await updateAbout(data);
            successToast('Contact information updated successfully');
            setFormOpen(false);
        } catch (error) {
            errorToast('Failed to update contact info');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            await contactService.sendEmail(contactForm);
            setSuccessMsg('Thank you! Your message has been sent successfully.');
            setContactForm({ name: '', email: '', subject: '', message: '' });

            // Automatically reset back to the form after 6 seconds
            setTimeout(() => {
                setSuccessMsg('');
            }, 9000);
        } catch (error: any) {
            setErrorMsg('Failed to send message. Please try again later or contact me via email directly.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    return (
        <Box id="contact" sx={{ py: 6 }}>
            <SectionHeader
                index="08"
                title="Connect With Me"
                subtitle="Get In Touch"
                icon={<MessageSquare size={32} />}
                rightElement={isAdmin && (
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            sx={{
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                            }}
                            color="secondary"
                            onClick={() => setConfigOpen(true)}
                            title="SMTP Settings"
                        >
                            <Settings size={24} />
                        </IconButton>
                        <IconButton
                            sx={{
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                            }}
                            color="secondary"
                            onClick={() => setFormOpen(true)}
                        >
                            <Edit2 size={24} />
                        </IconButton>
                    </Stack>
                )}
            />

            <Container maxWidth="xl" sx={{ mt: 8 }}>
                <Grid container spacing={{ xs: 6, md: 10 }}>
                    {/* CONNECT INFO ON THE LEFT */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 950, letterSpacing: -1, mb: 3 }}>
                                Let's build <br />something <Box component="span" sx={{ color: 'primary.main' }}>amazing</Box>.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 6 }}>
                                Whether you have a specific project in mind or just want to say hello, my inbox is always open.
                            </Typography>

                            <Stack spacing={4}>
                                {[
                                    { icon: <Mail size={24} />, label: "EMAIL ME", value: aboutData?.email || 'N/A' },
                                    { icon: <Phone size={24} />, label: "CALL ME", value: aboutData?.phone || 'N/A' },
                                    { icon: <MapPin size={24} />, label: "LOCATION", value: aboutData?.location || 'N/A' }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            borderRadius: 4,
                                            color: 'primary.main',
                                            boxShadow: `0 10px 15px -5px ${alpha(theme.palette.primary.main, 0.1)}`
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 2, color: 'text.secondary' }}>{item.label}</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mt: 8 }}>
                                {[
                                    { Icon: Github, url: aboutData?.githubUrl || '#' },
                                    { Icon: Linkedin, url: aboutData?.linkedinUrl || '#' }
                                ].map((item, i) => (
                                    <IconButton
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.divider, 0.05),
                                            borderRadius: '16px',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                transform: 'translateY(-8px) rotate(8deg) scale(1.1)',
                                                boxShadow: `0px 15px 30px ${alpha(theme.palette.primary.main, 0.3)}`
                                            }
                                        }}
                                    >
                                        <item.Icon size={22} />
                                    </IconButton>
                                ))}
                            </Stack>
                        </motion.div>
                    </Grid>

                    {/* MESSAGE FORM ON THE RIGHT */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Box
                                component="form"
                                onSubmit={handleSendMessage}
                                sx={{
                                    p: { xs: 3, sm: 6 },
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    borderRadius: { xs: 4, sm: 8 },
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    backdropFilter: 'blur(30px)',
                                    boxShadow: `0px 40px 80px ${alpha(theme.palette.common.black, 0.2)}`,
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                        boxShadow: `0px 45px 90px ${alpha(theme.palette.common.black, 0.25)}`
                                    }
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {successMsg ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: 'spring', damping: 12 }}
                                            style={{
                                                textAlign: 'center',
                                                padding: '40px 20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{
                                                mb: 4,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 100,
                                                height: 100,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                color: 'white'
                                            }}>
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                                >
                                                    <CheckCircle2 size={56} strokeWidth={2.5} />
                                                </motion.div>
                                            </Box>

                                            <Typography
                                                variant="h3"
                                                fontWeight={950}
                                                gutterBottom
                                                sx={{
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    letterSpacing: -1,
                                                    mb: 2
                                                }}
                                            >
                                                Message Sent!
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                color="text.secondary"
                                                sx={{ mb: 6, maxWidth: 450, mx: 'auto', fontWeight: 500, opacity: 0.8 }}
                                            >
                                                Thank you for reaching out! Your message was delivered successfully and I'll get back to you as soon as possible.
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                onClick={() => setSuccessMsg('')}
                                                sx={{
                                                    borderRadius: '50px',
                                                    px: 6,
                                                    py: 1.8,
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1.5,
                                                    boxShadow: `0 12px 24px -10px ${alpha(theme.palette.primary.main, 0.4)}`
                                                }}
                                            >
                                                Send Another Message
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <Grid container spacing={4} component={motion.div} key="form">
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    name="name"
                                                    value={contactForm.name}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    name="email"
                                                    value={contactForm.email}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Project Subject"
                                                    name="subject"
                                                    value={contactForm.subject}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Message Details"
                                                    name="message"
                                                    value={contactForm.message}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    multiline
                                                    rows={5}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                                                />
                                            </Grid>

                                            {errorMsg && (
                                                <Grid size={12}>
                                                    <Alert severity="error" sx={{ borderRadius: '16px' }}>{errorMsg}</Alert>
                                                </Grid>
                                            )}

                                            <Grid size={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    disabled={loading}
                                                    endIcon={loading ? null : <Send size={20} />}
                                                    fullWidth
                                                    sx={{
                                                        py: 2.5,
                                                        borderRadius: '20px',
                                                        fontWeight: 900,
                                                        fontSize: '1rem',
                                                        letterSpacing: 2,
                                                        boxShadow: loading ? 'none' : `0 15px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                        '&:hover': {
                                                            transform: 'translateY(-8px) scale(1.02)',
                                                            boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.5)}`,
                                                            bgcolor: 'primary.dark'
                                                        }
                                                    }}
                                                >
                                                    {loading ? 'SENDING...' : 'SEND MESSAGE'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <AboutForm
                open={formOpen}
                about={aboutData}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <ConfigForm
                open={configOpen}
                onClose={() => setConfigOpen(false)}
            />

            <Snackbar
                open={!!errorMsg}
                autoHideDuration={6000}
                onClose={() => setErrorMsg('')}
            >
                <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%', borderRadius: '12px' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact;
