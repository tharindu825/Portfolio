import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Stack,
    alpha,
    useTheme,
    IconButton,
} from '@mui/material';
import { ExternalLink, Github, Maximize2, Edit2, Trash2 } from 'lucide-react';
import type { Project } from '../../types';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    project: Project;
    onExpand: (project: Project) => void;
    isAdmin?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onExpand, isAdmin, onEdit, onDelete }) => {
    const theme = useTheme();

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        image={project.media[0]?.url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111827'/%3E%3Crect x='240' y='150' width='120' height='100' rx='8' fill='%231f2937'/%3E%3Cpath d='M270 185 L270 215 L300 200Z' fill='%234f46e5'/%3E%3Ctext x='300' y='290' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='14'%3ENo Preview%3C/text%3E%3C/svg%3E`}
                        alt={project.name}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        {isAdmin && (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(5px)', color: 'primary.main' }}
                                    onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                                >
                                    <Edit2 size={16} />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(5px)', color: 'error.main' }}
                                    onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </>
                        )}
                        <Chip
                            label={project.status}
                            size="small"
                            color={project.status === 'Completed' ? 'success' : 'warning'}
                            sx={{ fontWeight: 600, backdropFilter: 'blur(5px)', bgcolor: alpha(theme.palette.background.paper, 0.8) }}
                        />
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                        {project.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {project.shortDescription}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                        {project.techStack.map((tech) => (
                            <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    color: 'primary.light',
                                    fontSize: '0.7rem',
                                }}
                            />
                        ))}
                    </Stack>

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                startIcon={<Github size={16} />}
                                href={project.githubUrl}
                                target="_blank"
                                sx={{ color: 'text.secondary' }}
                            >
                                Code
                            </Button>
                            <Button
                                size="small"
                                startIcon={<ExternalLink size={16} />}
                                href={project.liveUrl}
                                target="_blank"
                                sx={{ color: 'text.secondary' }}
                            >
                                Demo
                            </Button>
                        </Stack>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Maximize2 size={16} />}
                            onClick={() => onExpand(project)}
                            sx={{ borderRadius: '15px' }}
                        >
                            Expand
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProjectCard;
