import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider,
  TextField, Chip, Snackbar, Alert, RadioGroup, FormControlLabel,
  Radio, Switch, Tooltip, IconButton
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  BrandingWatermark as WatermarkIcon,
  TextFields as TextIcon,
  Image as ImageIcon,
  GridOn as GridIcon,
  RotateRight as RotateIcon,
  Opacity as OpacityIcon
} from '@mui/icons-material';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

const WatermarkStudio: React.FC = () => {
  const [baseImage, setBaseImage] = useState<{
    file: File;
    url: string;
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState<string>('© Confidencial / Muestra');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSizePercent, setFontSizePercent] = useState<number>(4); // % of image height
  const [opacity, setOpacity] = useState<number>(50); // %
  const [rotation, setRotation] = useState<number>(-25); // degrees
  const [position, setPosition] = useState<Position>('bottom-right');

  const [logoImage, setLogoImage] = useState<{
    file: File;
    url: string;
    width: number;
    height: number;
  } | null>(null);
  const [logoScale, setLogoScale] = useState<number>(20); // % of image width

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const baseInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleBaseFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'Selecciona una imagen válida', severity: 'error' });
      return;
    }

    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setBaseImage({
        file,
        url: objUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
        name: file.name
      });
      setToast({ open: true, message: `Foto base cargada: ${img.naturalWidth}×${img.naturalHeight} px`, severity: 'success' });
    };
    img.src = objUrl;
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'Selecciona un archivo de imagen (PNG recomendado)', severity: 'error' });
      return;
    }

    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLogoImage({
        file,
        url: objUrl,
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setToast({ open: true, message: 'Logotipo de marca de agua cargado con éxito', severity: 'success' });
    };
    img.src = objUrl;
  };

  // Render watermarked canvas
  const renderWatermarkCanvas = useCallback((): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!baseImage) return reject(new Error('Sin imagen'));
      const bgImg = new Image();

      bgImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = bgImg.naturalWidth;
        canvas.height = bgImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context error'));

        // Draw base image
        ctx.drawImage(bgImg, 0, 0);

        // Configure watermark transparency
        ctx.save();
        ctx.globalAlpha = opacity / 100;

        if (watermarkType === 'text') {
          const calculatedFontSize = Math.max(16, Math.round((canvas.height * fontSizePercent) / 100));
          ctx.font = `bold ${calculatedFontSize}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = textColor;
          ctx.textBaseline = 'middle';

          if (position === 'tile') {
            // Tiled diagonal watermark pattern across entire canvas
            const textMetrics = ctx.measureText(watermarkText);
            const stepX = Math.max(200, textMetrics.width * 1.5);
            const stepY = calculatedFontSize * 5;

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            const diag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
            for (let y = -diag; y < diag * 2; y += stepY) {
              for (let x = -diag; x < diag * 2; x += stepX) {
                ctx.fillText(watermarkText, x, y);
              }
            }
          } else {
            // Single placed text watermark
            const margin = Math.round(canvas.height * 0.04);
            const textMetrics = ctx.measureText(watermarkText);
            const textW = textMetrics.width;
            let x = margin;
            let y = margin + calculatedFontSize / 2;

            if (position.includes('center') && !position.includes('middle')) {
              x = (canvas.width - textW) / 2;
            } else if (position.includes('right')) {
              x = canvas.width - textW - margin;
            }

            if (position.includes('middle')) {
              y = canvas.height / 2;
              if (position === 'center') x = (canvas.width - textW) / 2;
            } else if (position.includes('bottom')) {
              y = canvas.height - margin - calculatedFontSize / 2;
            }

            ctx.save();
            ctx.translate(x + textW / 2, y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.fillText(watermarkText, -textW / 2, 0);
            ctx.restore();
          }
        } else if (watermarkType === 'image' && logoImage) {
          const logoImg = new Image();
          logoImg.onload = () => {
            const logoW = Math.round((canvas.width * logoScale) / 100);
            const logoH = Math.round((logoW / logoImage.width) * logoImage.height);
            const margin = Math.round(canvas.width * 0.03);

            if (position === 'tile') {
              const stepX = logoW * 2;
              const stepY = logoH * 2;
              for (let y = 0; y < canvas.height; y += stepY) {
                for (let x = 0; x < canvas.width; x += stepX) {
                  ctx.drawImage(logoImg, x, y, logoW, logoH);
                }
              }
            } else {
              let x = margin;
              let y = margin;

              if (position.includes('center') && !position.includes('middle')) {
                x = (canvas.width - logoW) / 2;
              } else if (position.includes('right')) {
                x = canvas.width - logoW - margin;
              }

              if (position.includes('middle')) {
                y = (canvas.height - logoH) / 2;
                if (position === 'center') x = (canvas.width - logoW) / 2;
              } else if (position.includes('bottom')) {
                y = canvas.height - logoH - margin;
              }

              ctx.drawImage(logoImg, x, y, logoW, logoH);
            }

            ctx.restore();
            resolve(canvas);
          };
          logoImg.src = logoImage.url;
          return;
        }

        ctx.restore();
        resolve(canvas);
      };

      bgImg.onerror = () => reject(new Error('Fallo imagen base'));
      bgImg.src = baseImage.url;
    });
  }, [baseImage, watermarkType, watermarkText, textColor, fontSizePercent, opacity, rotation, position, logoImage, logoScale]);

  // Update real-time preview
  useEffect(() => {
    if (!baseImage) return;
    let isCancelled = false;

    renderWatermarkCanvas()
      .then((canvas) => {
        if (!isCancelled) {
          setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85));
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [baseImage, renderWatermarkCanvas]);

  const handleDownload = async () => {
    if (!baseImage) return;
    setIsExporting(true);

    try {
      const canvas = await renderWatermarkCanvas();
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const extIdx = baseImage.name.lastIndexOf('.');
        const base = extIdx > -1 ? baseImage.name.substring(0, extIdx) : baseImage.name;
        a.download = `${base}_marca_agua.jpg`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setToast({ open: true, message: 'Foto con marca de agua descargada', severity: 'success' });
      }, 'image/jpeg', 0.94);
    } catch {
      setIsExporting(false);
      setToast({ open: true, message: 'Error al exportar la imagen', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Estudio de <Box component="span" sx={{ color: 'primary.main' }}>Marcas de Agua</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Protege tus fotografías y diseños aplicando firmas de texto, logotipos de marca o mosaicos de seguridad con control de opacidad y posición.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Controls */}
        <Grid item xs={12} lg={5}>
          {/* Base Image Upload */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              mb: 3
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <UploadFileIcon color="primary" /> 1. Fotografía Base
            </Typography>

            <input
              id="watermark-base-input"
              ref={baseInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBaseFile(file);
              }}
            />

            {!baseImage ? (
              <Paper
                variant="outlined"
                id="watermark-dropzone"
                role="button"
                tabIndex={0}
                onClick={() => baseInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    baseInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleBaseFile(file);
                }}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover, &:focus-visible': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(59, 130, 246, 0.05)',
                    outline: 'none'
                  }
                }}
              >
                <UploadFileIcon sx={{ fontSize: 36, color: 'primary.main', mb: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Arrastra tu fotografía aquí o haz clic para subir
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                    {baseImage.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {baseImage.width} × {baseImage.height} px
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={() => baseInputRef.current?.click()} sx={{ textTransform: 'none' }}>
                  Cambiar
                </Button>
              </Box>
            )}

            {/* Watermark Type Selector */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WatermarkIcon color="primary" /> 2. Tipo de Marca de Agua
              </Typography>

              <RadioGroup
                row
                value={watermarkType}
                onChange={(e) => setWatermarkType(e.target.value as WatermarkType)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="text" control={<Radio size="small" />} label="Texto Personalizado" />
                <FormControlLabel value="image" control={<Radio size="small" />} label="Logo / Imagen PNG" />
              </RadioGroup>

              {watermarkType === 'text' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Texto de la Marca"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          style={{ width: 32, height: 32, borderRadius: 4, border: 'none', cursor: 'pointer' }}
                        />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          Color: {textColor.toUpperCase()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                        Tamaño ({fontSizePercent}%):
                      </Typography>
                      <Slider
                        value={fontSizePercent}
                        min={1}
                        max={12}
                        step={0.5}
                        onChange={(_, val) => setFontSizePercent(val as number)}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                      Rotación ({rotation}°):
                    </Typography>
                    <Slider
                      value={rotation}
                      min={-90}
                      max={90}
                      step={5}
                      onChange={(_, val) => setRotation(val as number)}
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Box>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoFile(file);
                    }}
                  />
                  {!logoImage ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => logoInputRef.current?.click()}
                      startIcon={<ImageIcon />}
                      sx={{ py: 1.5, borderRadius: 2 }}
                    >
                      Subir Logotipo (PNG Transparente)
                    </Button>
                  ) : (
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {logoImage.file.name}
                      </Typography>
                      <Button size="small" onClick={() => logoInputRef.current?.click()}>
                        Cambiar Logo
                      </Button>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                      Escala del Logo ({logoScale}%):
                    </Typography>
                    <Slider
                      value={logoScale}
                      min={5}
                      max={50}
                      step={1}
                      onChange={(_, val) => setLogoScale(val as number)}
                      size="small"
                    />
                  </Box>
                </Box>
              )}

              {/* Opacity Slider */}
              <Box sx={{ mt: 2.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                  Opacidad ({opacity}%):
                </Typography>
                <Slider
                  value={opacity}
                  min={10}
                  max={100}
                  step={5}
                  onChange={(_, val) => setOpacity(val as number)}
                  size="small"
                />
              </Box>

              {/* Position Grid */}
              <Box sx={{ mt: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                  Ubicación en la Imagen:
                </Typography>
                <Grid container spacing={0.75} sx={{ maxWidth: 220, mx: 'auto', mb: 1.5 }}>
                  {(['top-left', 'top-center', 'top-right', 'middle-left', 'center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map((pos) => (
                    <Grid item xs={4} key={pos}>
                      <Button
                        fullWidth
                        size="small"
                        variant={position === pos ? 'contained' : 'outlined'}
                        onClick={() => setPosition(pos)}
                        sx={{ minWidth: 0, p: 0.75, fontSize: '0.65rem' }}
                      >
                        {pos.replace('-', ' ')}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  fullWidth
                  size="small"
                  variant={position === 'tile' ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => setPosition('tile')}
                  startIcon={<GridIcon />}
                  sx={{ fontWeight: 700 }}
                >
                  Patrón Mosaico Diagonal (Seguridad Máxima)
                </Button>
              </Box>

              {/* Download Action */}
              <Box sx={{ mt: 3 }}>
                <Button
                  id="download-watermarked-button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!baseImage || isExporting}
                  onClick={handleDownload}
                  startIcon={<DownloadIcon />}
                  sx={{ py: 1.5, fontWeight: 800 }}
                >
                  {isExporting ? 'Procesando...' : 'Descargar Imagen con Marca de Agua'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Visual Preview */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WatermarkIcon color="primary" /> Vista Previa en Vivo
            </Typography>

            <Box
              sx={{
                width: '100%',
                height: 480,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: '#0a0e17',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                overflow: 'hidden'
              }}
            >
              {previewUrl ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Watermarked preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 1.5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sube una fotografía para ver la previsualización interactiva de la marca de agua
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Ad */}
      <Box sx={{ mt: 4 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WatermarkStudio;
