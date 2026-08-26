import React, { useState, useRef, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Button,
  IconButton, Chip, Snackbar, Alert, Card, CardContent, Divider, Tab, Tabs, TextField
} from '@mui/material';
import {
  Palette as PaletteIcon,
  ContentCopy as CopyIcon,
  CloudUpload as UploadIcon,
  Colorize as ColorizeIcon,
  Contrast as ContrastIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  SwapHoriz as SwapIcon,
  Code as CodeIcon,
  AutoAwesome as MagicIcon
} from '@mui/icons-material';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

// Helper: Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [aR, aG, aB] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return aR * 0.2126 + aG * 0.7152 + aB * 0.0722;
}

// Helper: Convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Helper: RGB to HSL
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

const ColorStudio = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Contrast state
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [bgColor, setBgColor] = useState<string>('#0F172A');

  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast({ open: true, message });
  };

  // Image Upload & Color Extraction
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      extractPaletteFromImageSrc(src);
    };
    reader.readAsDataURL(file);
  };

  const extractPaletteFromImageSrc = (src: string) => {
    setIsExtracting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);

      const imageData = ctx.getImageData(0, 0, 150, 150).data;
      const colorMap: { [key: string]: { count: number; r: number; g: number; b: number } } = {};

      // Quantize colors into buckets of 16 for clustering
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        if (a < 128) continue; // Skip transparent

        // Bucket to nearest 32
        const qR = Math.round(r / 32) * 32;
        const qG = Math.round(g / 32) * 32;
        const qB = Math.round(b / 32) * 32;
        const key = `${qR},${qG},${qB}`;

        if (!colorMap[key]) {
          colorMap[key] = { count: 0, r, g, b };
        }
        colorMap[key].count++;
      }

      // Sort by frequency and pick top 6 distinct colors
      const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count);
      const extracted: ColorInfo[] = [];

      for (const item of sorted) {
        if (extracted.length >= 6) break;
        const hex = rgbToHex(item.r, item.g, item.b);
        const rgbStr = `rgb(${item.r}, ${item.g}, ${item.b})`;
        const hslStr = rgbToHsl(item.r, item.g, item.b);

        // Ensure distinctness
        const isDuplicate = extracted.some(c => {
          const cRgb = hexToRgb(c.hex);
          if (!cRgb) return false;
          return Math.abs(cRgb.r - item.r) + Math.abs(cRgb.g - item.g) + Math.abs(cRgb.b - item.b) < 60;
        });

        if (!isDuplicate) {
          extracted.push({ hex, rgb: rgbStr, hsl: hslStr });
        }
      }

      setPalette(extracted);
      setIsExtracting(false);
      showToast('Paleta extraída con éxito');
    };
    img.src = src;
  };

  // Contrast Calculation
  const contrastData = useMemo(() => {
    const rgb1 = hexToRgb(textColor);
    const rgb2 = hexToRgb(bgColor);

    if (!rgb1 || !rgb2) return { ratio: 1, passNormalAA: false, passNormalAAA: false, passLargeAA: false, passLargeAAA: false, passUI: false };

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (brighter + 0.05) / (darker + 0.05);

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      passNormalAA: ratio >= 4.5,
      passNormalAAA: ratio >= 7.0,
      passLargeAA: ratio >= 3.0,
      passLargeAAA: ratio >= 4.5,
      passUI: ratio >= 3.0
    };
  }, [textColor, bgColor]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`¡${label} copiado!`);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-expect-error EyeDropper API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setTextColor(result.sRGBHex);
        showToast(`Color seleccionado: ${result.sRGBHex}`);
      } catch {
        // User canceled eyedropper
      }
    } else {
      showToast('EyeDropper API no es soportada en este navegador');
    }
  };

  const exportCssVariables = () => {
    if (palette.length === 0) return;
    const css = palette.map((c, i) => `  --color-accent-${i + 1}: ${c.hex};`).join('\n');
    const fullCss = `:root {\n${css}\n}`;
    navigator.clipboard.writeText(fullCss);
    showToast('Variables CSS copiadas al portapapeles');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Color<Box component="span" sx={{ color: 'primary.main' }}>Studio</Box> & Accesibilidad WCAG
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Extrae paletas de color desde imágenes y verifica el contraste accesible para textos e interfaces web.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<PaletteIcon />} iconPosition="start" label="Extractor de Paletas" sx={{ fontWeight: 700 }} />
          <Tab icon={<ContrastIcon />} iconPosition="start" label="Comprobador de Contraste WCAG" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* TAB 0: Extractor de Paletas */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Sube tu Imagen / Banner
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed rgba(144, 202, 249, 0.4)',
                  borderRadius: 3,
                  p: 4,
                  cursor: 'pointer',
                  bgcolor: 'rgba(144, 202, 249, 0.02)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(144, 202, 249, 0.08)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <UploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Haz clic o arrastra tu imagen aquí
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Soporta PNG, JPG, WEBP, GIF
                </Typography>
              </Box>

              {imageSrc && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Vista Previa de Imagen Cargada
                  </Typography>
                  <Box
                    component="img"
                    src={imageSrc}
                    alt="Uploaded preview"
                    sx={{
                      maxHeight: 220,
                      maxWidth: '100%',
                      borderRadius: 2,
                      objectFit: 'contain',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                minHeight: 300
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon color="primary" /> Paleta Dominante
                </Typography>
                {palette.length > 0 && (
                  <Button variant="outlined" size="small" startIcon={<CodeIcon />} onClick={exportCssVariables}>
                    Copiar Variables CSS
                  </Button>
                )}
              </Box>

              {palette.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <MagicIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                  <Typography variant="body1">
                    Sube una imagen a la izquierda para extraer automáticamente su paleta de colores.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {palette.map((color, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <Box
                          sx={{
                            height: 90,
                            bgcolor: color.hex,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            p: 1
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                            onClick={() => copyToClipboard(color.hex, `HEX ${color.hex}`)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                            {color.hex.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: 'monospace' }}>
                            {color.rgb}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: 'monospace' }}>
                            {color.hsl}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* TAB 1: Comprobador de Contraste WCAG */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Configuración de Colores
              </Typography>

              {/* Text Color Input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Color del Texto
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    fullWidth
                    inputProps={{ style: { fontFamily: 'monospace', fontWeight: 'bold' } }}
                  />
                </Box>
              </Box>

              {/* Background Color Input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Color del Fondo
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    fullWidth
                    inputProps={{ style: { fontFamily: 'monospace', fontWeight: 'bold' } }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SwapIcon />}
                  onClick={() => {
                    const temp = textColor;
                    setTextColor(bgColor);
                    setBgColor(temp);
                  }}
                >
                  Invertir Colores
                </Button>
                {'EyeDropper' in window && (
                  <IconButton color="primary" onClick={handleEyeDropper} title="Cuenta-gotas">
                    <ColorizeIcon />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </Grid>

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
              {/* Ratio Score Card */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    Relación de Contraste
                  </Typography>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                    {contrastData.ratio} : 1
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={contrastData.passNormalAA ? 'Apto Accesibilidad' : 'Contraste Insuficiente'}
                    color={contrastData.passNormalAA ? 'success' : 'error'}
                    sx={{ fontWeight: 700, px: 1 }}
                  />
                </Box>
              </Box>

              {/* Live Preview Canvas Box */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: bgColor,
                  color: textColor,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 3,
                  transition: 'all 0.2s'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Texto Grande y Títulos (18pt+)
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Este es un texto estándar de muestra (14pt/16px) para evaluar la legibilidad real del contenido y contraste accesible en botones o tarjetas de tu sitio.
                </Typography>
              </Box>

              {/* WCAG Pass/Fail Badges Matrix */}
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Texto Normal (14pt)
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        icon={contrastData.passNormalAA ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        label="AA"
                        color={contrastData.passNormalAA ? 'success' : 'error'}
                      />
                      <Chip
                        size="small"
                        icon={contrastData.passNormalAAA ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        label="AAA"
                        color={contrastData.passNormalAAA ? 'success' : 'error'}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Texto Grande (18pt+)
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        icon={contrastData.passLargeAA ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        label="AA"
                        color={contrastData.passLargeAA ? 'success' : 'error'}
                      />
                      <Chip
                        size="small"
                        icon={contrastData.passLargeAAA ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        label="AAA"
                        color={contrastData.passLargeAAA ? 'success' : 'error'}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Componentes de UI
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                      <Chip
                        size="small"
                        icon={contrastData.passUI ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                        label="UI AA"
                        color={contrastData.passUI ? 'success' : 'error'}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

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

export default ColorStudio;
