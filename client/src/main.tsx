import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { CustomThemeProvider } from './theme/ThemeProvider';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomThemeProvider>
      <CssBaseline />
      <App />
    </CustomThemeProvider>
  </StrictMode>,
);
