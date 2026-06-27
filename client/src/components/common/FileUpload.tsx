import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    alpha,
    useTheme
} from '@mui/material';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import api from '../../services/api';
import { errorToast } from '../../utils/toast';

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    onRemove?: () => void;
    label?: string;
    accept?: string;
    currentFileUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onUploadSuccess,
    onRemove,
    label = 'Upload File',
    accept = '.pdf,.doc,.docx',
    currentFileUrl
}) => {
    const theme = useTheme();
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);

            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', file);

                const response = await api.post('/upload', formData);
                onUploadSuccess(response.data.url);
            } catch (error) {
                console.error('Upload failed:', error);
                errorToast('Failed to upload file. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFileName(null);
        if (onRemove) onRemove();
    };

    return (
        <Box sx={{ width: '100%' }}>
            <input
                accept={accept}
                style={{ display: 'none' }}
                id="resume-upload-file"
                type="file"
                onChange={onFileChange}
            />
            <Box sx={{
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                transition: 'all 0.3s',
                position: 'relative',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                }
            }}>
                {(fileName || currentFileUrl) && onRemove && (
                    <Button
                        size="small"
                        color="error"
                        onClick={handleRemove}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            minWidth: 'auto',
                            p: 0.5,
                            borderRadius: '50%',
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                        }}
                    >
                        <X size={16} />
                    </Button>
                )}
                <label htmlFor="resume-upload-file" style={{ cursor: 'pointer', display: 'block' }}>
                    <Box sx={{ py: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            {isUploading ? (
                                <CircularProgress size={32} />
                            ) : fileName || currentFileUrl ? (
                                <CheckCircle color={theme.palette.success.main} size={32} />
                            ) : (
                                <Upload color={theme.palette.primary.main} size={32} />
                            )}

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    {isUploading ? 'Uploading...' : fileName ? fileName : label}
                                </Typography>
                                {currentFileUrl && !fileName && !isUploading && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                        <FileText size={12} /> Resume already uploaded
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        component="span"
                        size="small"
                        disabled={isUploading}
                        sx={{
                            mt: 2,
                            borderRadius: '50px',
                            px: 3,
                            fontWeight: 700,
                            textTransform: 'none'
                        }}
                    >
                        {isUploading ? 'Please wait...' : 'Select Document'}
                    </Button>
                </label>
            </Box>
        </Box>
    );
};

export default FileUpload;
