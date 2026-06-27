import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    alpha,
    useTheme
} from '@mui/material';
import { Video, Search } from 'lucide-react';
import api from '../../services/api';
import { errorToast } from '../../utils/toast';

interface VideoUploadProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
    onUploadSuccess,
    label = 'Upload Video'
}) => {
    const theme = useTheme();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.startsWith('video/')) {
                errorToast('Please select a valid video file.');
                return;
            }

            // Enforce 100MB client-side limit
            const MAX_SIZE = 100 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                errorToast(`Video is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 100 MB.`);
                return;
            }

            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', file);

                const response = await api.post('/upload', formData, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                        setProgress(percentCompleted);
                    }
                });

                onUploadSuccess(response.data.url);
            } catch (error: any) {
                console.error('Video upload failed:', error);
                const serverMsg = error.response?.data?.message;
                errorToast(serverMsg || 'Failed to upload video. Please try again.');
            } finally {
                setIsUploading(false);
                setProgress(0);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <input
                accept="video/*"
                style={{ display: 'none' }}
                id="video-upload-input"
                type="file"
                onChange={onFileChange}
                disabled={isUploading}
            />
            <label htmlFor="video-upload-input" style={{ flex: 1 }}>
                <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} variant="determinate" value={progress} /> : <Video size={20} />}
                    sx={{
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.05) },
                        height: 56
                    }}
                >
                    {isUploading ? `Uploading ${progress}%` : label}
                </Button>
            </label>
            <Button
                variant="outlined"
                onClick={() => {
                    const url = prompt('Enter Video URL:');
                    if (url) onUploadSuccess(url);
                }}
                disabled={isUploading}
                sx={{ minWidth: 0, px: 2, border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`, height: 56 }}
                title="Paste Video URL"
            >
                <Search size={20} />
            </Button>
        </Box>
    );
};

export default VideoUpload;
