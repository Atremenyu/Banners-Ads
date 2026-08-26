import React, { useState, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Button,
  IconButton, Chip, Snackbar, Alert, Slider, TextField,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent
} from '@mui/material';
import {
  Gradient as GradientIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapIcon,
  Code as CodeIcon,
  AutoAwesome as MagicIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface ColorStop {
  id: string;
  color: string;
  stop: number; // 0 to 100%
}

interface PresetGradient {
  name: string;
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: { color: string; stop: number }[];
}

const presets: PresetGradient[] = [
  {
    name: 'Cyberpunk Neon',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#00F2FE', stop: 0 },
      { color: '#4FACFE', stop: 50 },
      { color: '#000000', stop: 100 }
    ]
  },
  {
    name: 'Sunset Glow',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#FF0844', stop: 0 },
      { color: '#FFB199', stop: 100 }
    ]
  },
  {
    name: 'Emerald Mint',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#11998E', stop: 0 },
      { color: '#38EF7D', stop: 100 }
    ]
  },
  {
    name: 'Golden Hour',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#F83600', stop: 0 },
      { color: '#FE9000', stop: 100 }
    ]
  },
  {
    name: 'Deep Space',
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#1A102F', stop: 0 },
      { color: '#050014', stop: 100 }
    ]
  },
  {
    name: 'Royal Violet',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#654EA3', stop: 0 },
      { color: '#EAAFC8', stop: 100 }
    ]
  }
];

