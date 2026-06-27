import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    useTheme,
    Stack,
} from '@mui/material';
import { Lock } from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
    onLogin: (isAdmin: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const theme = useTheme();

    const textFieldSX = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            overflow: 'visible',
            minHeight: '60px',
        },
        '& .MuiInputBase-input': {
            padding: '14px 12px',
            minHeight: '44px',
            lineHeight: 1.6,
            overflow: 'visible',
        },
        '& .MuiInputLabel-root': {
            backgroundColor: theme.palette.background.paper,
            px: 1,
            zIndex: 2,
            transformOrigin: 'top left',
        },
        '& .MuiInputLabel-shrink': {
            transform: 'translate(12px, -6px) scale(0.75)',
        },
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authService.login({ username, password });
            onLogin(true);
            onClose();
            setUsername('');
            setPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: '600px',
                    minHeight: '520px',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'visible',
                    boxShadow: 6,
                },
            }}
        >
            <DialogTitle component="div" sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                textAlign: 'center',
                py: 2
            }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}
                >
                    <Lock color="#fff" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>ADMIN ACCESS</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1 }}>AUTHENTICATION REQUIRED</Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 4, p: 4 }}>
                <form id="login-form" onSubmit={handleLogin}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                            autoComplete="username"
                            sx={textFieldSX}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            sx={textFieldSX}
                        />
                    </Stack>
                </form>
            </DialogContent>

            <DialogActions sx={{ p: 4 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    type="submit"
                    form="login-form"
                    variant="contained"
                    sx={{ px: 4 }}
                >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
