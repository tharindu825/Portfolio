import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    Alert,
    useTheme,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { configService } from '../../services/configService';
import { useAbout } from '../../context/AboutContext';

interface ConfigFormProps {
    open: boolean;
    onClose: () => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const { aboutData } = useAbout();
    const [config, setConfig] = useState({
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '465',
        SMTP_USER: '',
        SMTP_PASS: '',
        SMTP_SECURE: 'true',
        CONTACT_RECEIVER_EMAIL: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (open) {
            fetchConfig();
        }
    }, [open]);

    const fetchConfig = async () => {
        try {
            const data = await configService.getAll();
            setConfig(prev => ({
                ...prev,
                ...data,
                // Keep these hardcoded as per request
                SMTP_HOST: 'smtp.gmail.com',
                SMTP_PORT: '465',
                SMTP_SECURE: 'true'
            }));
        } catch (err) {
            console.error('Failed to fetch config', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow changing SMTP_PASS
        if (name === 'SMTP_PASS') {
            setConfig(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Clean password (remove spaces if pasted from Google)
        const sanitizedConfig = {
            ...config,
            SMTP_PASS: config.SMTP_PASS.replace(/\s/g, ''),
            SMTP_USER: aboutData?.email || '',
            CONTACT_RECEIVER_EMAIL: aboutData?.email || ''
        };

        try {
            await configService.update(sanitizedConfig);
            setSuccess('SMTP Password updated successfully.');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
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
                <DialogTitle sx={{
                    p: 3,
                    fontWeight: 900,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    flexShrink: 0
                }}>
                    <Settings size={28} />
                    Admin: Email SMTP Settings
                </DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Most settings are auto-configured for Gmail. Please provide your **16-digit App Password** below.
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="SMTP Host"
                                name="SMTP_HOST"
                                value={config.SMTP_HOST}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                                helperText="Pre-configured for Gmail"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="SMTP Port"
                                name="SMTP_PORT"
                                value={config.SMTP_PORT}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ mt: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="SMTP_SECURE"
                                            checked={config.SMTP_SECURE === "true"}
                                            disabled
                                            color="primary"
                                        />
                                    }
                                    label="Secure (SSL/TLS)"
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="SMTP User (Auto-filled from profile)"
                                name="SMTP_USER"
                                value={aboutData?.email || ''}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                                helperText="To change this, update your email in the Profile editor."
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Gmail App Password (16-digits)"
                                name="SMTP_PASS"
                                value={config.SMTP_PASS}
                                onChange={handleChange}
                                autoFocus
                                helperText="Go to Google Account Security > App Passwords"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Receiver Email"
                                name="CONTACT_RECEIVER_EMAIL"
                                value={aboutData?.email || ''}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

                    {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ConfigForm;
