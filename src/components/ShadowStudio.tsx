import React, { useState, useMemo } from 'react';
import AdPlaceholder from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Button,
  IconButton, Snackbar, Alert, Slider, Switch, FormControlLabel,
  Card, CardContent
} from '@mui/material';
import {
  Layers as LayersIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as MagicIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const presetShadows = [
  {
    name: 'Soft Elevation',
    layers: [
      { id: '1', x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.3, inset: false }
    ]
  },
  {
    name: 'Neon Glow Cyan',
    layers: [
      { id: '1', x: 0, y: 0, blur: 20, spread: 5, color: '#00F2FE', opacity: 0.6, inset: false },
      { id: '2', x: 0, y: 0, blur: 40, spread: 10, color: '#4FACFE', opacity: 0.3, inset: false }
    ]
  },
  {
    name: 'Glassmorphism',
    layers: [
      { id: '1', x: 0, y: 8, blur: 32, spread: 0, color: '#000000', opacity: 0.37, inset: false }
    ]
  },
  {
    name: 'Inner Inset',
    layers: [
      { id: '1', x: 2, y: 4, blur: 10, spread: 0, color: '#000000', opacity: 0.5, inset: true }
    ]
  }
];

// Hex to RGBA string
function hexToRgba(hex: string, opacity: number): string {
  const cleanHex = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const ShadowStudio = () => {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: '1', x: 0, y: 20, blur: 30, spread: -10, color: '#00F2FE', opacity: 0.4, inset: false }
  ]);
  const [boxBg] = useState<string>('#1E293B');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [isGlass, setIsGlass] = useState<boolean>(false);

  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // CSS box-shadow string
  const cssShadowString = useMemo(() => {
    return layers.map(l => {
      const rgba = hexToRgba(l.color, l.opacity);
      const insetText = l.inset ? 'inset ' : '';
      return `${insetText}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
    }).join(', ');
  }, [layers]);

  const cssFullSnippet = useMemo(() => {
    let css = `box-shadow: ${cssShadowString};\nborder-radius: ${borderRadius}px;`;
    if (isGlass) {
      css += `\nbackground: rgba(255, 255, 255, 0.05);\nbackdrop-filter: blur(12px);`;
    }
    return css;
  }, [cssShadowString, borderRadius, isGlass]);

  const tailwindSnippet = useMemo(() => {
    return `shadow-[${cssShadowString}] rounded-[${borderRadius}px]`;
  }, [cssShadowString, borderRadius]);

  const updateLayer = (id: string, field: keyof ShadowLayer, val: unknown) => {
    setLayers(layers.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `¡${label} copiado!` });
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
          Shadow<Box component="span" sx={{ color: 'primary.main' }}>Studio</Box> — Generador de Sombras CSS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Diseña efectos de sombras multinivel (`box-shadow`), simula efectos de Glassmorphism y exporta código para CSS o Tailwind CSS.
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
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Presets */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> Presets Rápidos
            </Typography>

            <Grid container spacing={1} sx={{ mb: 2.5 }}>
              {presetShadows.map((p, idx) => (
                <Grid item xs={6} sm={3} key={idx}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setLayers(p.layers.map(l => ({ ...l })))}
                    sx={{ textTransform: 'none', py: 0.75, fontSize: '0.78rem', borderRadius: 2 }}
                  >
                    {p.name}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Layer Controls */}
            {layers.map((l, idx) => (
              <Card key={l.id} variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayersIcon fontSize="small" color="primary" /> Capa de Sombra #{idx + 1}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Offset X ({l.x}px)</Typography>
                      <Slider size="small" value={l.x} min={-50} max={50} onChange={(_, v) => updateLayer(l.id, 'x', v)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Offset Y ({l.y}px)</Typography>
                      <Slider size="small" value={l.y} min={-50} max={50} onChange={(_, v) => updateLayer(l.id, 'y', v)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Difuminado ({l.blur}px)</Typography>
                      <Slider size="small" value={l.blur} min={0} max={100} onChange={(_, v) => updateLayer(l.id, 'blur', v)} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">Expansión ({l.spread}px)</Typography>
                      <Slider size="small" value={l.spread} min={-30} max={50} onChange={(_, v) => updateLayer(l.id, 'spread', v)} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Color y Opacidad ({Math.round(l.opacity * 100)}%)</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <input
                          type="color"
                          value={l.color}
                          onChange={e => updateLayer(l.id, 'color', e.target.value)}
                          style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        />
                        <Slider
                          size="small"
                          value={l.opacity}
                          min={0}
                          max={1}
                          step={0.05}
                          onChange={(_, v) => updateLayer(l.id, 'opacity', v)}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={l.inset}
                            onChange={e => updateLayer(l.id, 'inset', e.target.checked)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Interior (Inset)</Typography>}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {/* General Styling Options */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, my: 1 }}>
              Opciones del Contenedor
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Radio de Borde ({borderRadius}px)</Typography>
                <Slider value={borderRadius} min={0} max={40} onChange={(_, v) => setBorderRadius(v as number)} />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isGlass}
                      onChange={e => setIsGlass(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Efecto Glassmorphism</Typography>}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Visual Preview & Code Output */}
        <Grid item xs={12} lg={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon color="primary" fontSize="small" /> Vista Previa
            </Typography>

            {/* Stage Backdrop Canvas */}
            <Box
              sx={{
                width: '100%',
                height: 220,
                borderRadius: 3,
                bgcolor: '#0B0F19',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                mb: 2,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)'
              }}
            >
              {/* Box with Shadow Applied */}
              <Box
                sx={{
                  width: 200,
                  height: 120,
                  borderRadius: `${borderRadius}px`,
                  bgcolor: isGlass ? 'rgba(255, 255, 255, 0.05)' : boxBg,
                  backdropFilter: isGlass ? 'blur(12px)' : 'none',
                  border: isGlass ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: cssShadowString,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  transition: 'all 0.2s ease-out'
                }}
              >
                DesignKit
              </Box>
            </Box>

            {/* Code Output Snippets */}
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Código CSS Generado
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                bgcolor: '#080C14',
                borderRadius: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#60a5fa', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {cssFullSnippet}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(cssFullSnippet, 'Código CSS')}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Clase Tailwind CSS
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                bgcolor: '#080C14',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399', fontSize: '0.8rem', overflowX: 'auto' }}>
                {tailwindSnippet}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(tailwindSnippet, 'Clases Tailwind')}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Paper>
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

export default ShadowStudio;
