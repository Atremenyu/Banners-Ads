import React, { useState, useMemo } from 'react';
import AdPlaceholder from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  Chip, Snackbar, Alert, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  AspectRatio as AspectRatioIcon,
  ContentCopy as CopyIcon,
  SwapHoriz as SwapIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Check as CheckIcon,
  AutoAwesome as MagicIcon,
  CropSquare as CropSquareIcon
} from '@mui/icons-material';

interface RatioPreset {
  name: string;
  wRatio: number;
  hRatio: number;
  label: string;
}

const ratioPresets: RatioPreset[] = [
  { name: 'Cuadrado (1:1)', wRatio: 1, hRatio: 1, label: 'Instagram Feed, Profile' },
  { name: 'Vertical Social (4:5)', wRatio: 4, hRatio: 5, label: 'Instagram Post, Facebook' },
  { name: 'Historia / Reel (9:16)', wRatio: 9, hRatio: 16, label: 'TikTok, IG Story, Shorts' },
  { name: 'Panorámico (16:9)', wRatio: 16, hRatio: 9, label: 'YouTube, Web Banner, TV' },
  { name: 'Estándar (4:3)', wRatio: 4, hRatio: 3, label: 'Fotografía, Tablets' },
  { name: 'Ultrawide (21:9)', wRatio: 21, hRatio: 9, label: 'Monitores Cine, Banners Web' },
];

const cheatSheet = [
  { platform: 'Instagram', format: 'Post Cuadrado', width: 1080, height: 1080, ratio: '1:1' },
  { platform: 'Instagram / Facebook', format: 'Post Portrait', width: 1080, height: 1350, ratio: '4:5' },
  { platform: 'Instagram / TikTok', format: 'Stories / Reels', width: 1080, height: 1920, ratio: '9:16' },
  { platform: 'YouTube', format: 'Miniatura (Thumbnail)', width: 1280, height: 720, ratio: '16:9' },
  { platform: 'Google Ads', format: 'Robapáginas Medio', width: 300, height: 250, ratio: '6:5' },
  { platform: 'Google Ads', format: 'Megabanner (Leaderboard)', width: 728, height: 90, ratio: '81:10' },
  { platform: 'Google Ads', format: 'Rascacielos Ancho', width: 160, height: 600, ratio: '4:15' },
  { platform: 'LinkedIn', format: 'Banner de Empresa', width: 1128, height: 191, ratio: '591:100' },
];

