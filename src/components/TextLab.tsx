import React, { useState, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  IconButton, Tooltip, Chip, LinearProgress, Divider, Snackbar, Alert, Card, CardContent
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  DeleteOutline as ClearIcon,
  Download as DownloadIcon,
  ContentPaste as PasteIcon,
  AutoAwesome as MagicIcon,
  Check as CheckIcon,
  TextFields as TextFieldsIcon,
  FormatItalic as FormatItalicIcon,
  CleaningServices as CleanIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  Lightbulb as TipIcon
} from '@mui/icons-material';

const TextLab = () => {
  const [text, setText] = useState<string>('');
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({
    open: false,
    message: ''
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+\s/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    const readingTimeMinutes = Math.ceil(words / 200);

    return {
      totalChars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeMinutes
    };
  }, [text]);

  // Social & SEO limits
  const socialLimits = [
    { label: 'Google Meta Title', limit: 60, current: metrics.totalChars, desc: 'Recomendado para evitar recorte en SERP' },
    { label: 'Google Meta Description', limit: 160, current: metrics.totalChars, desc: 'Longitud óptima para snippets de búsqueda' },
    { label: 'X / Twitter Post', limit: 280, current: metrics.totalChars, desc: 'Límite de caracteres por publicación' },
    { label: 'Instagram Caption', limit: 2200, current: metrics.totalChars, desc: 'Límite máximo para descripciones' },
    { label: 'LinkedIn Post', limit: 3000, current: metrics.totalChars, desc: 'Límite estándar para publicaciones' },
  ];

  // Text Transformations
  const transform = {
    uppercase: () => {
      setText(prev => prev.toUpperCase());
      showToast('Convertido a MAYÚSCULAS');
    },
    lowercase: () => {
      setText(prev => prev.toLowerCase());
      showToast('Convertido a minúsculas');
    },
    titleCase: () => {
      setText(prev =>
        prev.toLowerCase().replace(/(?:^|\s|-)\S/g, char => char.toUpperCase())
      );
      showToast('Convertido a Title Case (Primera Letra De Cada Palabra)');
    },
    sentenceCase: () => {
      setText(prev =>
        prev.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
      );
      showToast('Convertido a Sentence case (Primera letra por oración)');
    },
    camelCase: () => {
      setText(prev =>
        prev
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '')
      );
      showToast('Convertido a camelCase');
    },
    kebabCase: () => {
      setText(prev =>
        prev
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
      showToast('Convertido a kebab-case');
    },
    snakeCase: () => {
      setText(prev =>
        prev
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '_')
          .replace(/^_+|_+$/g, '')
      );
      showToast('Convertido a snake_case');
    },
    invertCase: () => {
      setText(prev =>
        prev.split('').map(char =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('')
      );
      showToast('Caso invertido');
    }
  };

  // Cleaners
  const clean = {
    removeAccents: () => {
      setText(prev => prev.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      showToast('Acentos y tildes removidos');
    },
    removeExtraSpaces: () => {
      setText(prev => prev.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, ''));
      showToast('Espacios duplicados eliminados');
    },
    removeLineBreaks: () => {
      setText(prev => prev.replace(/[\r\n]+/g, ' '));
      showToast('Saltos de línea eliminados');
    },
    removeHtmlTags: () => {
      setText(prev => prev.replace(/<[^>]*>?/gm, ''));
      showToast('Etiquetas HTML removidas');
    },
    removeEmojis: () => {
      setText(prev => prev.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''));
      showToast('Emojis eliminados del texto');
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('¡Texto copiado al portapapeles!');
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      showToast('Texto pegado desde el portapapeles');
    } catch {
      showToast('No se pudo acceder al portapapeles', 'error');
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'texto-optimizado.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Archivo .txt descargado');
  };

  const loadExampleText = () => {
    setText(
      '¡Bienvenido a TextLab! Ésta herramienta profesional está diseñada para diseñadores, redactores y creadores de contenido. Puedes cambiar el formato de MAYÚSCULAS a minúsculas, limpiar espacios extra o verificar los límites de caracteres para tus publicaciones de SEO y redes sociales.'
    );
    showToast('Texto de ejemplo cargado');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Page Title & Intro */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Text<Box component="span" sx={{ color: 'primary.main' }}>Lab</Box> & SEO Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Transforma, limpia y analiza tus textos para campañas de marketing, copywriting y optimización SEO en tiempo real.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Editor & Transformations */}
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
            {/* Action Bar Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextFieldsIcon color="primary" /> Área de Edición
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" startIcon={<PasteIcon />} onClick={handlePaste}>
                  Pegar
                </Button>
                <Button size="small" variant="outlined" startIcon={<TipIcon />} onClick={loadExampleText}>
                  Ejemplo
                </Button>
                <Button size="small" variant="outlined" color="error" startIcon={<ClearIcon />} onClick={() => setText('')} disabled={!text}>
                  Limpiar
                </Button>
                <Button size="small" variant="contained" color="primary" startIcon={<CopyIcon />} onClick={handleCopy} disabled={!text}>
                  Copiar
                </Button>
                <IconButton size="small" color="primary" onClick={handleDownload} disabled={!text} title="Descargar .txt">
                  <DownloadIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Input Text Area */}
            <TextField
              fullWidth
              multiline
              rows={8}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escribe o pega aquí tu texto para transformarlo y analizarlo..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  fontFamily: 'monospace, sans-serif',
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 2
                }
              }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Transformations Control Grid */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormatItalicIcon fontSize="small" /> Formato & Caso
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.uppercase} disabled={!text} sx={{ textTransform: 'none' }}>
                  MAYÚSCULAS
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.lowercase} disabled={!text} sx={{ textTransform: 'none' }}>
                  minúsculas
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.titleCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  Title Case
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.sentenceCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  Sentence case
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.camelCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  camelCase
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.kebabCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  kebab-case
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.snakeCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  snake_case
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Button fullWidth variant="outlined" onClick={transform.invertCase} disabled={!text} sx={{ textTransform: 'none' }}>
                  iNVERTIR cASO
                </Button>
              </Grid>
            </Grid>

            {/* Cleaners Grid */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CleanIcon fontSize="small" /> Limpieza de Texto
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth variant="outlined" color="secondary" onClick={clean.removeAccents} disabled={!text} sx={{ textTransform: 'none' }}>
                  Remover Acentos
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth variant="outlined" color="secondary" onClick={clean.removeExtraSpaces} disabled={!text} sx={{ textTransform: 'none' }}>
                  Quitar Espacios Duplicados
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth variant="outlined" color="secondary" onClick={clean.removeLineBreaks} disabled={!text} sx={{ textTransform: 'none' }}>
                  Eliminar Saltos de Línea
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth variant="outlined" color="secondary" onClick={clean.removeHtmlTags} disabled={!text} sx={{ textTransform: 'none' }}>
                  Quitar Etiquetas HTML
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button fullWidth variant="outlined" color="secondary" onClick={clean.removeEmojis} disabled={!text} sx={{ textTransform: 'none' }}>
                  Remover Emojis
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Metrics & SEO Limits */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Live Metrics Card */}
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MagicIcon color="primary" /> Métricas del Texto
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
                        {metrics.totalChars}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Caracteres
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 800 }}>
                        {metrics.words}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Palabras
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {metrics.charsNoSpaces}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Sin Espacios
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {metrics.sentences}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Oraciones
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {metrics.readingTimeMinutes} min
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Lectura
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Social & SEO Limits Card */}
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShareIcon color="primary" /> Límites SEO & Redes Sociales
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {socialLimits.map((item, i) => {
                    const percentage = Math.min(100, Math.round((item.current / item.limit) * 100));
                    const isExceeded = item.current > item.limit;
                    const isNear = percentage >= 85 && !isExceeded;

                    return (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: isExceeded ? 'error.main' : isNear ? 'warning.main' : 'text.secondary'
                            }}
                          >
                            {item.current} / {item.limit}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={isExceeded ? 'error' : isNear ? 'warning' : 'primary'}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>

          </Box>
        </Grid>
      </Grid>

      {/* Anuncio Horizontal Inferior */}
      <Box sx={{ mt: 6 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity || 'success'} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TextLab;
