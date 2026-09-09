import React, { useState } from 'react';
import { Head } from 'vite-react-ssg';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  MenuItem, Breadcrumbs, Link as MuiLink, Alert, Snackbar, Chip, Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Email as EmailIcon,
  Send as SendIcon,
  HelpOutline as HelpIcon,
  AccessTime as TimeIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  SupportAgent as SupportIcon,
  BugReport as BugIcon
} from '@mui/icons-material';
import AdPlaceholder from '@/components/AdPlaceholder';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = [
    { value: 'general', label: 'Consulta General' },
    { value: 'support', label: 'Soporte Técnico / Uso de Herramientas' },
    { value: 'bug', label: 'Reporte de Error o Bug' },
    { value: 'feature', label: 'Sugerencia de Nueva Función' },
    { value: 'business', label: 'Contacto Comercial / Publicidad' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'El asunto es obligatorio.';
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      newErrors.message = 'El mensaje debe contener al menos 15 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Create mailto link as fallback to open email client with prefilled data
      const mailtoUrl = `mailto:atreart@outlook.com?subject=${encodeURIComponent(`[${formData.category.toUpperCase()}] ${formData.subject}`)}&body=${encodeURIComponent(`Nombre: ${formData.name}\nEmail: ${formData.email}\nCategoría: ${formData.category}\n\nMensaje:\n${formData.message}`)}`;
      
      setSubmitted(true);
      
      // Also open mailto client
      window.location.href = mailtoUrl;
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('atreart@outlook.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Contacto y Soporte | DesignKit Studio</title>
        <meta
          name="description"
          content="Contáctanos para resolver dudas, reportar errores o solicitar nuevas herramientas de optimización gráfica. Respuesta garantizada en 24-48 horas."
        />
        <meta name="keywords" content="contacto designkit studio, soporte banner optimizer, ayuda herramientas diseño, atreart" />
        <meta property="og:title" content="Contacto y Soporte | DesignKit Studio" />
        <meta property="og:description" content="¿Tienes dudas o sugerencias? Escríbenos a través de nuestro formulario o correo directo." />
        <meta property="og:type" content="website" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
            Inicio
          </MuiLink>
          <Typography color="text.primary">Contacto</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Chip icon={<SupportIcon />} label="Atención y Soporte Continuo" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Centro de Contacto y Soporte
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            ¿Tienes alguna consulta técnica sobre Banner Optimizer, sugerencias de nuevos formatos o deseas reportar una incidencia? Estamos a tu completa disposición.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Contact Info & Response Expectations */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="primary" /> Vía Directa de Comunicación
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Para consultas directas o colaboraciones, puedes escribirnos a nuestra casilla principal:
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main', wordBreak: 'break-all' }}>
                    atreart@outlook.com
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={copied ? <CheckIcon color="success" /> : <CopyIcon />}
                    onClick={handleCopyEmail}
                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                  >
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>
                </Paper>

                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon color="info" /> Tiempos de Respuesta
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Revisamos activamente todos los mensajes entrantes. El tiempo promedio de respuesta es de <strong>24 a 48 horas hábiles</strong> (lunes a viernes).
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                    ¿Prefieres resolver tus dudas al instante?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Consulta nuestra guía completa con especificaciones de banners, preguntas frecuentes y mejores prácticas de diseño.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/guia"
                    variant="outlined"
                    color="inherit"
                    startIcon={<HelpIcon />}
                    fullWidth
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Ver Guía de Uso y Preguntas Frecuentes
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="caption" color="text.secondary">
                  Tus datos de contacto se tratarán con estricta confidencialidad según nuestra{' '}
                  <MuiLink component={RouterLink} to="/privacidad" color="primary">
                    Política de Privacidad
                  </MuiLink>.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Envíanos un Mensaje
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Completa los campos a continuación y nos pondremos en contacto contigo a la brevedad.
              </Typography>

              {submitted ? (
                <Alert
                  severity="success"
                  icon={<CheckIcon fontSize="inherit" />}
                  sx={{ my: 3, borderRadius: 2 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    ¡Gracias por tu mensaje!
                  </Typography>
                  Tu solicitud ha sido preparada. Si no se abrió automáticamente tu cliente de correo, puedes enviar el mensaje directamente a <strong>atreart@outlook.com</strong>.
                </Alert>
              ) : null}

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Nombre Completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={!!errors.name}
                      helperText={errors.name}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Correo Electrónico"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Categoría de Consulta"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      variant="outlined"
                    >
                      {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Asunto"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      error={!!errors.subject}
                      helperText={errors.subject}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={5}
                      label="Mensaje o Descripción de la Consulta"
                      placeholder="Describe detalladamente tu pregunta, sugerencia o el comportamiento observado en la herramienta..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      error={!!errors.message}
                      helperText={errors.message || 'Mínimo 15 caracteres.'}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SendIcon />}
                      fullWidth
                      sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                    >
                      Enviar Mensaje
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <AdPlaceholder type="horizontal" label="Inferior Contacto" />
        </Box>
      </Container>
    </>
  );
};

export default Contact;
