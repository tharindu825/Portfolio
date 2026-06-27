import toast from 'react-hot-toast';
import { Box, Button, Typography, alpha } from '@mui/material';
import { Trash2 } from 'lucide-react';

export const confirmDeleteToast = (message: string, onConfirm: () => void) => {
    toast((t) => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: '250px',
            p: 1
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: alpha('#ff4b4b', 0.1),
                    color: '#ff4b4b'
                }}>
                    <Trash2 size={20} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {message}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                    size="small"
                    onClick={() => toast.dismiss(t.id)}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { bgcolor: alpha('#000', 0.05) }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => {
                        onConfirm();
                        toast.dismiss(t.id);
                    }}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 2
                    }}
                >
                    Delete
                </Button>
            </Box>
        </Box>
    ), {
        duration: 6000,
        position: 'top-center',
        id: 'delete-confirm', // Ensure only one shows up at a time
    });
};

export const successToast = (message: string) => {
    toast.success(message, {
        duration: 3000,
        icon: '✅',
    });
};

export const errorToast = (message: string) => {
    toast.error(message, {
        duration: 4000,
        icon: '❌',
    });
};
