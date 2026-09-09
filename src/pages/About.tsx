import React from 'react';
import { Head } from 'vite-react-ssg';
import { Container, Typography, Box, Paper, Grid, Chip, Divider, Breadcrumbs, Link as MuiLink, Button, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  AutoAwesome as SparklesIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  CropFree as CropIcon,
  Link as LinkIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import AdPlaceholder from '@/components/AdPlaceholder';

const About = () => {
  return (
    <>
      <Head>
        <title>Acerca de Nosotros | DesignKit Studio & Banner Optimizer</title>
        <meta
          name="description"
          content="Conoce la historia, misión y filosofía técnica detrás de DesignKit Studio. Herramientas creativas de diseño y optimización de imágenes 100% privadas y ejecutadas en el navegador."
        />
        <meta name="keywords" content="acerca de designkit studio, historia banner optimizer, suite herramientas diseño, privacidad client side" />
        <meta property="og:title" content="Acerca de Nosotros | DesignKit Studio" />
        <meta property="og:description" content="Nuestra misión: brindar a diseñadores y creadores herramientas rápidas, gratuitas y 100% privadas en el navegador." />
        <meta property="og:type" content="website" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Inicio
          </MuiLink>
          <Typography color="text.primary">Acerca de Nosotros</Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip icon={<SparklesIcon />} label="Nuestra Misión y Visión" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Acerca de DesignKit Studio
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
            Creamos utilidades web de alto rendimiento diseñadas para acelerar el flujo de trabajo de diseñadores, especialistas en marketing digital y desarrolladores frontend.
          </Typography>
        </Box>

        {/* Story Paper */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            mb: 6,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800, color: 'primary.light' }}>
                ¿Por qué nació Banner Optimizer?
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                En el dinámico ecosistema de la publicidad digital y el diseño web, adaptar creatividades a múltiples proporciones (728x90, 600x500, 640x200, etc.) suele ser un proceso repetitivo, tedioso y propenso a pérdidas de calidad o archivos excesivamente pesados que perjudican el <strong>Core Web Vitals</strong> de los sitios web.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Muchas herramientas existentes obligan al usuario a subir sus imágenes a servidores remotos, exponiendo material confidencial de campañas a terceros y ralentizando la velocidad de descarga.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>DesignKit Studio</strong> nació con un principio innegociable: <strong>la privacidad por diseño</strong>. Gracias a los avances de las APIs modernas de HTML5 Canvas y Web Workers, logramos que todo el cálculo, recorte y compresión se efectúe íntegramente en la memoria de tu dispositivo.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 3, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon /> Nuestros 3 Pilares
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, color: 'text.secondary' }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                    <strong>1. Privacidad Inviolable:</strong> Ninguna imagen ni dato personal se almacena en la nube.
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
                    <strong>2. Velocidad Instantánea:</strong> Sin colas de servidor; procesamiento inmediato en tu navegador.
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>3. Estándares de la Industria:</strong> Dimensiones y formatos (WebP/JPG) alineados con las guías de Google Ads e IAB.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Suite of Tools Overview */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 800, mb: 4 }}>
            Un Ecosistema Creativo Completo
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <CropIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Banner Optimizer</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Recorta, redimensiona y comprime imágenes para los formatos más demandados en Google Display, Meta y newsletters.
                  </Typography>
                  <Button component={RouterLink} to="/" size="small" variant="text" color="primary">
                    Abrir Herramienta →
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <PaletteIcon color="secondary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Color Studio & Paletas</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Genera esquemas armónicos de color, verifica ratios de contraste WCAG AA/AAA y exporta tokens CSS/Tailwind listos para producción.
                  </Typography>
                  <Button component={RouterLink} to="/color-studio" size="small" variant="text" color="secondary">
                    Abrir Herramienta →
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LinkIcon color="info" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>UTM Campaign Builder</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Construye enlaces de seguimiento limpios y estandarizados para Google Analytics 4, campañas de correo y redes sociales.
                  </Typography>
                  <Button component={RouterLink} to="/utm-builder" size="small" variant="text" color="info">
                    Abrir Herramienta →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Commitment to Quality & AdSense Policies */}
        <Paper
          sx={{
            p: 4,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 3,
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            textAlign: 'center',
            mb: 6
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Compromiso con la Calidad y la Comunidad
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', mb: 3 }}>
            Mantenemos nuestras herramientas 100% gratuitas mediante publicidad no invasiva provista por Google AdSense, cumpliendo rigurosamente todas las políticas de valor de contenido, transparencia en cookies y directrices para webmasters.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button component={RouterLink} to="/contacto" variant="contained" color="primary">
              Contáctanos
            </Button>
            <Button component={RouterLink} to="/guia" variant="outlined" color="inherit">
              Explorar la Guía
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <AdPlaceholder type="horizontal" label="Inferior Acerca De" />
        </Box>
      </Container>
    </>
  );
};

export default About;
