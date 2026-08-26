import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdPlaceholder from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  IconButton, Tooltip, Chip, Alert, Snackbar, Card, CardContent, Divider,
  FormControlLabel, Switch, InputAdornment
} from '@mui/material';
import {
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Check as CheckIcon,
  AutoAwesome as MagicIcon,
  AdsClick as AdsClickIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

interface UtmPreset {
  name: string;
  source: string;
  medium: string;
  icon: React.ReactNode;
}

const presets: UtmPreset[] = [
  { name: 'Google Ads', source: 'google', medium: 'cpc', icon: <AdsClickIcon fontSize="small" /> },
  { name: 'Facebook Ads', source: 'facebook', medium: 'paid_social', icon: <ShareIcon fontSize="small" /> },
  { name: 'Instagram Bio', source: 'instagram', medium: 'social_bio', icon: <ShareIcon fontSize="small" /> },
  { name: 'Email Newsletter', source: 'newsletter', medium: 'email', icon: <EmailIcon fontSize="small" /> },
  { name: 'LinkedIn Campaign', source: 'linkedin', medium: 'cpc', icon: <CampaignIcon fontSize="small" /> },
  { name: 'TikTok Ads', source: 'tiktok', medium: 'paid_social', icon: <ShareIcon fontSize="small" /> },
];

const UtmBuilder = () => {
  const [baseUrl, setBaseUrl] = useState<string>('https://ejemplo.com/producto');
  const [source, setSource] = useState<string>('google');
  const [medium, setMedium] = useState<string>('cpc');
  const [campaign, setCampaign] = useState<string>('promocion_verano');
  const [term, setTerm] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [autoSlug, setAutoSlug] = useState<boolean>(true);

  const [history, setHistory] = useState<Array<{ url: string; campaign: string; timestamp: string }>>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Format parameter cleanly if autoSlug is active
  const formatValue = useCallback((val: string) => {
    if (!autoSlug) return val.trim();
    return val
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_.-]/g, '_');
  }, [autoSlug]);

  const finalUrl = useMemo(() => {
    let rawUrl = baseUrl.trim();
    if (!rawUrl) return '';
    if (!/^https?:\/\//i.test(rawUrl)) {
      rawUrl = 'https://' + rawUrl;
    }

    try {
      const urlObj = new URL(rawUrl);
      const params = new URLSearchParams(urlObj.search);

      const formattedSource = formatValue(source);
      const formattedMedium = formatValue(medium);
      const formattedCampaign = formatValue(campaign);
      const formattedTerm = formatValue(term);
      const formattedContent = formatValue(content);

      if (formattedSource) params.set('utm_source', formattedSource);
      if (formattedMedium) params.set('utm_medium', formattedMedium);
      if (formattedCampaign) params.set('utm_campaign', formattedCampaign);
      if (formattedTerm) params.set('utm_term', formattedTerm);
      if (formattedContent) params.set('utm_content', formattedContent);

      urlObj.search = params.toString();
      return urlObj.toString();
    } catch {
      return '';
    }
  }, [baseUrl, source, medium, campaign, term, content, formatValue]);

  const handleCopy = () => {
    if (!finalUrl) return;
    navigator.clipboard.writeText(finalUrl);
    setToast({ open: true, message: '¡URL con parámetros UTM copiada!' });

    // Add to local history
    setHistory(prev => {
      const filtered = prev.filter(item => item.url !== finalUrl);
      return [
        {
          url: finalUrl,
          campaign: campaign || 'Sin campaña',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...filtered
      ].slice(0, 10);
    });
  };

  const applyPreset = (preset: UtmPreset) => {
    setSource(preset.source);
    setMedium(preset.medium);
    setToast({ open: true, message: `Preset aplicado: ${preset.name}` });
  };

  const handleClear = () => {
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Lateral Fixed Ads (XL screens) */}
      <Box sx={{
        display: { xs: 'none', xl: 'block' },
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10
      }}>
        <AdPlaceholder type="vertical" label="Lateral Izquierdo" />
      </Box>

      <Box sx={{
        display: { xs: 'none', xl: 'block' },
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10
      }}>
        <AdPlaceholder type="vertical" label="Lateral Derecho" />
      </Box>

      {/* Title & Intro */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          UTM<Box component="span" sx={{ color: 'primary.main' }}>Craft</Box> — Creador de Enlaces
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Construye URLs etiquetadas profesionalmente con parámetros Google Analytics para rastrear el rendimiento de tus campañas.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Form & Presets */}
        <Grid item xs={12} lg={8}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            {/* Presets Row */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> Presets Rápidos de Canal
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {presets.map((p, idx) => (
                <Chip
                  key={idx}
                  icon={p.icon as React.ReactElement}
                  label={p.name}
                  onClick={() => applyPreset(p)}
                  clickable
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 2, py: 1.5, fontWeight: 600 }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Base URL */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                1. URL de Destino (Sitio Web o Landing Page) <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="https://tu-sitio.com/pagina"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Main Parameters */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              2. Parámetros de Rastreo (UTM)
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fuente de la Campaña (utm_source) *"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="ej. google, newsletter, facebook"
                  helperText="Indica dónde se mostrará el enlace"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medio de la Campaña (utm_medium) *"
                  value={medium}
                  onChange={e => setMedium(e.target.value)}
                  placeholder="ej. cpc, email, social, banner"
                  helperText="Indica el medio publicitario o de marketing"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Campaña (utm_campaign) *"
                  value={campaign}
                  onChange={e => setCampaign(e.target.value)}
                  placeholder="ej. promocion_verano, lanzamiento_2026"
                  helperText="Identifica la campaña promocional específica"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Término / Palabra Clave (utm_term) (Opcional)"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  placeholder="ej. banners_300x250, ofertas_calzado"
                  helperText="Útil para anuncios de pago por clic (PPC)"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contenido del Anuncio (utm_content) (Opcional)"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="ej. cta_rojo, banner_header"
                  helperText="Para diferenciar variantes A/B o enlaces en el mismo mail"
                />
              </Grid>
            </Grid>

            {/* Options */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSlug}
                    onChange={e => setAutoSlug(e.target.checked)}
                    color="primary"
                  />
                }
                label="Normalizar automáticamente (Minúsculas y guiones bajos)"
              />

              <Button variant="text" color="error" size="small" onClick={handleClear}>
                Limpiar Parámetros
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Generated URL Output & History */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Generated URL Box */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: 'primary.main',
                bgcolor: 'rgba(144, 202, 249, 0.03)',
                boxShadow: '0 0 15px rgba(144, 202, 249, 0.15)'
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon /> URL Generada Listo
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: 'text.primary',
                    minHeight: 80,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {finalUrl || <Typography color="text.secondary">Ingresa los datos para generar la URL...</Typography>}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<CopyIcon />}
                    onClick={handleCopy}
                    disabled={!finalUrl}
                    sx={{ py: 1.2, fontWeight: 700 }}
                  >
                    Copiar URL
                  </Button>
                  <IconButton
                    component="a"
                    href={finalUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!finalUrl}
                    color="primary"
                    sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: 2 }}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>

            {/* Session History Card */}
            {history.length > 0 && (
              <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon color="primary" /> Historial de Sesión
                    </Typography>
                    <Button size="small" color="inherit" onClick={() => setHistory([])}>
                      Borrar
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {history.map((item, i) => (
                      <Paper
                        key={i}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ minWidth: 0, pr: 1 }}>
                          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, display: 'block' }}>
                            {item.campaign} ({item.timestamp})
                          </Typography>
                          <Typography variant="body2" noWrap sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                            {item.url}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            setToast({ open: true, message: 'URL copiada del historial' });
                          }}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

          </Box>
        </Grid>
      </Grid>

      {/* Anuncio Horizontal Inferior */}
      <Box sx={{ mt: 6 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Snackbar */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast({ open: false, message: '' })} severity="success" variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UtmBuilder;
