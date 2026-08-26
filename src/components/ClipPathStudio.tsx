import React, { useState, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Button,
  Chip, Snackbar, Alert, Slider, FormControl, InputLabel, Select, MenuItem, Tab, Tabs, Switch, FormControlLabel
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  Category as ShapeIcon,
  AutoAwesome as SparklesIcon,
  Brush as BrushIcon
} from '@mui/icons-material';

type ToolMode = 'clippath' | 'blob' | 'glass';

const clipPresets: { [key: string]: string } = {
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  arrow: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  parallelogram: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  rhombus: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  bubble: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
  bevel: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
};

const ClipPathStudio: React.FC = () => {
  const [toolMode, setToolMode] = useState<ToolMode>('clippath');
  
  // Clip-path states
  const [clipShape, setClipShape] = useState<string>('hexagon');

  // Organic Blob states (8 radius values)
  const [tlX, setTlX] = useState<number>(60);
  const [trX, setTrX] = useState<number>(40);
  const [brX, setBrX] = useState<number>(30);
  const [blX, setBlX] = useState<number>(70);
  const [tlY, setTlY] = useState<number>(60);
  const [trY, setTrY] = useState<number>(30);
  const [brY, setBrY] = useState<number>(70);
  const [blY, setBlY] = useState<number>(40);

  // Glassmorphism states
  const [blurVal, setBlurVal] = useState<number>(16);
  const [opacityVal, setOpacityVal] = useState<number>(15);
  const [borderOpacity, setBorderOpacity] = useState<number>(25);

  const [previewBg, setPreviewBg] = useState<'image' | 'gradient' | 'dark'>('image');
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Organic Blob CSS value
  const blobBorderRadius = `${tlX}% ${trX}% ${brX}% ${blX}% / ${tlY}% ${trY}% ${brY}% ${blY}%`;

  // Output CSS rules
  const generatedCss = useMemo(() => {
    if (toolMode === 'clippath') {
      return `clip-path: ${clipPresets[clipShape] || clipPresets.hexagon};`;
    } else if (toolMode === 'blob') {
      return `border-radius: ${blobBorderRadius};`;
    } else {
      return `background: rgba(255, 255, 255, ${opacityVal / 100});
backdrop-filter: blur(${blurVal}px);
-webkit-backdrop-filter: blur(${blurVal}px);
border: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;
    }
  }, [toolMode, clipShape, blobBorderRadius, blurVal, opacityVal, borderOpacity]);

  const generatedTailwind = useMemo(() => {
    if (toolMode === 'clippath') {
      return `[clip-path:${clipPresets[clipShape]?.replace(/ /g, '_')}]`;
    } else if (toolMode === 'blob') {
      return `rounded-[${blobBorderRadius.replace(/ /g, '_')}]`;
    } else {
      return `bg-white/${opacityVal} backdrop-blur-[${blurVal}px] border border-white/${borderOpacity} shadow-2xl`;
    }
  }, [toolMode, clipShape, blobBorderRadius, blurVal, opacityVal, borderOpacity]);

  const handleCopy = () => {
    const text = activeCodeTab === 0 ? generatedTailwind : generatedCss;
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          CSS Shape & Clip-Path Studio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Genera formas geométricas con `clip-path`, formas orgánicas de bordes asimétricos y paneles Glassmorphism con exportación a Tailwind y CSS.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Mode Switcher */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
          Herramienta Visual
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<ShapeIcon fontSize="small" />}
            label="1. Recorte Geométrico (Clip-Path)"
            clickable
            color={toolMode === 'clippath' ? 'primary' : 'default'}
            onClick={() => setToolMode('clippath')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<SparklesIcon fontSize="small" />}
            label="2. Formas Orgánicas (Fancy Blob Radius)"
            clickable
            color={toolMode === 'blob' ? 'primary' : 'default'}
            onClick={() => setToolMode('blob')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<BrushIcon fontSize="small" />}
            label="3. Panel Glassmorphism"
            clickable
            color={toolMode === 'glass' ? 'primary' : 'default'}
            onClick={() => setToolMode('glass')}
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShapeIcon color="primary" /> Parámetros de la Forma
            </Typography>

            {/* Mode 1: Clip-path selector */}
            {toolMode === 'clippath' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Preset de Forma Geometrica</InputLabel>
                  <Select value={clipShape} label="Preset de Forma Geometrica" onChange={(e) => setClipShape(e.target.value)}>
                    <MenuItem value="hexagon">Hexágono</MenuItem>
                    <MenuItem value="star">Estrella</MenuItem>
                    <MenuItem value="arrow">Flecha Indicadora</MenuItem>
                    <MenuItem value="triangle">Triángulo</MenuItem>
                    <MenuItem value="parallelogram">Paralelogramo</MenuItem>
                    <MenuItem value="rhombus">Rombo</MenuItem>
                    <MenuItem value="bubble">Burbuja de Mensaje</MenuItem>
                    <MenuItem value="bevel">Biselado Cyberpunk</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Mode 2: Organic Blob Radius Sliders */}
            {toolMode === 'blob' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Ajustes de Esquinas Superiores e Inferiores
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Top Left X: {tlX}%</Typography>
                    <Slider value={tlX} min={10} max={90} onChange={(_, v) => setTlX(v as number)} size="small" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Top Right X: {trX}%</Typography>
                    <Slider value={trX} min={10} max={90} onChange={(_, v) => setTrX(v as number)} size="small" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Bottom Right X: {brX}%</Typography>
                    <Slider value={brX} min={10} max={90} onChange={(_, v) => setBrX(v as number)} size="small" />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Bottom Left X: {blX}%</Typography>
                    <Slider value={blX} min={10} max={90} onChange={(_, v) => setBlX(v as number)} size="small" />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Mode 3: Glassmorphism */}
            {toolMode === 'glass' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Desenfoque de Fondo (Backdrop Blur): {blurVal}px
                  </Typography>
                  <Slider value={blurVal} min={0} max={40} onChange={(_, v) => setBlurVal(v as number)} size="small" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Opacidad de Relleno: {opacityVal}%
                  </Typography>
                  <Slider value={opacityVal} min={0} max={60} onChange={(_, v) => setOpacityVal(v as number)} size="small" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Opacidad del Borde: {borderOpacity}%
                  </Typography>
                  <Slider value={borderOpacity} min={0} max={60} onChange={(_, v) => setBorderOpacity(v as number)} size="small" />
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Live Canvas */}
        <Grid item xs={12} lg={7}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              bgcolor: '#090d16',
              backgroundImage: previewBg === 'image' ? 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80)' : 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              borderColor: 'rgba(255, 255, 255, 0.08)',
              position: 'relative'
            }}
          >
            {/* Background Selector */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
              <Chip label="Fondo Arte" size="small" clickable color={previewBg === 'image' ? 'primary' : 'default'} onClick={() => setPreviewBg('image')} />
              <Chip label="Gradiente" size="small" clickable color={previewBg === 'gradient' ? 'primary' : 'default'} onClick={() => setPreviewBg('gradient')} />
            </Box>

            {/* Shape Element */}
            <Box
              sx={{
                width: 220,
                height: 220,
                bgcolor: toolMode === 'glass' ? `rgba(255, 255, 255, ${opacityVal / 100})` : 'primary.main',
                background: toolMode === 'glass' ? `rgba(255, 255, 255, ${opacityVal / 100})` : 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
                clipPath: toolMode === 'clippath' ? (clipPresets[clipShape] || clipPresets.hexagon) : 'none',
                borderRadius: toolMode === 'blob' ? blobBorderRadius : toolMode === 'glass' ? '16px' : '0px',
                backdropFilter: toolMode === 'glass' ? `blur(${blurVal}px)` : 'none',
                WebkitBackdropFilter: toolMode === 'glass' ? `blur(${blurVal}px)` : 'none',
                border: toolMode === 'glass' ? `1px solid rgba(255, 255, 255, ${borderOpacity / 100})` : 'none',
                boxShadow: toolMode === 'glass' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                textAlign: 'center',
                p: 2,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {toolMode === 'clippath' ? 'Clip-Path' : toolMode === 'blob' ? 'Organic Blob' : 'Glassmorphism Panel'}
              </Typography>
            </Box>
          </Paper>

          {/* Code Export */}
          <Paper variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs value={activeCodeTab} onChange={(_, val) => setActiveCodeTab(val)}>
                <Tab label="Tailwind CSS" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="CSS Puro" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
              </Tabs>

              <Button
                size="small"
                variant="contained"
                startIcon={copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                onClick={handleCopy}
                color={copied ? 'success' : 'primary'}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {copied ? '¡Copiado!' : 'Copiar Código'}
              </Button>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#060911', fontFamily: 'monospace', fontSize: '0.825rem', color: '#e2e8f0', overflowX: 'auto' }}>
              <pre style={{ margin: 0 }}>
                {activeCodeTab === 0 ? generatedTailwind : generatedCss}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Ad */}
      <Box sx={{ mt: 6 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Toast */}
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">
          ¡Código copiado con éxito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClipPathStudio;
