import React from 'react';
import { Container, Grid, Typography, Box, alpha, useTheme, Stack, IconButton, Divider } from '@mui/material';
import { Github, Linkedin, Mail, ArrowUpCircle } from 'lucide-react';
import { useAbout } from '../../context/AboutContext';

interface FooterProps {
    brandName: string;
}

const Footer: React.FC<FooterProps> = ({ brandName }) => {
    const theme = useTheme();
    const { aboutData } = useAbout();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { Icon: Github, url: aboutData?.githubUrl || '#' },
        { Icon: Linkedin, url: aboutData?.linkedinUrl || '#' }
    ];

    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 6, md: 10 },
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Grain Effect look-alike */}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.03,
                pointerEvents: 'none',
                background: 'radial-gradient(circle, #fff 10%, transparent 11%)',
                backgroundSize: '3px 3px'
            }} />

            <Container maxWidth="xl">
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 900,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 3
                            }}
                        >
                            {brandName.toUpperCase()}.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 2, mb: 4 }}>
                            {aboutData?.footerAbout || 'Crafting innovative digital experiences with modern technologies and a passion for design.'}
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            {socialLinks.map((item, i) => (
                                <IconButton
                                    key={i}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        p: 1.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        color: 'primary.main',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: '#fff',
                                            transform: 'translateY(-8px) rotate(12deg) scale(1.1)',
                                            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                                        }
                                    }}
                                >
                                    <item.Icon size={18} />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, letterSpacing: 1.5 }}>
                            QUICK LINKS
                        </Typography>
                        <Grid container spacing={2}>
                            {['About', 'Skills', 'Experience', 'Education', 'Certifications', 'Projects', 'Achievements', 'Contact'].map((item) => (
                                <Grid size={6} key={item}>
                                    <Typography
                                        component="a"
                                        href={`#${item.toLowerCase()}`}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                transform: 'translateX(8px)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                width: 0,
                                                height: '2px',
                                                bgcolor: 'primary.main',
                                                mr: 0,
                                                transition: 'all 0.3s ease'
                                            },
                                            '&:hover::before': {
                                                width: '12px',
                                                mr: 1
                                            }
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, letterSpacing: 1.5 }}>
                            CONTACT INFO
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Mail size={18} color={theme.palette.secondary.main} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                                    {aboutData?.email || 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 4,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderRadius: 4,
                                textAlign: 'center',
                                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    transform: 'scale(1.02)',
                                    borderColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>Have a project in mind?</Typography>
                                <Typography
                                    variant="h6"
                                    component="a"
                                    href="#contact"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -2,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            bgcolor: 'primary.main',
                                            transform: 'scaleX(0)',
                                            transition: 'transform 0.3s ease'
                                        },
                                        '&:hover::after': {
                                            transform: 'scaleX(1)'
                                        }
                                    }}
                                >
                                    Let's Talk!
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 8, opacity: 0.1 }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: { xs: 2, sm: 4 },
                    textAlign: { xs: 'center', sm: 'left' }
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, opacity: 0.7, width: { xs: '100%', sm: 'auto' } }}>
                        &copy; {new Date().getFullYear()} {brandName.toUpperCase()} {aboutData?.footerCopyright || 'PORTFOLIO. MADE WITH PASSION.'}
                    </Typography>
                    <IconButton
                        onClick={scrollToTop}
                        sx={{
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2), transform: 'scale(1.1)' },
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowUpCircle size={24} />
                    </IconButton>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
