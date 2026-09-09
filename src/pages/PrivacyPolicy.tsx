import React from 'react';
import { Head } from 'vite-react-ssg';
import { Container, Typography, Box, Paper, Divider, Breadcrumbs, Link as MuiLink, Grid, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Security as SecurityIcon,
  Cookie as CookieIcon,
  VpnLock as PrivacyIcon,
  Gavel as LegalIcon,
  Email as EmailIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import AdPlaceholder from '@/components/AdPlaceholder';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidad | DesignKit Studio & Banner Optimizer</title>
        <meta
          name="description"
          content="Conoce nuestra Política de Privacidad. Procesamiento 100% en el navegador (client-side), sin almacenamiento de imágenes en servidores y uso transparente de cookies de Google AdSense."
        />
        <meta name="keywords" content="política de privacidad, privacidad banner optimizer, cookies adsense, client side privacy, gdpr" />
        <meta property="og:title" content="Política de Privacidad | DesignKit Studio" />
        <meta property="og:description" content="Información transparente sobre el tratamiento de datos y cookies en DesignKit Studio y Banner Optimizer." />
        <meta property="og:type" content="website" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumb navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Inicio
          </MuiLink>
          <Typography color="text.primary">Política de Privacidad</Typography>
        </Breadcrumbs>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Chip icon={<PrivacyIcon />} label="Transparencia y Seguridad" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              Política de Privacidad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actualización y revisión legal: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Core Highlights */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SecurityIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Procesamiento Local (Client-Side)</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tus imágenes, textos y configuraciones se procesan 100% en la memoria de tu navegador mediante HTML5 Canvas y Web APIs. Ningún archivo se envía ni se almacena en servidores externos.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CookieIcon color="success" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Cookies y Publicidad</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Google AdSense utiliza cookies para mostrar anuncios relevantes basados en tus visitas a este y otros sitios. Puedes inhabilitar la personalización en cualquier momento.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LegalIcon color="secondary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Control de Tus Derechos</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No recopilamos datos personales sensibles, perfiles de usuario obligatorios ni contraseñas. Cumplimos con normativas internacionales de protección de privacidad.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Section 1: Introducción y Alcance */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              1. Introducción y Alcance
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              En <strong>DesignKit Studio</strong> (accesible desde esta aplicación web y sus herramientas asociadas como Banner Optimizer, TextLab, Color Studio y UTM Builder), valoramos profundamente la privacidad de nuestros usuarios y nos comprometemos a mantener los más altos estándares de transparencia y seguridad.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Esta Política de Privacidad describe de manera detallada qué tipo de información se procesa al utilizar nuestras herramientas, cómo interactúan los servicios de terceros (como redes publicitarias de Google) y qué opciones tienes para controlar tus preferencias de navegación.
            </Typography>
          </Box>

          {/* Section 2: Procesamiento de Archivos e Imágenes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              2. Tratamiento de Imágenes y Archivos (Arquitectura Zero-Server Storage)
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Una de las principales ventajas de DesignKit Studio es su <strong>arquitectura de procesamiento en el lado del cliente (Client-Side)</strong>. Cuando utilizas herramientas como Banner Optimizer para redimensionar, comprimir, recortar o convertir imágenes a formatos WebP, JPG o PNG:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, color: 'text.secondary' }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>No se transfieren archivos a servidores:</strong> Las imágenes se cargan en la memoria RAM local de tu navegador web a través del estándar File API y Canvas API de HTML5.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Cero almacenamiento en la nube:</strong> No poseemos bases de datos donde se almacenen copias de tus fotografías, logotipos, banners o creatividades publicitarias.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Generación de descargas segura:</strong> La compresión individual y el empaquetado en archivos ZIP (vía bibliotecas JavaScript locales) se ejecuta enteramente en tu procesador local.
              </Typography>
            </Box>
          </Box>

          {/* Section 3: Google AdSense y Cookies de Terceros */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              3. Proveedores Externos y Publicidad de Google AdSense
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Para mantener esta plataforma gratuita y en constante desarrollo, utilizamos proveedores de publicidad externos, principalmente <strong>Google AdSense</strong>.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              De conformidad con las políticas de editores de Google, informamos explícitamente lo siguiente:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, color: 'text.secondary' }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Cookies publicitarias de Google:</strong> Proveedores externos, incluido Google, utilizan cookies para publicar anuncios basados en las visitas anteriores que un usuario ha realizado a este sitio web o a otros sitios en Internet.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Uso de cookies de publicidad (DoubleClick / DART):</strong> El uso de cookies de publicidad permite a Google y a sus socios comerciales publicar anuncios basados en las visitas que los usuarios realizan a nuestros sitios o a otros sitios web de Internet.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Inhabilitación de la publicidad personalizada:</strong> Los usuarios pueden inhabilitar la publicidad personalizada en cualquier momento a través de la{' '}
                <MuiLink href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Configuración de anuncios de Google (Google Ads Settings)
                </MuiLink>.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                <strong>Inhabilitación general de cookies de proveedores externos:</strong> De forma alternativa, los usuarios pueden optar por no recibir cookies de proveedores externos para la publicidad basada en intereses visitando el portal de la Digital Advertising Alliance en{' '}
                <MuiLink href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  www.aboutads.info
                </MuiLink>{' '}
                o el portal europeo{' '}
                <MuiLink href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  www.youronlinechoices.eu
                </MuiLink>.
              </Typography>
            </Box>
          </Box>

          {/* Section 4: Registro de Servidor y Analíticas */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              4. Datos de Registro y Analítica Web
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Al igual que la gran mayoría de servicios web, nuestros servidores de alojamiento o redes CDN (como Netlify/Cloudflare) pueden registrar automáticamente información técnica no identificable enviada por tu navegador, como dirección IP anonimizada, tipo de navegador, sistema operativo, páginas de referencia y fecha/hora de solicitud. Esta información se utiliza exclusivamente para fines de diagnóstico de estabilidad, seguridad frente a ataques de denegación de servicio (DDoS) y optimización de rendimiento.
            </Typography>
          </Box>

          {/* Section 5: Derechos de los Usuarios (GDPR / CCPA / LFPDPPP) */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              5. Derechos de Protección de Datos (GDPR, CCPA y Legislación Aplicable)
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Dependiendo de tu ubicación geográfica, puedes tener derechos específicos respecto a tu privacidad:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <CheckIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Derecho de Acceso y Rectificación:</strong> Consultar qué datos técnicos se procesan y solicitar su corrección.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <CheckIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Derecho de Supresión (Derecho al Olvido):</strong> Solicitar el borrado de cualquier registro de contacto enviado voluntariamente.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <CheckIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Derecho de Oposición:</strong> Negarse al uso de cookies de seguimiento publicitario mediante las herramientas indicadas.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <CheckIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Derecho a la No Discriminación:</strong> Disfrutar plenamente de nuestras herramientas gratuitas independientemente de tus opciones de cookies.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Section 6: Enlaces Externos */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              6. Enlaces a Sitios de Terceros
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Nuestro sitio web puede contener enlaces hacia sitios web externos, documentación de estándares técnicos (como IAB o W3C) o servicios de terceros. No tenemos control sobre el contenido ni las prácticas de privacidad de dichos sitios, por lo que te recomendamos revisar sus respectivas políticas de privacidad al abandonarnos.
            </Typography>
          </Box>

          {/* Section 7: Contacto */}
          <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" /> 7. Canal de Contacto para Dudas de Privacidad
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de datos en DesignKit Studio, puedes escribirnos directamente a:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              atreart@outlook.com
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Respondemos a todas las consultas de privacidad en un plazo máximo de 48 horas hábiles.
            </Typography>
          </Box>
        </Paper>

        {/* Ad slot at bottom of content */}
        <Box sx={{ mt: 5 }}>
          <AdPlaceholder type="horizontal" label="Inferior Legal" />
        </Box>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
