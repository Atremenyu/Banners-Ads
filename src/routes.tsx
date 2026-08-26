import React from 'react';
import { RouteRecord } from 'vite-react-ssg';
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';

import Index from "./pages/Index";
import TextLabPage from "./pages/TextLabPage";
import UtmPage from "./pages/UtmPage";
import ColorStudioPage from "./pages/ColorStudioPage";
import AspectRatioPage from "./pages/AspectRatioPage";
import QrStudioPage from "./pages/QrStudioPage";
import GradientStudioPage from "./pages/GradientStudioPage";
import CopyGenPage from "./pages/CopyGenPage";
import ShadowStudioPage from "./pages/ShadowStudioPage";
import ButtonForgePage from "./pages/ButtonForgePage";
import CardBuilderPage from "./pages/CardBuilderPage";
import ClipPathPage from "./pages/ClipPathPage";
import TypeScalePage from "./pages/TypeScalePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Modern crisp blue
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0b0f17', // Rich deep slate/dark
      paper: '#131c2e',   // Elegant container fill
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.1rem',
      '@media (min-width:600px)': { fontSize: '2.75rem' },
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      '@media (min-width:600px)': { fontSize: '2.2rem' },
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': { fontSize: '1.85rem' },
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': { fontSize: '1.5rem' },
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.1rem',
      '@media (min-width:600px)': { fontSize: '1.25rem' },
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.95rem',
      '@media (min-width:600px)': { fontSize: '1.05rem' },
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1600,
    },
  },
});

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Box sx={{ flex: 1 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'texto',
        element: <TextLabPage />,
      },
      {
        path: 'utm-builder',
        element: <UtmPage />,
      },
      {
        path: 'color-studio',
        element: <ColorStudioPage />,
      },
      {
        path: 'aspect-ratio',
        element: <AspectRatioPage />,
      },
      {
        path: 'qr-studio',
        element: <QrStudioPage />,
      },
      {
        path: 'gradient-studio',
        element: <GradientStudioPage />,
      },
      {
        path: 'lorem-generator',
        element: <CopyGenPage />,
      },
      {
        path: 'shadow-studio',
        element: <ShadowStudioPage />,
      },
      {
        path: 'button-forge',
        element: <ButtonForgePage />,
      },
      {
        path: 'card-builder',
        element: <CardBuilderPage />,
      },
      {
        path: 'clip-path-studio',
        element: <ClipPathPage />,
      },
      {
        path: 'typescale-generator',
        element: <TypeScalePage />,
      },
      {
        path: 'privacidad',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terminos',
        element: <TermsOfService />,
      },
      {
        path: 'contacto',
        element: <Contact />,
      },
      {
        path: 'guia',
        element: <Guide />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

