import React, { useState, useCallback, useRef } from 'react';
import {
  Button, Card, CardContent, CardHeader, Typography, Chip, LinearProgress,
  Container, Grid, Box, Paper, Snackbar, Alert, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, MenuItem, Select, FormControl, InputLabel,
  Tooltip, Stack, IconButton
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Animation as AnimationIcon,
  Archive as ArchiveIcon,
  TrendingDown as TrendingDownIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  Layers as LayersIcon,
  Security as SecurityIcon,
  HelpOutline as HelpIcon,
  Assessment as AssessmentIcon,
  Tune as TuneIcon,
  Visibility as VisibilityIcon,
  DeleteOutline as DeleteOutlineIcon,
  Replay as ReplayIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  GIF_BANNER_FORMATS,
  BannerFormat,
  optimizeGifBanner,
  OptimizationProgress,
  OptimizationResult,
  MAX_GIF_BYTES
} from '../utils/gifOptimizer';

interface ProcessedGifItem {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  progressText: string;
  selectedFormat: BannerFormat;
  fit: 'cover' | 'contain';
  result?: OptimizationResult;
  resultUrl?: string;
  errorMessage?: string;
  outputFilename: string;
}

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  return (bytes / 1024).toFixed(1) + ' KB';
};

const GifBannerOptimizer: React.FC = () => {
  const [items, setItems] = useState<ProcessedGifItem[]>([]);
  const [defaultFormat, setDefaultFormat] = useState<BannerFormat>(GIF_BANNER_FORMATS[0]);
  const [defaultFit, setDefaultFit] = useState<'cover' | 'contain'>('cover');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processGifItem = useCallback(async (item: ProcessedGifItem) => {
    try {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'processing', progress: 5, progressText: 'Iniciando optimización...' }
            : it
        )
      );

      const buffer = await item.originalFile.arrayBuffer();

      const result = await optimizeGifBanner(buffer, item.selectedFormat, {
        fit: item.fit,
        maxBytes: MAX_GIF_BYTES,
        onProgress: (prog: OptimizationProgress) => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? { ...it, progress: prog.percent, progressText: prog.message }
                : it
            )
          );
        },
      });

      const resultUrl = URL.createObjectURL(result.blob);

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: 'completed',
                progress: 100,
                progressText: 'Completado',
                result,
                resultUrl,
              }
            : it
        )
      );
    } catch (err) {
      console.error('Error optimizing GIF:', err);
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: 'error',
                errorMessage: err instanceof Error ? err.message : 'Error desconocido al procesar GIF',
              }
            : it
        )
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const gifFiles = Array.from(files).filter(
        (file) => file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')
      );

      if (gifFiles.length === 0) {
        setToastMessage('Por favor selecciona archivos con formato GIF animado (.gif)');
        return;
      }

      const newItems: ProcessedGifItem[] = gifFiles.map((file) => {
        const id = Math.random().toString(36).substring(2, 9);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        const format = defaultFormat;
        return {
          id,
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          originalSize: file.size,
          status: 'queued',
          progress: 0,
          progressText: 'En cola...',
          selectedFormat: format,
          fit: defaultFit,
          outputFilename: `${nameWithoutExt}_banner_${format.width}x${format.height}_180k.gif`,
        };
      });

      setItems((prev) => [...prev, ...newItems]);

      // Trigger processing
      newItems.forEach((item) => {
        processGifItem(item);
      });
    },
    [defaultFormat, defaultFit, processGifItem]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFormatChange = (id: string, newFormatName: string) => {
    const format = GIF_BANNER_FORMATS.find((f) => f.name === newFormatName) || GIF_BANNER_FORMATS[0];
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nameWithoutExt = it.originalFile.name.replace(/\.[^/.]+$/, '');
          const updated: ProcessedGifItem = {
            ...it,
            selectedFormat: format,
            outputFilename: `${nameWithoutExt}_banner_${format.width}x${format.height}_180k.gif`,
            status: 'queued',
            result: undefined,
            resultUrl: undefined,
          };
          // Re-trigger processing with new format
          setTimeout(() => processGifItem(updated), 50);
          return updated;
        }
        return it;
      })
    );
  };

  const handleFitChange = (id: string, newFit: 'cover' | 'contain') => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated: ProcessedGifItem = {
            ...it,
            fit: newFit,
            status: 'queued',
            result: undefined,
            resultUrl: undefined,
          };
          setTimeout(() => processGifItem(updated), 50);
          return updated;
        }
        return it;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((it) => {
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      if (it.originalUrl) URL.revokeObjectURL(it.originalUrl);
    });
    setItems([]);
  };

  const handleRetryItem = (item: ProcessedGifItem) => {
    const updated: ProcessedGifItem = {
      ...item,
      status: 'queued',
      progress: 0,
      progressText: 'Reintentando...',
      result: undefined,
      resultUrl: undefined,
      errorMessage: undefined,
    };
    setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
    setTimeout(() => processGifItem(updated), 50);
  };

  const handleDownloadSingle = (item: ProcessedGifItem) => {
    if (!item.resultUrl) return;
    const a = document.createElement('a');
    a.href = item.resultUrl;
    a.download = item.outputFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAllZip = async () => {
    const completedItems = items.filter((it) => it.status === 'completed' && it.result);
    if (completedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      completedItems.forEach((it) => {
        if (it.result) {
          zip.file(it.outputFilename, it.result.blob);
        }
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `banners_gif_optimizados_180k_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
      setToastMessage('Error al empaquetar el archivo ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  const completedCount = items.filter((it) => it.status === 'completed').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Hero Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
          <Chip
            icon={<AnimationIcon sx={{ fontSize: 18 }} />}
            label="Optimizador de Banners GIF Animados"
            color="primary"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label="Límite Estricto ≤ 180 KB"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          Optimizador de Banners GIF Publicitarios
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.6 }}>
          Transforma cualquier GIF animado a las dimensiones estándar de publicidad digital (Google Display Network, Meta Ads e IAB). Redimensiona con encuadre inteligente y comprime automáticamente los fotogramas y la paleta de colores para garantizar un peso <strong>menor a 180 KB</strong> sin perder resolución ni sincronización temporal.
        </Typography>
      </Box>

      {/* Anuncio Superior */}
      <Box sx={{ mb: 4 }}>
        <AdPlaceholder type="horizontal" label="Superior GIF Optimizer" />
      </Box>

      {/* Global Presets & Control Bar */}
      <Paper
        id="gif-control-bar"
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: 'rgba(59, 130, 246, 0.03)',
          borderColor: 'rgba(59, 130, 246, 0.18)',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="default-format-label">Formato de Banner Predeterminado</InputLabel>
              <Select
                id="gif-preset-format-select"
                labelId="default-format-label"
                value={defaultFormat.name}
                label="Formato de Banner Predeterminado"
                onChange={(e) => {
                  const f = GIF_BANNER_FORMATS.find((it) => it.name === e.target.value);
                  if (f) setDefaultFormat(f);
                }}
              >
                {GIF_BANNER_FORMATS.map((f) => (
                  <MenuItem key={f.name} value={f.name}>
                    {f.name} ({f.width}×{f.height}, {f.useCase})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="default-fit-label">Modo de Ajuste Visual</InputLabel>
              <Select
                id="gif-fit-mode-select"
                labelId="default-fit-label"
                value={defaultFit}
                label="Modo de Ajuste Visual"
                onChange={(e) => setDefaultFit(e.target.value as 'cover' | 'contain')}
              >
                <MenuItem value="cover">Recorte Centrado (Cover)</MenuItem>
                <MenuItem value="contain">Encuadre Proporcional (Contain)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                label="Procesamiento 100% en el Navegador"
                size="small"
                color="primary"
                variant="outlined"
              />
              {completedCount > 0 && (
                <Button
                  id="gif-download-zip-btn"
                  variant="contained"
                  color="success"
                  startIcon={isZipping ? <CircularProgress size={18} color="inherit" /> : <ArchiveIcon />}
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  sx={{ fontWeight: 700, minHeight: 40 }}
                >
                  Descargar Todo en ZIP ({completedCount})
                </Button>
              )}
              {items.length > 0 && (
                <Button
                  id="gif-clear-all-btn"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={handleClearAll}
                  sx={{ fontWeight: 600, borderColor: 'divider', minHeight: 36 }}
                >
                  Limpiar lista
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Drag & Drop Upload Zone */}
      <Paper
        id="gif-upload-dropzone"
        role="button"
        tabIndex={0}
        aria-label="Zona para subir o arrastrar archivos GIF animados"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        variant="outlined"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          p: { xs: 4, md: 5 },
          textAlign: 'center',
          borderRadius: 3,
          cursor: 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragging ? 'primary.main' : 'rgba(255, 255, 255, 0.18)',
          bgcolor: isDragging ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          transition: 'all 0.2s ease',
          mb: 4,
          '&:hover': {
            borderColor: 'primary.light',
            bgcolor: 'rgba(59, 130, 246, 0.04)',
          },
          '&:focus-visible': {
            outline: '2px solid #3b82f6',
            outlineOffset: '2px',
          },
        }}
      >
        <input
          id="gif-file-input"
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/gif,.gif"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />

        <Box sx={{ mb: 2 }}>
          <UploadFileIcon sx={{ fontSize: 52, color: 'primary.main', opacity: 0.95 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Arrastra aquí tus archivos GIF animados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 3, lineHeight: 1.5 }}>
          o haz clic para examinar desde tu computadora. Soporta múltiples archivos simultáneos con optimización automática bajo 180 KB.
        </Typography>
        <Button
          id="gif-select-files-btn"
          variant="contained"
          color="primary"
          size="medium"
          sx={{ px: 3.5, py: 1.25, fontWeight: 700, minHeight: 44 }}
        >
          Seleccionar archivos GIF
        </Button>
      </Paper>

      {/* Empty State: Medidas populares */}
      {items.length === 0 && (
        <Paper
          id="gif-empty-state"
          variant="outlined"
          sx={{
            p: 3,
            mb: 5,
            borderRadius: 3,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Formatos rápidos de publicidad Display
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Haz clic para seleccionar tu formato predeterminado antes de cargar
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {GIF_BANNER_FORMATS.slice(0, 4).map((fmt) => (
              <Grid item xs={12} sm={6} md={3} key={fmt.name}>
                <Paper
                  variant="outlined"
                  onClick={() => setDefaultFormat(fmt)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    borderColor: defaultFormat.name === fmt.name ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                    bgcolor: defaultFormat.name === fmt.name ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: 'primary.light',
                      bgcolor: 'rgba(59, 130, 246, 0.06)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {fmt.name}
                  </Typography>
                  <Typography variant="caption" color="primary.light" sx={{ fontWeight: 600, display: 'block' }}>
                    {fmt.width} × {fmt.height} px
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fmt.useCase}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Processed Items Cards */}
      {items.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon color="primary" /> Banners GIF en Proceso ({items.length})
          </Typography>

          <Stack spacing={3} id="gif-items-stack">
            {items.map((item) => (
              <Card
                id={`gif-card-${item.id}`}
                key={item.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor:
                    item.status === 'completed'
                      ? 'rgba(16, 185, 129, 0.35)'
                      : item.status === 'error'
                      ? 'rgba(239, 68, 68, 0.35)'
                      : 'rgba(255, 255, 255, 0.12)',
                  bgcolor: 'background.paper',
                  overflow: 'hidden',
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {item.originalFile.name}
                      </Typography>
                      <Chip label={`Original: ${formatSize(item.originalSize)}`} size="small" variant="outlined" />
                      {item.result && (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          label={`Optimizado: ${formatSize(item.result.size)} (${item.result.compressionRatio > 0 ? `-${item.result.compressionRatio}%` : 'Listo'})`}
                          color={item.result.isUnder180KB ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                      {item.result && item.result.isUnder180KB && (
                        <Chip
                          label="✓ Cumple Google/IAB ≤ 180 KB"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  }
                  subheader={`Formato Destino: ${item.selectedFormat.name} (${item.selectedFormat.width}×${item.selectedFormat.height}px)`}
                  action={
                    <Tooltip title="Eliminar este banner de la cola">
                      <IconButton
                        id={`gif-delete-btn-${item.id}`}
                        aria-label={`Eliminar banner ${item.originalFile.name}`}
                        onClick={() => handleRemoveItem(item.id)}
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, minWidth: 44, minHeight: 44 }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <CardContent sx={{ pt: 0 }}>
                  {/* Progress or Error */}
                  {item.status === 'processing' && (
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.progressText}
                        </Typography>
                        <Typography variant="caption" color="primary.light" sx={{ fontWeight: 700 }}>
                          {item.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={item.progress} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  )}

                  {item.status === 'error' && (
                    <Alert
                      severity="error"
                      sx={{ my: 2 }}
                      action={
                        <Button
                          id={`gif-retry-btn-${item.id}`}
                          color="inherit"
                          size="small"
                          startIcon={<ReplayIcon />}
                          onClick={() => handleRetryItem(item)}
                          sx={{ fontWeight: 700, minHeight: 36 }}
                        >
                          Reintentar
                        </Button>
                      }
                    >
                      {item.errorMessage || 'Error al procesar el archivo GIF.'}
                    </Alert>
                  )}

                  {/* Format & Adjustment Controls */}
                  <Grid container spacing={2} sx={{ my: 1 }} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`gif-format-label-${item.id}`}>Medida de Banner</InputLabel>
                        <Select
                          id={`gif-item-format-${item.id}`}
                          labelId={`gif-format-label-${item.id}`}
                          value={item.selectedFormat.name}
                          label="Medida de Banner"
                          onChange={(e) => handleFormatChange(item.id, e.target.value)}
                        >
                          {GIF_BANNER_FORMATS.map((f) => (
                            <MenuItem key={f.name} value={f.name}>
                              {f.name} ({f.width}×{f.height}, {f.useCase})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`gif-fit-label-${item.id}`}>Ajuste de Encuadre</InputLabel>
                        <Select
                          id={`gif-item-fit-${item.id}`}
                          labelId={`gif-fit-label-${item.id}`}
                          value={item.fit}
                          label="Ajuste de Encuadre"
                          onChange={(e) => handleFitChange(item.id, e.target.value as 'cover' | 'contain')}
                        >
                          <MenuItem value="cover">Recorte Centrado (Cover)</MenuItem>
                          <MenuItem value="contain">Encuadre Proporcional (Contain)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        {item.resultUrl && (
                          <Button
                            id={`gif-download-btn-${item.id}`}
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadSingle(item)}
                            sx={{ fontWeight: 700, minHeight: 40 }}
                          >
                            Descargar GIF ({formatSize(item.result?.size || 0)})
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Visual Previews */}
                  {item.resultUrl && item.result && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <Grid container spacing={3}>
                        {/* Original GIF */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                            GIF Original ({item.result.originalFramesCount} fotogramas • {formatSize(item.originalSize)})
                          </Typography>
                          <Box
                            sx={{
                              p: 1.5,
                              background: 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 16px 16px',
                              borderRadius: 2,
                              textAlign: 'center',
                              maxHeight: 280,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <img
                              src={item.originalUrl}
                              alt="GIF Original"
                              style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain' }}
                            />
                          </Box>
                        </Grid>

                        {/* Optimized Banner Preview */}
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700 }}>
                              Banner Optimizado ({item.result.width}×{item.result.height}px • {item.result.colorsUsed} colores)
                            </Typography>
                            <Typography variant="caption" color="success.light" sx={{ fontWeight: 700 }}>
                              {formatSize(item.result.size)} / 180 KB
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              background: 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 16px 16px',
                              borderRadius: 2,
                              textAlign: 'center',
                              maxHeight: 280,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            <img
                              src={item.resultUrl}
                              alt="Banner GIF Optimizado"
                              style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain' }}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Technical Summary Pills */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<SpeedIcon sx={{ fontSize: 16 }} />}
                          label={`Duración: ${item.result.durationSeconds}s`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<LayersIcon sx={{ fontSize: 16 }} />}
                          label={`Fotogramas: ${item.result.exportedFramesCount} (de ${item.result.originalFramesCount})`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<TrendingDownIcon sx={{ fontSize: 16 }} />}
                          label={`Reducción: ${item.result.compressionRatio}%`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          label={`Paleta: ${item.result.colorsUsed} Colores`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Anuncio Horizontal In-Content */}
      <Box sx={{ my: 6 }}>
        <AdPlaceholder type="horizontal" label="In-Content GIF Optimizer" />
      </Box>

      {/* SECCIÓN TÉCNICA: Estándares de Banners GIF Publicitarios (≤ 180 KB) */}
      <Box sx={{ mt: 6, mb: 6 }} id="estandares-gif-banners">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip icon={<AssessmentIcon />} label="Especificaciones Publicitarias" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Estándares Técnicos para Banners GIF (Google Ads & IAB)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.6 }}>
            En la publicidad programática y redes de Display, los banners animados GIF deben cumplir con límites estrictos de peso de archivo (típicamente 150 KB a 180 KB) y duración para garantizar que se rendericen al instante sin ralentizar la navegación del usuario.
          </Typography>
        </Box>

        {/* Tabla de Medidas y Especificaciones */}
        <Paper variant="outlined" sx={{ mb: 5, overflow: 'hidden', borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <TableContainer>
            <Table aria-label="tabla de especificaciones de banners gif">
              <TableHead sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Formato</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Dimensiones</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Aspect Ratio</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Límite de Peso</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>FPS Recomendado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Leaderboard Horizontal</TableCell>
                  <TableCell><Chip label="728 × 90" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>8.09:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB (150 KB Google Ads)</TableCell>
                  <TableCell>10 - 15 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner Cuadrado Estándar</TableCell>
                  <TableCell><Chip label="600 × 500" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>1.20:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB</TableCell>
                  <TableCell>12 - 15 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner Rectangular Horizontal</TableCell>
                  <TableCell><Chip label="640 × 200" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>3.20:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB</TableCell>
                  <TableCell>12 - 15 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner Horizontal Mediano</TableCell>
                  <TableCell><Chip label="420 × 200" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>2.10:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB</TableCell>
                  <TableCell>12 - 15 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner de Cabecera Grande</TableCell>
                  <TableCell><Chip label="1100 × 361" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>3.05:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB</TableCell>
                  <TableCell>10 - 12 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner de Contenido Ancho</TableCell>
                  <TableCell><Chip label="630 × 250" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>2.52:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 180 KB</TableCell>
                  <TableCell>12 - 15 FPS</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Robapáginas / MPU</TableCell>
                  <TableCell><Chip label="300 × 250" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>1.20:1</TableCell>
                  <TableCell sx={{ color: 'success.light', fontWeight: 700 }}>≤ 150 KB</TableCell>
                  <TableCell>15 FPS</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Proceso Técnico y Validación Normativa */}
        <Box id="gif-technical-architecture" sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon color="primary" /> Pipeline de Compresión Adaptativa
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Para comprimir archivos GIF complejos sin alterar la velocidad ni sincronización visual, el motor ejecuta un procedimiento técnico de tres fases:
                </Typography>

                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      1
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Remuestreo Temporal de Fotogramas (FPS)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Se acumulan los retardos nativos entre cuadros para estabilizar la cadencia entre 12 y 15 fotogramas por segundo, conservando la duración original íntegra de la animación.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      2
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Escalado Centrado en Lienzo HTML5 (Cover o Contain)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Cada cuadro se proyecta en las proporciones exactas del formato de anuncio seleccionado con suavizado bilineal para evitar artefactos pixelados.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      3
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Cuantización Cromática Progresiva (NeuQuant)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        La paleta indexada se optimiza en perfiles progresivos (de 256 a 64 colores) hasta verificar que el tamaño binario resultante sea estrictamente inferior a 180 KB.
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="success" /> Validación Google Display e IAB
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    Directrices de aceptación técnica para campañas publicitarias programáticas:
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">
                        <strong>Límite de peso:</strong> ≤ 150 KB (Google Ads) y ≤ 180 KB (IAB).
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">
                        <strong>Duración máxima:</strong> Hasta 30 segundos continuos.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">
                        <strong>Compatibilidad:</strong> Renderizado GIF89a universal.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">
                        <strong>Privacidad local:</strong> Procesamiento en memoria de tu navegador.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <Typography variant="caption" color="text.secondary">
                    Tus archivos nunca se transmiten a servidores externos ni quedan almacenados en la nube.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* FAQs Sección GIF Banners */}
        <Box sx={{ mb: 6 }} id="preguntas-frecuentes-gif">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip icon={<HelpIcon />} label="Dudas Frecuentes" color="secondary" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
              Preguntas Frecuentes sobre Banners GIF Animados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Respuestas sobre especificaciones de Google Ads, límites de peso y optimización visual.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Accordion defaultExpanded sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Por qué las redes publicitarias exigen banners GIF menores a 150-180 KB?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Tanto Google Ads como las redes de publicidad programática (OpenX, AppNexus, PubMatic) establecen límites estrictos de peso inicial (típicamente 150 KB para Display estándar, y hasta 180-200 KB en redes premium) para evitar que la carga de anuncios bloquee el hilo principal del navegador del usuario o degrade el <strong>Largest Contentful Paint (LCP)</strong> de la página web. Si tu banner supera el límite, la plataforma rechazará la creatividad automáticamente.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cómo se logra reducir el tamaño sin perder las dimensiones originales del banner?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Las dimensiones en píxeles (por ejemplo, 728×90 o 600×500) <strong>nunca se reducen</strong>. La optimización se logra actuando sobre los dos factores que realmente aumentan el peso del archivo GIF: la cantidad de colores indexados en la paleta y la densidad de fotogramas por segundo (FPS). Al optimizar la paleta a los tonos verdaderamente necesarios y mantener una cadencia suave de 12 a 15 FPS, el tamaño se reduce hasta un 80% manteniendo nitidez absoluta en las medidas requeridas.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Qué diferencia hay entre el ajuste 'Cover' y 'Contain'?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  El modo <strong>Cover (Recorte Inteligente)</strong> escala el GIF para llenar completamente el rectángulo del banner objetivo recortando los extremos sobrantes, evitando bandas negras. El modo <strong>Contain (Encuadre Proporcional)</strong> preserva el 100% del contenido visual del GIF original dentro del área del banner, agregando un fondo neutro si las proporciones difieren.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cuánto dura la animación recomendada en Google Ads?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Las políticas de Google Ads para anuncios gráficos animados estipulan que la animación no puede durar más de <strong>30 segundos</strong>, tras los cuales debe detenerse (o no tener bucles molestos de parpadeo). Nuestra herramienta preserva la duración nativa de tu GIF original acumulando los retrasos de tiempo para que nunca se altere la velocidad de reproducción.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {/* Anuncio Horizontal Inferior */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <AdPlaceholder type="horizontal" label="Inferior GIF Optimizer" />
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GifBannerOptimizer;
