import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Security as SecurityIcon,
  AutoAwesome as SparklesIcon,
  HelpOutline as HelpIcon,
  Email as EmailIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      id="app-footer"
      sx={{
        bgcolor: 'background.paper',
        py: 7,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        zIndex: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand & Mission */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="h6" color="primary.light" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                DesignKit Studio
              </Typography>
              <Chip
                label="100% Client-Side"
                size="small"
                color="success"
                variant="outlined"
                icon={<SecurityIcon style={{ fontSize: 14 }} />}
                sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
              Suite profesional de herramientas para creadores de contenido, diseñadores gráficos y especialistas en marketing. Optimización de banners publicitarios (IAB), análisis SEO de textos, generador de paletas y utilidades frontend 100% privadas y ejecutadas en el navegador.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Sin almacenamiento en servidores. Tus imágenes y textos nunca salen de tu dispositivo.
            </Typography>
          </Grid>

          {/* Tools Column 1: Image & Graphics */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Diseño & Imagen
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
              <li>
                <Link component={RouterLink} to="/" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Optimizador Banners (Imágenes)
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/gif-optimizer" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Banners GIF (≤ 180 KB)
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/color-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Color Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/gradient-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Gradient Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/aspect-ratio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Ratio Calculator
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/clip-path-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Clip-Path Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/shadow-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Shadow Studio
                </Link>
              </li>
            </Box>
          </Grid>

          {/* Tools Column 2: Content & Marketing */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Marketing & Código
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
              <li>
                <Link component={RouterLink} to="/texto" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  TextLab & SEO
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/utm-builder" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  UTM Builder
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/qr-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  QR Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/lorem-generator" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  LoremCraft
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/button-forge" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Button Forge
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/card-builder" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Card Builder
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/typescale-generator" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  TypeScale Generator
                </Link>
              </li>
            </Box>
          </Grid>

          {/* Legal & Company Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Información & Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& li': { mb: 1 } }}>
              <li>
                <Link component={RouterLink} to="/acerca-de" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <InfoIcon sx={{ fontSize: 16 }} /> Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/guia" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HelpIcon sx={{ fontSize: 16 }} /> Guía de Uso & Estándares
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/privacidad" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SecurityIcon sx={{ fontSize: 16 }} /> Política de Privacidad
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/terminos" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/contacto" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16 }} /> Contacto y Soporte
                </Link>
              </li>
            </Box>

            <Box sx={{ mt: 2.5, p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Correo Oficial:
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                atreart@outlook.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}{' '}
            <Link color="inherit" component={RouterLink} to="/" sx={{ fontWeight: 600 }}>
              DesignKit Studio
            </Link>
            {'. Todos los derechos reservados. Procesamiento local respetuoso con la privacidad.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link component={RouterLink} to="/privacidad" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
              Privacidad
            </Link>
            <Link component={RouterLink} to="/terminos" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
              Términos
            </Link>
            <Link component={RouterLink} to="/acerca-de" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
              Acerca de
            </Link>
            <Link component={RouterLink} to="/contacto" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
              Contacto
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
