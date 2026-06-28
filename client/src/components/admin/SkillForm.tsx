import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Box,
    Typography,
    IconButton,
    Chip,
    alpha,
    useTheme
} from '@mui/material';
import { Plus, X, Award, ListChecks } from 'lucide-react';
import type { SkillSectionData } from '../../services/skillService';

interface SkillFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SkillSectionData) => void;
    initialData?: SkillSectionData | null;
}

const SkillForm: React.FC<SkillFormProps> = ({ open, onClose, onSubmit, initialData }) => {
    const theme = useTheme();
    const [title, setTitle] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState('');

    useEffect(() => {
        if (open) {
            if (initialData) {
                setTitle(initialData.title);
                setSkills(initialData.skills || []);
            } else {
                setTitle('');
                setSkills([]);
            }
        }
    }, [initialData, open]);

    const handleAddSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()]);
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: initialData?.id,
            title,
            skills
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, overflow: 'hidden' }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle
                    component="div"
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2.5,
                        px: 3
                    }}
                >
                    <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Award size={24} />
                        {initialData ? 'EDIT SKILL CATEGORY' : 'ADD NEW SKILL CATEGORY'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                        <X size={24} />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 4, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
                    <Stack spacing={4}>
                        <Box>
                            <Box sx={{ pb: 1, mb: 2.5, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                <Typography variant="subtitle2" fontWeight={900} color="primary.main" sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ListChecks size={18} />
                                    1. CORE INFORMATION
                                </Typography>
                            </Box>
                            <TextField
                                label="Category Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Frontend Development"
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ pb: 1, mb: 2.5, borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                                <Typography variant="subtitle2" fontWeight={900} color="primary.main" sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Plus size={18} />
                                    2. MANAGE SUB-SKILLS
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                                <TextField
                                    label="Add Sub-Skill"
                                    fullWidth
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                    placeholder="e.g. React.js"
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddSkill}
                                    disabled={!currentSkill.trim()}
                                    sx={{ borderRadius: 3, minWidth: 60, boxShadow: theme.shadows[4] }}
                                >
                                    <Plus size={24} />
                                </Button>
                            </Stack>

                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                p: 2.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                borderRadius: 3,
                                border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                                minHeight: 80,
                                alignItems: 'center'
                            }}>
                                {skills.map((skill) => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        onDelete={() => handleRemoveSkill(skill)}
                                        sx={{
                                            bgcolor: 'background.paper',
                                            fontWeight: 700,
                                            px: 1,
                                            height: 36,
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            '& .MuiChip-label': { px: 1.5 },
                                            '& .MuiChip-deleteIcon': {
                                                color: 'primary.main',
                                                '&:hover': { color: 'error.main' }
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                borderColor: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                                {skills.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                                        No skills added. Enter a skill above and click "+"
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, px: 4, bgcolor: 'background.paper' }}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!title || skills.length === 0}
                        sx={{
                            px: 5,
                            borderRadius: 3,
                            fontWeight: 900,
                            letterSpacing: 1,
                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        {initialData ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SkillForm;
