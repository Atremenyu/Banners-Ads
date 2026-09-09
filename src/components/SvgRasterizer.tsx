import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider,
  TextField, Chip, Snackbar, Alert, Switch, FormControlLabel,
  ButtonGroup, Select, MenuItem, FormControl, InputLabel,
  IconButton, Tooltip
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
  AspectRatio as AspectRatioIcon,
  PhotoSizeSelectLarge as ResizeIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

type RasterFormat = 'image/png' | 'image/webp' | 'image/jpeg';

const SvgRasterizer: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('vector.svg');
  const [naturalW, setNaturalW] = useState<number>(512);
  const [naturalH, setNaturalH] = useState<number>(512);

  const [targetW, setTargetW] = useState<number>(1024);
  const [targetH, setTargetH] = useState<number>(1024);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2);

  const [outputFormat, setOutputFormat] = useState<RasterFormat>('image/png');
  const [useCustomBg, setUseCustomBg] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseSvgDimensions = (svgText: string): { width: number; height: number } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');

    if (!svgEl) return { width: 512, height: 512 };

    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        return { width: Math.round(parts[2]), height: Math.round(parts[3]) };
      }
    }

    const widthAttr = parseFloat(svgEl.getAttribute('width') || '512');
    const heightAttr = parseFloat(svgEl.getAttribute('height') || '512');
    return {
      width: Math.round(widthAttr) || 512,
      height: Math.round(heightAttr) || 512
    };
  };

  const handleSvgFile = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      setToast({ open: true, message: 'Por favor selecciona un archivo con extensión .svg', severity: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setSvgContent(text);
      setFileName(file.name);

      const dims = parseSvgDimensions(text);
      setNaturalW(dims.width);
      setNaturalH(dims.height);
      setTargetW(dims.width * scaleMultiplier);
      setTargetH(dims.height * scaleMultiplier);
      setToast({ open: true, message: `SVG cargado (${dims.width}×${dims.height} px base)`, severity: 'success' });
    };
    reader.readAsText(file);
  };

  // Render SVG into canvas and return dataUrl or Blob
  const renderSvgToCanvas = useCallback(async (width: number, height: number): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));

        if (useCustomBg || outputFormat === 'image/jpeg') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Error al decodificar el SVG'));
      };

      img.src = url;
    });
  }, [svgContent, useCustomBg, bgColor, outputFormat]);

  // Update live preview when parameters change
  useEffect(() => {
    if (!svgContent) return;
    let isCancelled = false;

    renderSvgToCanvas(Math.min(targetW, 800), Math.min(targetH, 800))
      .then((canvas) => {
        if (!isCancelled) {
          setPreviewDataUrl(canvas.toDataURL('image/png'));
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [svgContent, targetW, targetH, useCustomBg, bgColor, renderSvgToCanvas]);

  const handleMultiplierChange = (factor: number) => {
    setScaleMultiplier(factor);
    setTargetW(naturalW * factor);
    setTargetH(naturalH * factor);
  };

  const handleWidthChange = (val: number) => {
    setTargetW(val);
    if (keepAspect && naturalW > 0) {
      setTargetH(Math.round((val * naturalH) / naturalW));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetH(val);
    if (keepAspect && naturalH > 0) {
      setTargetW(Math.round((val * naturalW) / naturalH));
    }
  };

  const getExtension = (mime: RasterFormat): string => {
    switch (mime) {
      case 'image/png': return 'png';
      case 'image/webp': return 'webp';
      case 'image/jpeg': return 'jpg';
    }
  };

  const handleDownloadRaster = async () => {
    if (!svgContent) return;
    setIsExporting(true);

    try {
      const canvas = await renderSvgToCanvas(targetW, targetH);
      canvas.toBlob((blob) => {
        if (!blob) {
          setToast({ open: true, message: 'Fallo al generar la imagen', severity: 'error' });
          setIsExporting(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const base = fileName.replace(/\.svg$/i, '');
        a.download = `${base}_${targetW}x${targetH}.${getExtension(outputFormat)}`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setToast({ open: true, message: `Descargado: ${targetW}×${targetH} px`, severity: 'success' });
      }, outputFormat, 0.95);
    } catch {
      setIsExporting(false);
      setToast({ open: true, message: 'Error al exportar imagen rasterizada', severity: 'error' });
    }
  };

  const handleDownloadBatchZip = async () => {
    if (!svgContent) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();
      const multipliers = [1, 2, 4];
      const base = fileName.replace(/\.svg$/i, '');

      for (const m of multipliers) {
        const w = naturalW * m;
        const h = naturalH * m;
        const canvas = await renderSvgToCanvas(w, h);
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, outputFormat, 0.95));
        if (blob) {
          zip.file(`${base}_${m}x_${w}x${h}.${getExtension(outputFormat)}`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.download = `${base}_resoluciones_${Date.now()}.zip`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setToast({ open: true, message: 'Paquete de resoluciones descargado en ZIP', severity: 'success' });
    } catch {
      setIsExporting(false);
      setToast({ open: true, message: 'Error al compilar el archivo ZIP', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Conversor <Box component="span" sx={{ color: 'primary.main' }}>SVG a PNG / WebP</Box> en Alta Definición
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Rasteriza gráficos vectoriales SVG a cualquier resolución sin pixelado ni pérdida de nitidez (1x, 2x, 4x, o dimensiones personalizadas).
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Upload & Configuration */}
        <Grid item xs={12} lg={6}>
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
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <UploadFileIcon color="primary" /> 1. Cargar Archivo SVG
            </Typography>

            <input
              id="svg-file-input"
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSvgFile(file);
              }}
            />

            {!svgContent ? (
              <Paper
                variant="outlined"
                id="svg-dropzone"
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleSvgFile(file);
                }}
                sx={{
                  p: 4,
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
                <CodeIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Arrastra tu archivo vectorial .SVG aquí
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  O haz clic para seleccionar desde tu computadora
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Resolución base original: {naturalW} × {naturalH} px
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ textTransform: 'none' }}
                >
                  Cambiar
                </Button>
              </Box>
            )}

            {/* Resolution & Scale Controls */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ResizeIcon color="primary" /> 2. Dimensiones de Exportación
              </Typography>

              {/* Quick Multiplier Buttons */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
                  Escalas predefinidas (Renderizado vectorial nítido):
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                  {[1, 2, 3, 4, 8].map((factor) => (
                    <Button
                      key={factor}
                      onClick={() => handleMultiplierChange(factor)}
                      variant={scaleMultiplier === factor ? 'contained' : 'outlined'}
                      sx={{ fontWeight: 700 }}
                    >
                      {factor}x ({naturalW * factor}×{naturalH * factor})
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              {/* Precise Dimension Inputs */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Ancho (px)"
                    type="number"
                    value={targetW}
                    onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </Grid>

                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <IconButton
                    color={keepAspect ? 'primary' : 'default'}
                    onClick={() => setKeepAspect(!keepAspect)}
                    title={keepAspect ? 'Proporción bloqueada' : 'Proporción libre'}
                  >
                    <AspectRatioIcon />
                  </IconButton>
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Alto (px)"
                    type="number"
                    value={targetH}
                    onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Output Format and Background */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TuneIcon color="primary" /> 3. Formato y Fondo
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="raster-format-label">Formato de Salida</InputLabel>
                    <Select
                      labelId="raster-format-label"
                      value={outputFormat}
                      label="Formato de Salida"
                      onChange={(e) => setOutputFormat(e.target.value as RasterFormat)}
                    >
                      <MenuItem value="image/png">PNG (Transparente, recomendado)</MenuItem>
                      <MenuItem value="image/webp">WebP (Alta compresión web)</MenuItem>
                      <MenuItem value="image/jpeg">JPEG (Fondo sólido)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCustomBg || outputFormat === 'image/jpeg'}
                          disabled={outputFormat === 'image/jpeg'}
                          onChange={(e) => setUseCustomBg(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2">Fondo sólido</Typography>}
                    />

                    {(useCustomBg || outputFormat === 'image/jpeg') && (
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          background: 'none'
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Export Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
              <Button
                id="export-raster-single"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!svgContent || isExporting}
                onClick={handleDownloadRaster}
                startIcon={<DownloadIcon />}
                sx={{ py: 1.5, fontWeight: 800 }}
              >
                Descargar {getExtension(outputFormat).toUpperCase()} ({targetW}×{targetH})
              </Button>

              <Button
                id="export-raster-batch"
                variant="outlined"
                color="primary"
                size="large"
                disabled={!svgContent || isExporting}
                onClick={handleDownloadBatchZip}
                startIcon={<ArchiveIcon />}
                sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Pack 1x, 2x, 4x en ZIP
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Visual Preview */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon color="primary" /> Previsualización del Raster
            </Typography>

            <Box
              sx={{
                width: '100%',
                height: 360,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: '#0a0e17',
                // Checkerboard pattern for transparency indication
                backgroundImage: 'linear-gradient(45deg, #111827 25%, transparent 25%), linear-gradient(-45deg, #111827 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111827 75%), linear-gradient(-45deg, transparent 75%, #111827 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                overflow: 'hidden'
              }}
            >
              {previewDataUrl ? (
                <Box
                  component="img"
                  src={previewDataUrl}
                  alt="Raster preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Carga un archivo SVG para previsualizar la rasterización
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Resolución de Salida
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {targetW} × {targetH} px
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Formato
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {getExtension(outputFormat).toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Megapíxeles
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {((targetW * targetH) / 1000000).toFixed(2)} MP
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Ad */}
      <Box sx={{ mt: 4 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Toast Notification */}
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

export default SvgRasterizer;
