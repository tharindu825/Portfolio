import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
    Box,
    Slider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    alpha,
    useTheme
} from '@mui/material';
import { Upload, Check, Search } from 'lucide-react';
import getCroppedImg from '../../utils/cropImage';
import api from '../../services/api';
import { errorToast } from '../../utils/toast';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
    aspectRatio?: number;
    circular?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUploadSuccess,
    label = 'Upload Image',
    aspectRatio,
    circular = false
}) => {
    const theme = useTheme();
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [dynamicAspect, setDynamicAspect] = useState<number | undefined>(
        aspectRatio ?? (circular ? 1 : 16 / 9)
    );
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImage(reader.result as string);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (!image || !croppedAreaPixels) return;

        try {
            setIsUploading(true);
            const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);

            if (croppedImageBlob) {
                const formData = new FormData();
                formData.append('file', croppedImageBlob, 'profile.jpg');

                const response = await api.post('/upload', formData);

                onUploadSuccess(response.data.url);
                setIsCropping(false);
                setImage(null);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            errorToast('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={onFileChange}
                />
                <label htmlFor="raised-button-file" style={{ flex: 1 }}>
                    <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        startIcon={<Upload size={20} />}
                        sx={{
                            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}
                    >
                        {label}
                    </Button>
                </label>
                <Button
                    variant="outlined"
                    onClick={() => {
                        const url = prompt('Enter Image URL:');
                        if (url) {
                            // Block large base64 strings being pasted directly (use upload instead)
                            if (url.startsWith('data:') && url.length > 500 * 1024) {
                                errorToast('Pasted image data is too large. Please use the Upload button for high-quality images.');
                                return;
                            }
                            onUploadSuccess(url);
                        }
                    }}
                    sx={{ minWidth: 0, px: 2, border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}` }}
                    title="Paste Image URL"
                >
                    <Search size={20} />
                </Button>
            </Box>

            <Dialog
                open={isCropping}
                onClose={() => !isUploading && setIsCropping(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle component="div" sx={{ fontWeight: 800 }}>Adjust Image</DialogTitle>
                <DialogContent sx={{ position: 'relative', height: 400, bgcolor: '#000' }}>
                    {image && (
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            minZoom={0.1}
                            maxZoom={10}
                            aspect={dynamicAspect}
                            cropShape={circular ? 'round' : 'rect'}
                            showGrid={true}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            restrictPosition={false}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', p: 3, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Search size={20} />
                        <Slider
                            value={zoom}
                            min={0.1}
                            max={10}
                            step={0.01}
                            aria-labelledby="Zoom"
                            onChange={(_e, value) => {
                                const val = typeof value === 'number' ? value : value[0];
                                setZoom(val);
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Button
                            size="small"
                            onClick={() => {
                                const img = new Image();
                                img.src = image!;
                                img.onload = () => {
                                    setDynamicAspect(img.width / img.height);
                                    setZoom(1);
                                };
                            }}
                            sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                            Original Aspect
                        </Button>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                disabled={isUploading}
                                onClick={() => setIsCropping(false)}
                                color="inherit"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isUploading}
                                variant="contained"
                                onClick={handleCropSave}
                                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <Check size={20} />}
                            >
                                {isUploading ? 'Uploading...' : 'Done'}
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ImageUpload;
