import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider,
  Select, MenuItem, FormControl, InputLabel, Chip, Snackbar, Alert
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Compare as CompareIcon,
  Tune as TuneIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

const ImageCompressorLive: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<{
    file: File;
    url: string;
    width: number;
    height: number;
    size: number;
    name: string;
  } | null>(null);

  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>('image/webp');
  const [compressedDataUrl, setCompressedDataUrl] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Split-screen comparison divider position (0 to 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const compareBoxRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoaded = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'Selecciona un archivo de imagen', severity: 'error' });
      return;
    }

    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSourceImage({
        file,
        url: objUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        name: file.name
      });
      setToast({ open: true, message: 'Imagen cargada para compresión interactiva', severity: 'success' });
    };
    img.src = objUrl;
  };

  // Perform compression in browser
  const runCompression = useCallback(async () => {
    if (!sourceImage) return;
    setIsCompressing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsCompressing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0);

      const qParam = targetFormat === 'image/png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            const dataUrl = canvas.toDataURL(targetFormat, qParam);
            setCompressedDataUrl(dataUrl);
          }
          setIsCompressing(false);
        },
        targetFormat,
        qParam
      );
    };
    img.src = sourceImage.url;
  }, [sourceImage, quality, targetFormat]);

  // Debounced auto-compression
  useEffect(() => {
    if (!sourceImage) return;
    const timer = setTimeout(() => {
      runCompression();
    }, 180);
    return () => clearTimeout(timer);
  }, [sourceImage, quality, targetFormat, runCompression]);

  // Handle drag for the split-screen slider
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || !compareBoxRef.current) return;
    const rect = compareBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  const handleSplitTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!compareBoxRef.current) return;
    const touch = e.touches[0];
    const rect = compareBoxRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getExtension = (mime: OutputFormat): string => {
    switch (mime) {
      case 'image/webp': return 'webp';
      case 'image/png': return 'png';
      case 'image/jpeg': return 'jpg';
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !sourceImage) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    const extIdx = sourceImage.name.lastIndexOf('.');
    const base = extIdx > -1 ? sourceImage.name.substring(0, extIdx) : sourceImage.name;
    a.download = `${base}_comprimida.${getExtension(targetFormat)}`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ open: true, message: 'Imagen optimizada descargada', severity: 'success' });
  };

  const diffPercent = sourceImage && compressedSize
    ? (((sourceImage.size - compressedSize) / sourceImage.size) * 100).toFixed(1)
    : '0';

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Compresor de Imágenes con <Box component="span" sx={{ color: 'primary.main' }}>Comparador en Vivo</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Ajusta la calidad visual y examina los artefactos de compresión en tiempo real mediante el divisor interactivo antes y después.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Controls */}
        <Grid item xs={12} lg={4}>
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
              <UploadFileIcon color="primary" /> 1. Imagen a Comprimir
            </Typography>

            <input
              id="compressor-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageLoaded(file);
              }}
            />

            {!sourceImage ? (
              <Paper
                variant="outlined"
                id="compressor-dropzone"
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
                  if (file) handleImageLoaded(file);
                }}
                sx={{
                  p: 3.5,
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
                  Arrastra tu fotografía aquí o haz clic
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG o WebP
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
                    {sourceImage.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {sourceImage.width} × {sourceImage.height} px ({formatBytes(sourceImage.size)})
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ textTransform: 'none' }}>
                  Cambiar
                </Button>
              </Box>
            )}

            {/* Target Format */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TuneIcon color="primary" /> 2. Ajustes de Optimización
              </Typography>

              <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                <InputLabel id="compressor-format-label">Formato de Salida</InputLabel>
                <Select
                  labelId="compressor-format-label"
                  value={targetFormat}
                  label="Formato de Salida"
                  onChange={(e) => setTargetFormat(e.target.value as OutputFormat)}
                >
                  <MenuItem value="image/webp">WebP (Compresión máxima recomendada)</MenuItem>
                  <MenuItem value="image/jpeg">JPEG (Estándar fotográfico universal)</MenuItem>
                  <MenuItem value="image/png">PNG (Sin pérdidas)</MenuItem>
                </Select>
              </FormControl>

              {/* Quality Slider */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Nivel de Calidad:
                  </Typography>
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                    {targetFormat === 'image/png' ? 'Sin pérdidas (Lossless)' : `${quality}%`}
                  </Typography>
                </Box>
                <Slider
                  value={quality}
                  disabled={targetFormat === 'image/png'}
                  min={10}
                  max={100}
                  step={1}
                  onChange={(_, val) => setQuality(val as number)}
                  size="small"
                />
              </Box>

              {/* Stats Card */}
              {sourceImage && compressedSize > 0 && (
                <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Original</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formatBytes(sourceImage.size)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Comprimido</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {formatBytes(compressedSize)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Chip
                        label={Number(diffPercent) > 0 ? `Ahorro del ${diffPercent}%` : `Sin reducción de peso`}
                        color={Number(diffPercent) > 0 ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 800, width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Download Button */}
              <Button
                id="download-compressed-button"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!sourceImage || !compressedBlob || isCompressing}
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
                sx={{ py: 1.5, fontWeight: 800 }}
              >
                {isCompressing ? 'Optimizando...' : `Descargar Imagen (${formatBytes(compressedSize)})`}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Split Screen Comparison */}
        <Grid item xs={12} lg={8}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompareIcon color="primary" /> Comparador en Vivo: Original vs Comprimido
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Arrastra la línea divisoria vertical para comparar detalles
              </Typography>
            </Box>

            {/* Split Screen Container */}
            <Box
              ref={compareBoxRef}
              id="split-screen-container"
              onMouseDown={() => setIsDraggingSplit(true)}
              onMouseUp={() => setIsDraggingSplit(false)}
              onMouseLeave={() => setIsDraggingSplit(false)}
              onMouseMove={handleSplitMouseMove}
              onTouchMove={handleSplitTouchMove}
              sx={{
                width: '100%',
                height: 480,
                position: 'relative',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: '#0a0e17',
                overflow: 'hidden',
                userSelect: 'none',
                cursor: 'ew-resize'
              }}
            >
              {sourceImage && compressedDataUrl ? (
                <>
                  {/* Layer 1: Compressed Image (Full background) */}
                  <Box
                    component="img"
                    src={compressedDataUrl}
                    alt="Optimized"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />

                  {/* Layer 2: Original Image (Clipped to splitPos) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${splitPos}%`,
                      height: '100%',
                      overflow: 'hidden',
                      borderRight: '2px solid #3b82f6',
                      boxShadow: '2px 0 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    <Box
                      component="img"
                      src={sourceImage.url}
                      alt="Original"
                      sx={{
                        width: compareBoxRef.current?.clientWidth || '100%',
                        height: '100%',
                        objectFit: 'contain',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                  </Box>

                  {/* Floating Labels */}
                  <Chip
                    label="Original"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: 'rgba(0, 0, 0, 0.75)',
                      color: '#fff',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                  <Chip
                    label={`Optimizado (${formatBytes(compressedSize)})`}
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 800,
                      backdropFilter: 'blur(4px)'
                    }}
                  />

                  {/* Divider Handle Knob */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: `${splitPos}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 12px rgba(59, 130, 246, 0.8)',
                      pointerEvents: 'none'
                    }}
                  >
                    <CompareIcon sx={{ fontSize: 18 }} />
                  </Box>
                </>
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Carga una imagen para habilitar el comparador en vivo con división interactiva
                  </Typography>
                </Box>
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

export default ImageCompressorLive;
