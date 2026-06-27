import React from 'react';
import { Box, Typography, alpha, useTheme, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    index?: string; // Optional section number like "01"
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, rightElement, index }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'sticky',
                top: { xs: 64, md: 70 },
                zIndex: 10,
                pt: 4,
                pb: 2,
                bgcolor: alpha(theme.palette.background.default, 0.9),
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pb: 1 }}>
                    <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, alignItems: 'flex-start' }}>
                        {/* ICON & NUMBER BLOCK */}
                        <Box sx={{ position: 'relative' }}>
                            {index && (
                                <Typography
                                    variant="h1"
                                    sx={{
                                        position: 'absolute',
                                        left: -20,
                                        top: -30,
                                        fontSize: { xs: '3rem', sm: '5rem' },
                                        fontWeight: 900,
                                        opacity: 0.04,
                                        color: 'primary.main',
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    {index}
                                </Typography>
                            )}
                            <motion.div
                                initial={{ rotate: -15, scale: 0.8 }}
                                whileInView={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    color: 'primary.main',
                                    display: 'flex',
                                    boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`
                                }}>
                                    {icon}
                                </Box>
                            </motion.div>
                        </Box>

                        <Stack spacing={0.5}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'secondary.main',
                                        fontWeight: 900,
                                        letterSpacing: 4,
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        opacity: 0.8
                                    }}
                                >
                                    {subtitle}
                                </Typography>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: -1.5,
                                        fontSize: { xs: '2rem', md: '2.8rem' },
                                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.6)})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {title}
                                </Typography>
                            </motion.div>
                        </Stack>
                    </Box>

                    {rightElement && (
                        <Box sx={{ mb: 1 }}>
                            {rightElement}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default SectionHeader;
