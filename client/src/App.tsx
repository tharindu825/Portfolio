import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Certifications from './components/sections/Certifications';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import LoginDialog from './components/admin/LoginDialog';
import { authService } from './services/authService';

import { AboutProvider, useAbout } from './context/AboutContext';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let timeoutId: any;

    if (isAdmin) {
      // Set a 10-minute safety timeout to auto-logout
      timeoutId = setTimeout(() => {
        handleLogout();
        toast.error('Admin session expired for security. Returning to User View Mode.', {
          duration: 5000,
          position: 'top-center'
        });
      }, 10 * 60 * 1000); // 10 minutes
    }

    const handleAuthExpired = () => {
      console.warn('Session expired. Logging out.');
      handleLogout();
      setLoginOpen(true);
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAdmin]);

  const handleLogout = () => {
    authService.logout();
    setIsAdmin(false);
  };

  return (
    <AboutProvider>
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
        },
      }} />
      <AboutContent isAdmin={isAdmin} loginOpen={loginOpen} setLoginOpen={setLoginOpen} onLogout={handleLogout} setIsAdmin={setIsAdmin} />
    </AboutProvider>
  );
};

const AboutContent: React.FC<{
  isAdmin: boolean;
  loginOpen: boolean;
  setLoginOpen: (val: boolean) => void;
  onLogout: () => void;
  setIsAdmin: (val: boolean) => void;
}> = ({ isAdmin, loginOpen, setLoginOpen, onLogout, setIsAdmin }) => {
  const { aboutData } = useAbout();
  const name = aboutData?.heroTitle || '';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', transition: 'background-color 0.5s linear' }}>
      <Navbar onAdminClick={() => setLoginOpen(true)} isAdmin={isAdmin} onLogout={onLogout} brandName={name} />
      <Box component="main">
        <Hero isAdmin={isAdmin} />
        <About isAdmin={isAdmin} />
        <Skills isAdmin={isAdmin} />
        <Experience isAdmin={isAdmin} />
        <Education isAdmin={isAdmin} />
        <Certifications isAdmin={isAdmin} />
        <Projects isAdmin={isAdmin} />
        <Achievements isAdmin={isAdmin} />
        <Contact isAdmin={isAdmin} />
        <Footer brandName={name} />
      </Box>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(val) => setIsAdmin(val)}
      />
    </Box>
  );
};

export default App;
