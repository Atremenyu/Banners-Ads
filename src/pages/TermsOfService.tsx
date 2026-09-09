import React from 'react';
import { Head } from 'vite-react-ssg';
import { Container, Typography, Box, Paper, Divider, Breadcrumbs, Link as MuiLink, Grid, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Gavel as LegalIcon,
  VerifiedUser as TrustIcon,
  Block as RestrictionIcon,
  Copyright as CopyrightIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import AdPlaceholder from '@/components/AdPlaceholder';

const TermsOfService = () => {
  return (
    <>
      <Head>
        <title>Términos de Servicio | DesignKit Studio & Banner Optimizer</title>
        <meta
          name="description"
          content="Términos y Condiciones de Uso de DesignKit Studio y Banner Optimizer. Conoce las condiciones de uso de nuestras herramientas web gratuitas de diseño y optimización."
        />
        <meta name="keywords" content="términos de servicio, términos y condiciones, condiciones de uso, banner optimizer, designkit studio" />
        <meta property="og:title" content="Términos de Servicio | DesignKit Studio" />
        <meta property="og:description" content="Condiciones generales de uso de la suite de herramientas web de DesignKit Studio." />
        <meta property="og:type" content="website" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Inicio
          </MuiLink>
          <Typography color="text.primary">Términos de Servicio</Typography>
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
            <Chip icon={<LegalIcon />} label="Marco Legal y Condiciones de Uso" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              Términos de Servicio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Highlights */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrustIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Servicio Gratuito y Libre</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Ofrecemos herramientas profesionales accesibles sin requerir registros de pago ni suscripciones obligatorias.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CopyrightIcon color="success" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tus Derechos Creativos</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Mantienes la autoría, propiedad intelectual y derechos totales sobre todas las imágenes y creatividades que proceses.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <RestrictionIcon color="error" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Uso Responsable</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Queda prohibido el uso de la plataforma para fines ilícitos, vulneración de derechos de terceros o ataques cibernéticos.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Section 1 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              1. Aceptación de los Términos y Modificaciones
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Al ingresar, navegar y utilizar las herramientas disponibles en <strong>DesignKit Studio</strong> (incluyendo Banner Optimizer, TextLab, Color Studio, UTM Builder, etc.), usted declara haber leído, comprendido y aceptado en su totalidad estos Términos de Servicio. Si no está de acuerdo con alguno de los puntos aquí estipulados, le solicitamos abstenerse de utilizar el sitio web.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento para reflejar mejoras operativas, nuevas funcionalidades o cambios regulatorios. Los cambios entrarán en vigor a partir de su publicación en esta página.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              2. Descripción del Servicio y Procesamiento Local
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              DesignKit Studio proporciona un ecosistema de utilidades web orientadas a la optimización de recursos gráficos, recorte de banners según estándares del Interactive Advertising Bureau (IAB), análisis semántico y generación de código frontend (CSS/HTML).
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              El servicio opera bajo el paradigma de <strong>procesamiento del lado del cliente (Client-Side)</strong>. Esto significa que la ejecución computacional se realiza directamente mediante el motor JavaScript de su navegador web, sin requerir la transferencia de sus imágenes o archivos a ningún servidor centralizado.
            </Typography>
          </Box>

          {/* Section 3 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              3. Propiedad Intelectual y Derechos de Contenido
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Sobre sus archivos:</strong> Usted conserva todos los derechos morales y patrimoniales de autor sobre las imágenes, textos, logotipos y gráficos que importe a la herramienta. DesignKit Studio no reclama titularidad alguna sobre sus obras.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              <strong>Sobre la plataforma:</strong> El código fuente, arquitectura, interfaz gráfica, logotipos, textos explicativos, guías y elementos de marca propios de DesignKit Studio están protegidos por las leyes de propiedad intelectual internacionales y no pueden ser duplicados o comercializados sin autorización expresa.
            </Typography>
          </Box>

          {/* Section 4 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              4. Usos Prohibidos
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              El usuario se compromete a no utilizar las herramientas para:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2, color: 'text.secondary' }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Procesar material que contenga malware, virus, código malicioso o scripts dañinos.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Generar o manipular contenido difamatorio, fraudulento, engañoso o que viole derechos de autor o marcas registradas de terceros.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Intentar desestabilizar la infraestructura de alojamiento mediante peticiones automatizadas abusivas o ataques de denegación de servicio.
              </Typography>
            </Box>
          </Box>

          {/* Section 5 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              5. Exclusión de Garantías y Limitación de Responsabilidad
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Las herramientas se suministran en modalidad <strong>"tal cual" (AS IS)</strong> y <strong>"según disponibilidad"</strong>, sin garantías explícitas o implícitas de idoneidad para un fin comercial específico, rendimiento ininterrumpido o ausencia total de errores menores del navegador.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Bajo ninguna circunstancia los administradores o desarrolladores de DesignKit Studio serán responsables por daños directos, indirectos, incidentales o pérdidas comerciales derivadas del uso o la imposibilidad de uso de la plataforma. Se recomienda a los usuarios conservar siempre copias de respaldo de sus archivos originales.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.light' }}>
              6. Publicidad y Enlaces de Terceros
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              El sitio web puede mostrar anuncios provistos por redes publicitarias autorizadas como Google AdSense. Las transacciones comerciales o acuerdos que el usuario celebre con terceros anunciantes corresponden exclusivamente a la relación entre el usuario y dicho anunciante.
            </Typography>
          </Box>

          {/* Section 7 */}
          <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" /> 7. Consultas Legales
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Si requiere aclaraciones adicionales sobre estos Términos de Servicio, puede comunicarse mediante nuestro correo electrónico oficial:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              atreart@outlook.com
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 5 }}>
          <AdPlaceholder type="horizontal" label="Inferior Legal" />
        </Box>
      </Container>
    </>
  );
};

export default TermsOfService;
