import React, { useState, useMemo } from 'react';
import AdPlaceholder from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Button,
  Chip, Snackbar, Alert, Slider, TextField,
  FormControlLabel, Switch
} from '@mui/material';
import {
  TextFields as TextFieldsIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  AutoAwesome as MagicIcon,
  FormatQuote as QuoteIcon,
  ShoppingBag as CommerceIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const latinWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
  'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in',
  'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in',
  'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const commercialPhrases = [
  'Impulsa tus ventas con estrategias digitales de alto impacto.',
  'Descubre la nueva forma de optimizar tus procesos en segundos.',
  'Diseñado pensando en la experiencia del usuario y la máxima conversión.',
  'Únete a miles de profesionales que confían en nuestras herramientas.',
  'Calidad garantizada con soporte personalizado las 24 horas del día.',
  'Transforma tus ideas en resultados visibles con nuestra plataforma.',
  'Ahorra tiempo y recursos automatizando tus flujos de trabajo diarios.',
  'Aprovecha nuestras ofertas exclusivas por tiempo limitado.',
  'Seguridad, velocidad y eficiencia en un solo lugar.'
];

const ctaPhrases = [
  '¡Empieza Gratis Hoy Mismo!',
  'Prueba Nuestra Demo en Vivo',
  'Obtén un 20% de Descuento Especial',
  'Regístrate en Menos de 2 Minutos',
  'Descarga la Guía Definitiva Gratis',
  'Habla con un Especialista Ahora',
  'Reserva tu Lugar Antes de que se Agoten'
];

const CopyGen = () => {
  const [generatorType, setGeneratorType] = useState<'lorem' | 'commercial' | 'cta'>('lorem');
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [wrapHtml, setWrapHtml] = useState<boolean>(false);

  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Generate copy
  const generatedText = useMemo(() => {
    if (generatorType === 'commercial') {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        items.push(commercialPhrases[i % commercialPhrases.length]);
      }
      if (wrapHtml) return items.map(p => `<p>${p}</p>`).join('\n\n');
      return items.join('\n\n');
    }

    if (generatorType === 'cta') {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        items.push(ctaPhrases[i % ctaPhrases.length]);
      }
      if (wrapHtml) return items.map(c => `<button>${c}</button>`).join('\n');
      return items.join('\n');
    }

    // Standard Lorem Ipsum
    if (unit === 'words') {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(latinWords[i % latinWords.length]);
      }
      const raw = words.join(' ');
      return raw.charAt(0).toUpperCase() + raw.slice(1) + '.';
    }

    if (unit === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentenceLen = 8 + (i % 6);
        const sWords: string[] = [];
        for (let j = 0; j < sentenceLen; j++) {
          sWords.push(latinWords[(i * 7 + j) % latinWords.length]);
        }
        const str = sWords.join(' ');
        sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + '.');
      }
      return sentences.join(' ');
    }

    // Paragraphs
    const paragraphs: string[] = [];
    for (let p = 0; p < count; p++) {
      const sentences: string[] = [];
      for (let s = 0; s < 4; s++) {
        const sentenceLen = 7 + ((p + s) % 5);
        const sWords: string[] = [];
        for (let j = 0; j < sentenceLen; j++) {
          sWords.push(latinWords[(p * 11 + s * 5 + j) % latinWords.length]);
        }
        const str = sWords.join(' ');
        sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + '.');
      }
      paragraphs.push(sentences.join(' '));
    }

    if (wrapHtml) return paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
    return paragraphs.join('\n\n');
  }, [generatorType, unit, count, wrapHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setToast({ open: true, message: '¡Texto copiado al portapapeles!' });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `texto-de-prueba-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setToast({ open: true, message: 'Archivo de texto descargado' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, position: 'relative' }}>
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

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Lorem<Box component="span" sx={{ color: 'primary.main' }}>Craft</Box> — Generador de Microcopy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Genera texto Lorem Ipsum tradicional o frases comerciales en español para maquetas web y botones de llamada a la acción.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Controls */}
        <Grid item xs={12} lg={5}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> 1. Tipo de Contenido
            </Typography>

            <Grid container spacing={1} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant={generatorType === 'lorem' ? 'contained' : 'outlined'}
                  onClick={() => setGeneratorType('lorem')}
                  startIcon={<ArticleIcon fontSize="small" />}
                  sx={{ textTransform: 'none', py: 0.75, fontSize: '0.8rem' }}
                >
                  Lorem Ipsum
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant={generatorType === 'commercial' ? 'contained' : 'outlined'}
                  onClick={() => setGeneratorType('commercial')}
                  startIcon={<CommerceIcon fontSize="small" />}
                  sx={{ textTransform: 'none', py: 0.75, fontSize: '0.8rem' }}
                >
                  Comercial
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant={generatorType === 'cta' ? 'contained' : 'outlined'}
                  onClick={() => setGeneratorType('cta')}
                  startIcon={<QuoteIcon fontSize="small" />}
                  sx={{ textTransform: 'none', py: 0.75, fontSize: '0.8rem' }}
                >
                  Botones CTA
                </Button>
              </Grid>
            </Grid>

            {/* Units & Quantity */}
            {generatorType === 'lorem' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  Unidad de Medida
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Chip
                      label="Párrafos"
                      clickable
                      color={unit === 'paragraphs' ? 'primary' : 'default'}
                      onClick={() => setUnit('paragraphs')}
                      sx={{ width: '100%', fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Chip
                      label="Oraciones"
                      clickable
                      color={unit === 'sentences' ? 'primary' : 'default'}
                      onClick={() => setUnit('sentences')}
                      sx={{ width: '100%', fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Chip
                      label="Palabras"
                      clickable
                      color={unit === 'words' ? 'primary' : 'default'}
                      onClick={() => setUnit('words')}
                      sx={{ width: '100%', fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Quantity Slider */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Cantidad ({count})
              </Typography>
              <Slider
                value={count}
                min={1}
                max={generatorType === 'cta' ? 7 : 10}
                onChange={(_, val) => setCount(val as number)}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* HTML Toggle */}
            <Box sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={wrapHtml}
                    onChange={e => setWrapHtml(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.825rem' }}>
                    Envolver en etiquetas HTML (&lt;p&gt;, &lt;button&gt;)
                  </Typography>
                }
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Text Preview */}
        <Grid item xs={12} lg={7}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextFieldsIcon color="primary" fontSize="small" /> Texto Generado
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload}>
                  Descargar
                </Button>
                <Button size="small" variant="contained" color="primary" startIcon={<CopyIcon />} onClick={handleCopy}>
                  Copiar Texto
                </Button>
              </Box>
            </Box>

            {/* Generated Area Box */}
            <TextField
              fullWidth
              multiline
              rows={10}
              value={generatedText}
              slotProps={{ input: { readOnly: true } }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  bgcolor: '#080C14',
                  borderRadius: 2
                }
              }}
            />

            {/* Stats Summary */}
            <Box sx={{ mt: 1.5, display: 'flex', gap: 2, color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Caracteres: {generatedText.length}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Palabras: {generatedText.trim().split(/\s+/).filter(Boolean).length}
              </Typography>
            </Box>
          </Paper>
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

export default CopyGen;
