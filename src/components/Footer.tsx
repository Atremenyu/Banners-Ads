import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              DesignKit Studio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suite profesional de herramientas para creadores, diseñadores y marketeros. Optimización de imágenes, análisis de texto SEO y creador de URLs de campaña 100% en el cliente.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Herramientas
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link component={RouterLink} to="/" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Optimizador Banners
                </Link>
              </li>
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
                <Link component={RouterLink} to="/color-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Color Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/aspect-ratio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Ratio Calculator
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/qr-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  QR Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/gradient-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Gradient Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/lorem-generator" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  LoremCraft
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/shadow-studio" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Shadow Studio
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/guia" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Guía de Uso
                </Link>
              </li>
            </Box>
          </Grid>

          <Grid item xs={6} sm={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link component={RouterLink} to="/privacidad" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/terminos" color="text.secondary" variant="body2" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                  Términos
                </Link>
              </li>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              atreart@outlook.com
            </Typography>
            <Link component={RouterLink} to="/contacto" color="primary" variant="body2" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Enviar un mensaje
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" component={RouterLink} to="/">
            DesignKit Studio
          </Link>{' '}
          {new Date().getFullYear()}
          {'. Todos los derechos reservados.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