// Helper: Greatest Common Divisor
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const AspectRatioCalculator = () => {
  const [ratioW, setRatioW] = useState<number>(16);
  const [ratioH, setRatioH] = useState<number>(9);

  const [pixelW, setPixelW] = useState<number>(1920);
  const [pixelH, setPixelH] = useState<number>(1080);

  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Handle Width change -> recalculate Height
  const handleWidthChange = (newW: number) => {
    setPixelW(newW);
    if (ratioW > 0) {
      const calculatedH = Math.round((newW * ratioH) / ratioW);
      setPixelH(calculatedH);
    }
  };

  // Handle Height change -> recalculate Width
  const handleHeightChange = (newH: number) => {
    setPixelH(newH);
    if (ratioH > 0) {
      const calculatedW = Math.round((newH * ratioW) / ratioH);
      setPixelW(calculatedW);
    }
  };

  // Calculate GCD Ratio of current pixel dimensions
  const calculatedRatioString = useMemo(() => {
    if (!pixelW || !pixelH || pixelW <= 0 || pixelH <= 0) return '0:0';
    const divisor = gcd(pixelW, pixelH);
    return `${pixelW / divisor}:${pixelH / divisor}`;
  }, [pixelW, pixelH]);

  const applyPreset = (preset: RatioPreset) => {
    setRatioW(preset.wRatio);
    setRatioH(preset.hRatio);
    const newH = Math.round((pixelW * preset.hRatio) / preset.wRatio);
    setPixelH(newH);
    setToast({ open: true, message: `Proporción ${preset.name} aplicada` });
  };

  const handleSwapDimensions = () => {
    const tempW = pixelW;
    const tempH = pixelH;
    setPixelW(tempH);
    setPixelH(tempW);

    const tempRW = ratioW;
    const tempRH = ratioH;
    setRatioW(tempRH);
    setRatioH(tempRW);
    setToast({ open: true, message: 'Dimensiones invertidas' });
  };

  const copyDimensions = () => {
    const text = `${pixelW}x${pixelH}px`;
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `¡${text} copiado al portapapeles!` });
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

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Ratio<Box component="span" sx={{ color: 'primary.main' }}>Calculator</Box> & Proporciones
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Calcula dimensiones exactas en píxeles manteniendo la relación de aspecto perfecta para banners, redes sociales y maquetación web.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Ratio Controls & Inputs */}
        <Grid item xs={12} lg={7}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Presets */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> Relaciones de Aspecto Populares
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {ratioPresets.map((p, idx) => (
                <Grid item xs={6} sm={4} key={idx}>
                  <Button
                    fullWidth
                    variant={ratioW === p.wRatio && ratioH === p.hRatio ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => applyPreset(p)}
                    sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}
                  >
                    {p.name}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Custom Ratio Entry */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              1. Proporción Objetivo (Ancho : Alto)
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Ratio Ancho"
                  type="number"
                  value={ratioW}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setRatioW(val);
                    setPixelH(Math.round((pixelW * ratioH) / val));
                  }}
                />
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.secondary' }}>:</Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Ratio Alto"
                  type="number"
                  value={ratioH}
                  onChange={e => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setRatioH(val);
                    setPixelH(Math.round((pixelW * val) / ratioW));
                  }}
                />
              </Grid>
            </Grid>

            {/* Pixel Dimension Calculation */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              2. Calculadora de Dimensiones en Píxeles
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Ancho (px)"
                  type="number"
                  value={pixelW}
                  onChange={e => handleWidthChange(parseInt(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <Typography variant="caption" color="text.secondary">px</Typography>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleSwapDimensions}
                  sx={{ minWidth: 40, p: 1, borderRadius: 2 }}
                  title="Invertir Ancho / Alto"
                >
                  <SwapIcon />
                </Button>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Alto (px)"
                  type="number"
                  value={pixelH}
                  onChange={e => handleHeightChange(parseInt(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <Typography variant="caption" color="text.secondary">px</Typography>
                  }}
                />
              </Grid>
            </Grid>

            {/* Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CopyIcon />}
                onClick={copyDimensions}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                Copiar Dimensiones ({pixelW} × {pixelH} px)
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Visual Preview & Calculated Ratio */}
        <Grid item xs={12} lg={5}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CropSquareIcon color="primary" /> Simulación de Escala
              </Typography>

              {/* Aspect Ratio Live Frame Box */}
              <Box
                sx={{
                  width: '100%',
                  height: 260,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: pixelW >= pixelH ? '100%' : `${Math.max(20, (pixelW / pixelH) * 100)}%`,
                    height: pixelH > pixelW ? '100%' : `${Math.max(20, (pixelH / pixelW) * 100)}%`,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    bgcolor: 'rgba(144, 202, 249, 0.15)',
                    border: '2px dashed #90caf9',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {pixelW} × {pixelH} px
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ratio {calculatedRatioString}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Stats Summary */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Relación Simplificada
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {calculatedRatioString}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Resolución Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {((pixelW * pixelH) / 1000000).toFixed(2)} MP
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Bottom Full-Width Cheatsheet Table */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Guía de Dimensiones Estándar en Redes y Banner Ads
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Plataforma</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Formato</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Dimensiones</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Proporción</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cheatSheet.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{item.platform}</TableCell>
                      <TableCell color="text.secondary">{item.format}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {item.width} × {item.height} px
                      </TableCell>
                      <TableCell>
                        <Chip label={item.ratio} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => {
                            setPixelW(item.width);
                            setPixelH(item.height);
                            const [rw, rh] = item.ratio.split(':').map(Number);
                            if (rw && rh) {
                              setRatioW(rw);
                              setRatioH(rh);
                            }
                            setToast({ open: true, message: `Cargado ${item.platform} - ${item.format}` });
                          }}
                        >
                          Usar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default AspectRatioCalculator;