const GradientStudio = () => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#00F2FE', stop: 0 },
    { id: '2', color: '#4FACFE', stop: 100 }
  ]);

  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Generate CSS string
  const cssString = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.stop - b.stop);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.stop}%`).join(', ');

    if (gradientType === 'linear') {
      return `background: linear-gradient(${angle}deg, ${stopsStr});`;
    } else if (gradientType === 'radial') {
      return `background: radial-gradient(circle at center, ${stopsStr});`;
    } else {
      return `background: conic-gradient(from ${angle}deg at 50% 50%, ${stopsStr});`;
    }
  }, [gradientType, angle, stops]);

  const tailwindString = useMemo(() => {
    if (gradientType === 'linear' && stops.length === 2) {
      return `bg-gradient-to-r from-[${stops[0].color}] to-[${stops[1].color}]`;
    }
    return `[background:${cssString.replace('background: ', '').replace(';', '')}]`;
  }, [gradientType, stops, cssString]);

  const addColorStop = () => {
    if (stops.length >= 5) return;
    const newId = Date.now().toString();
    const lastStop = stops[stops.length - 1]?.stop || 50;
    const nextStop = Math.min(100, lastStop + 15);
    setStops([...stops, { id: newId, color: '#FF007F', stop: nextStop }]);
  };

  const removeColorStop = (id: string) => {
    if (stops.length <= 2) {
      setToast({ open: true, message: 'Un gradiente requiere al menos 2 colores' });
      return;
    }
    setStops(stops.filter(s => s.id !== id));
  };

  const updateStopColor = (id: string, color: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, color } : s));
  };

  const updateStopPos = (id: string, stop: number) => {
    setStops(stops.map(s => s.id === id ? { ...s, stop } : s));
  };

  const applyPreset = (preset: PresetGradient) => {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s, idx) => ({ id: idx.toString(), color: s.color, stop: s.stop })));
    setToast({ open: true, message: `Preset '${preset.name}' aplicado` });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `¡${label} copiado!` });
  };

  const downloadGradientAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let grad: CanvasGradient;

    if (gradientType === 'linear') {
      // Convert angle to x1, y1, x2, y2 coordinates
      const rad = (angle * Math.PI) / 180;
      const x1 = canvas.width / 2 - (Math.cos(rad) * canvas.width) / 2;
      const y1 = canvas.height / 2 - (Math.sin(rad) * canvas.height) / 2;
      const x2 = canvas.width / 2 + (Math.cos(rad) * canvas.width) / 2;
      const y2 = canvas.height / 2 + (Math.sin(rad) * canvas.height) / 2;
      grad = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
    }

    const sorted = [...stops].sort((a, b) => a.stop - b.stop);
    sorted.forEach(s => {
      grad.addColorStop(s.stop / 100, s.color);
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = `gradiente-hd-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToast({ open: true, message: '¡Gradiente descargado en HD (1920x1080)!' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Gradient<Box component="span" sx={{ color: 'primary.main' }}>Studio</Box> — Generador de Gradientes CSS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Diseña gradientes CSS multinivel, exporta código limpio para Tailwind o descarga fondos en alta resolución HD.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Controls */}
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Presets Gallery */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> Presets Destacados
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {presets.map((p, idx) => (
                <Grid item xs={4} sm={2} key={idx}>
                  <Box
                    onClick={() => applyPreset(p)}
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: `linear-gradient(${p.angle}deg, ${p.stops.map(s => `${s.color} ${s.stop}%`).join(', ')})`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: 'primary.main'
                      }
                    }}
                    title={p.name}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Gradient Type & Angle */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              1. Configuración de Tipo y Dirección
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Gradiente</InputLabel>
                  <Select
                    value={gradientType}
                    label="Tipo de Gradiente"
                    onChange={e => setGradientType(e.target.value as 'linear' | 'radial' | 'conic')}
                  >
                    <MenuItem value="linear">Lineal (Linear)</MenuItem>
                    <MenuItem value="radial">Radial (Circular)</MenuItem>
                    <MenuItem value="conic">Cónico (Conic)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {gradientType !== 'radial' && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Ángulo ({angle}°)
                  </Typography>
                  <Slider
                    value={angle}
                    min={0}
                    max={360}
                    onChange={(_, val) => setAngle(val as number)}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              )}
            </Grid>

            {/* Color Stops Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                2. Paradas de Color (Color Stops)
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addColorStop}
                disabled={stops.length >= 5}
              >
                Añadir Color
              </Button>
            </Box>

            {stops.map((s, index) => (
              <Box
                key={s.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <input
                  type="color"
                  value={s.color}
                  onChange={e => updateStopColor(s.id, e.target.value)}
                  style={{ width: 40, height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                />
                <TextField
                  size="small"
                  value={s.color}
                  onChange={e => updateStopColor(s.id, e.target.value)}
                  sx={{ width: 110 }}
                  inputProps={{ style: { fontFamily: 'monospace', fontWeight: 'bold' } }}
                />
                <Box sx={{ flexGrow: 1, px: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Posición ({s.stop}%)
                  </Typography>
                  <Slider
                    size="small"
                    value={s.stop}
                    min={0}
                    max={100}
                    onChange={(_, val) => updateStopPos(s.id, val as number)}
                  />
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeColorStop(s.id)}
                  disabled={stops.length <= 2}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right Column: Visual Preview & Code Output */}
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <GradientIcon color="primary" /> Vista Previa del Gradiente
            </Typography>

            {/* Live Preview Box */}
            <Box
              sx={{
                width: '100%',
                height: 240,
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                mb: 3,
                style: {
                  background: cssString.replace('background: ', '').replace(';', '')
                }
              }}
            />

            {/* Code Output Snippets */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Código Generado
            </Typography>

            {/* CSS Property */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                CSS Estándar
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: '#090D16',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#90caf9', overflowX: 'auto' }}>
                  {cssString}
                </Typography>
                <IconButton size="small" onClick={() => copyToClipboard(cssString, 'Código CSS')}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Box>

            {/* Tailwind CSS Class */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Tailwind CSS
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: '#090D16',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#38ef7d', overflowX: 'auto' }}>
                  {tailwindString}
                </Typography>
                <IconButton size="small" onClick={() => copyToClipboard(tailwindString, 'Clases Tailwind')}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadGradientAsImage}
              sx={{ py: 1.2, fontWeight: 700 }}
            >
              Descargar Imagen HD (1920x1080)
            </Button>
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

export default GradientStudio;
