import React, { useState, useCallback } from 'react';
import {
  Button, Card, CardContent, CardHeader, Typography, Chip, LinearProgress, Slider,
  Container, Grid, Box, Paper, Snackbar, Alert, CircularProgress, TextField,
  Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Image as ImageIcon,
  Bolt as ZapIcon,
  Archive as ArchiveIcon,
  TrendingDown as TrendingDownIcon,
  CompareArrows as CompareArrowsIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  Layers as LayersIcon,
  Lightbulb as LightbulbIcon,
  Security as SecurityIcon,
  HelpOutline as HelpIcon,
  CheckCircleOutline as CheckOutlineIcon,
  Assessment as AssessmentIcon,
  Animation as AnimationIcon,
  Transform as TransformIcon,
  Compare as CompareIcon,
  Language as LanguageIcon,
  Share as ShareIcon,
  BrandingWatermark as WatermarkIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

const getFileExtension = (mimeType: string) => {
  switch (mimeType) {
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/jpeg':
    default: return 'jpeg';
  }
};

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  return (bytes / 1024).toFixed(1) + ' KB';
};

interface BannerFormat {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  useCase: string;
}

interface ProcessedFile {
  id: string;
  originalFile: File;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  optimizedBlob?: Blob;
  originalSize: number;
  optimizedSize?: number;
  selectedFormat?: BannerFormat;
  errorMessage?: string;
  outputFilename: string;
}

const bannerFormats: BannerFormat[] = [
    { name: 'Banner 600x500', width: 600, height: 500, aspectRatio: 1.2, useCase: 'Banner Cuadrado Estándar' },
    { name: 'Banner 640x200', width: 640, height: 200, aspectRatio: 3.2, useCase: 'Banner Rectangular Horizontal' },
    { name: 'Banner 728x90', width: 728, height: 90, aspectRatio: 8.09, useCase: 'Banner Leaderboard Horizontal' },
    { name: 'Banner 420x200', width: 420, height: 200, aspectRatio: 2.1, useCase: 'Banner Horizontal Mediano' },
    { name: 'Banner 1100x361', width: 1100, height: 361, aspectRatio: 3.05, useCase: 'Banner de Cabecera Grande' },
    { name: 'Banner 630x250', width: 630, height: 250, aspectRatio: 2.52, useCase: 'Banner de Contenido Ancho' }
];

const DropZone: React.FC<{
  onFilesSelected: (files: File[]) => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  showToast: (message: string, severity: 'success' | 'error') => void;
}> = ({ onFilesSelected, isDragOver, setIsDragOver, showToast }) => {

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} no es un archivo de imagen`, 'error');
        return false;
      }
      return true;
    });
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, setIsDragOver, showToast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <Paper
      variant="outlined"
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      sx={{
        p: 4,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isDragOver ? 'primary.main' : 'divider',
        backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
        transition: 'all 0.3s ease',
        transform: isDragOver ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <UploadFileIcon sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
      <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
        Arrastra tus imágenes aquí
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Arrastra y suelta tus imágenes o haz clic para buscar. Las optimizaremos automáticamente para formatos de banner.
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<ImageIcon />}
      >
        Seleccionar Archivos
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleFileInput}
        />
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Formatos soportados: PNG, JPG, GIF, WebP, BMP
      </Typography>
    </Paper>
  );
};

const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
        case 'queued':
            return <ImageIcon />;
        case 'processing':
            return <CircularProgress size={24} color="inherit" />;
        case 'completed':
            return <CheckCircleIcon />;
        case 'error':
            return <ErrorIcon />;
    }
};

const getStatusColor = (status: ProcessedFile['status']) => {
    switch (status) {
        case 'queued':
            return 'grey.500';
        case 'processing':
            return 'primary.main';
        case 'completed':
            return 'success.main';
        case 'error':
            return 'error.main';
    }
};

const FileProcessor: React.FC<{
  file: ProcessedFile;
  onOutputFilenameChange: (fileId: string, newFilename: string) => void;
}> = ({ file, onOutputFilenameChange }) => {

  return (
    <Card sx={{ border: file.status === 'completed' ? '1px solid rgba(144, 202, 249, 0.2)' : 'none' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText',
            bgcolor: getStatusColor(file.status)
          }}>
            {getStatusIcon(file.status)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 600 }}>{file.originalFile.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatSize(file.originalSize)}
              {file.optimizedSize && (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, ml: 1, color: 'success.main', fontWeight: 500 }}>
                  <CompareArrowsIcon fontSize="inherit" />
                  {formatSize(file.optimizedSize)}
                </Box>
              )}
            </Typography>
          </Box>
          {file.selectedFormat && (
            <Chip label={file.selectedFormat.name} size="small" variant="outlined" color="primary" />
          )}
        </Box>

        {file.status === 'queued' && (
          <Box>
            <TextField
              fullWidth
              label="Nombre de archivo de salida"
              value={file.outputFilename}
              onChange={(e) => onOutputFilenameChange(file.id, e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Listo para ser optimizado.
            </Typography>
          </Box>
        )}
        
        {file.status === 'processing' && (
          <Box>
            <LinearProgress variant="determinate" value={file.progress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Procesando... {file.progress}%</Typography>
          </Box>
        )}
        
        {file.status === 'error' && (
          <Alert severity="error">{file.errorMessage}</Alert>
        )}
        
        {file.status === 'completed' && file.optimizedBlob && file.optimizedSize && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
              ¡Banner optimizado con éxito! El archivo está listo para descargar.
            </Alert>
            
            {/* Side-by-side stats comparison cards */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(255, 255, 255, 0.02)', 
                  borderRadius: 1.5, 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: '4px solid #757575',
                  height: '100%'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                    Tamaño Original
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    {formatSize(file.originalSize)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    100% de peso
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(144, 202, 249, 0.05)', 
                  borderRadius: 1.5, 
                  border: '1px solid rgba(144, 202, 249, 0.1)',
                  borderLeft: '4px solid #90caf9',
                  height: '100%'
                }}>
                  <Typography variant="caption" color="primary.main" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                    Tamaño Optimizado
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    {formatSize(file.optimizedSize)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {((file.optimizedSize / file.originalSize) * 100).toFixed(1)}% del peso original
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                {(() => {
                  const savedBytes = file.originalSize - file.optimizedSize;
                  const savedPercent = ((savedBytes / file.originalSize) * 100).toFixed(1);
                  return (
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: 'rgba(102, 187, 106, 0.08)', 
                      borderRadius: 1.5, 
                      border: '1px solid rgba(102, 187, 106, 0.15)',
                      borderLeft: '4px solid #66bb6a',
                      height: '100%'
                    }}>
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                        Reducción de Peso
                      </Typography>
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                        -{savedPercent}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Ahorraste {formatSize(savedBytes)}
                      </Typography>
                    </Box>
                  );
                })()}
              </Grid>
            </Grid>

            {/* Visual dual bar track */}
            <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)', p: 2, borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.03)', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Comparación de Capacidad</Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingDownIcon fontSize="inherit" />
                  {formatSize(file.originalSize - file.optimizedSize)} menos en disco
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', height: 16, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1.5, overflow: 'hidden' }}>
                {/* Original Track represented by grey background width 100% */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    height: '100%', 
                    width: '100%', 
                    bgcolor: 'grey.800', 
                    opacity: 0.35 
                  }} 
                />
                {/* Optimized size segment */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    height: '100%', 
                    width: `${Math.max(3, Math.min(100, (file.optimizedSize / file.originalSize) * 100))}%`, 
                    bgcolor: 'primary.main',
                    borderRadius: '6px 0 0 6px',
                    boxShadow: '0 0 8px rgba(144, 202, 249, 0.3)'
                  }} 
                />
                {/* Space saved highlighted in green */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: `${(file.optimizedSize / file.originalSize) * 100}%`, 
                    height: '100%', 
                    width: `${((file.originalSize - file.optimizedSize) / file.originalSize) * 100}%`, 
                    bgcolor: 'success.main',
                    opacity: 0.25,
                    borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Peso optimizado: <strong>{((file.optimizedSize / file.originalSize) * 100).toFixed(0)}%</strong>
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                  Reducido: <strong>{(((file.originalSize - file.optimizedSize) / file.originalSize) * 100).toFixed(0)}%</strong>
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              sx={{ py: 1.2, fontWeight: 'bold' }}
              onClick={() => {
                const url = URL.createObjectURL(file.optimizedBlob!);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.outputFilename.toLowerCase();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Descargar Banner Optimizado ({formatSize(file.optimizedSize)})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const findBestFormat = (width: number, height: number): BannerFormat => {
  const aspectRatio = width / height;
  return bannerFormats.reduce((best, format) => {
    const currentDiff = Math.abs(aspectRatio - format.aspectRatio);
    const bestDiff = Math.abs(aspectRatio - best.aspectRatio);
    return currentDiff < bestDiff ? format : best;
  });
};

const BannerOptimizer: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const optimizeImage = useCallback(async (file: File, quality: number): Promise<{ blob: Blob; size: number; format: BannerFormat }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));

      img.onload = () => {
        const selectedFormat = findBestFormat(img.width, img.height);
        canvas.width = selectedFormat.width;
        canvas.height = selectedFormat.height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, selectedFormat.width, selectedFormat.height);
        const outputType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ? file.type : 'image/jpeg';
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to create optimized blob'));
          resolve({ blob, size: blob.size, format: selectedFormat });
        }, outputType, quality / 100);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleOutputFilenameChange = useCallback((fileId: string, newFilename: string) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId
        ? { ...f, outputFilename: newFilename }
        : f
    ));
  }, []);

  const addFilesToQueue = useCallback((newFiles: File[]) => {
    const filesToQueue: ProcessedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36),
      originalFile: file,
      status: 'queued' as const,
      progress: 0,
      originalSize: file.size,
      outputFilename: 'Loading...'
    }));

    setFiles(prev => [...prev, ...filesToQueue]);

    filesToQueue.forEach(fileToQueue => {
      const img = new Image();
      img.onload = () => {
        const selectedFormat = findBestFormat(img.width, img.height);
        const extension = getFileExtension(fileToQueue.originalFile.type);
        const baseName = fileToQueue.originalFile.name.substring(0, fileToQueue.originalFile.name.lastIndexOf('.'));
        const defaultFilename = `${baseName}_${selectedFormat.width}x${selectedFormat.height}.${extension}`.toLowerCase();

        setFiles(prev => prev.map(f =>
          f.id === fileToQueue.id
            ? {
                ...f,
                selectedFormat: selectedFormat,
                outputFilename: defaultFilename
              }
            : f
        ));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        setFiles(prev => prev.map(f =>
          f.id === fileToQueue.id
            ? { ...f, status: 'error', errorMessage: 'Error al leer las dimensiones de la imagen.' }
            : f
        ));
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(fileToQueue.originalFile);
    });
  }, []);

  const startAllProcessing = useCallback(async () => {
    const filesToProcess = files.filter(f => f.status === 'queued');

    setFiles(prev => prev.map(f =>
      f.status === 'queued' ? { ...f, status: 'processing' } : f
    ));

    for (const fileToProcess of filesToProcess) {
      try {
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f =>
            f.id === fileToProcess.id
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        const result = await optimizeImage(fileToProcess.originalFile, 90);
        clearInterval(progressInterval);

        setFiles(prev => prev.map(f =>
          f.id === fileToProcess.id
            ? {
                ...f,
                status: 'completed' as const,
                progress: 100,
                optimizedBlob: result.blob,
                optimizedSize: result.size,
                selectedFormat: result.format
              }
            : f
        ));
      showToast(`${fileToProcess.outputFilename} optimizado con éxito`, 'success');
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileToProcess.id
            ? {
                ...f,
                status: 'error' as const,
              errorMessage: error instanceof Error ? error.message : 'Error en el procesamiento'
              }
            : f
        ));
      showToast(`Error al procesar ${fileToProcess.outputFilename}`, 'error');
      }
    }
  }, [files, optimizeImage, showToast]);

  const downloadAllFiles = useCallback(async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.optimizedBlob);
    if (completedFiles.length === 0) {
      showToast("No hay archivos para descargar. Procesa algunas imágenes primero.", 'error');
      return;
    }

    const zip = new JSZip();
    for (const file of completedFiles) {
      if (file.optimizedBlob && file.selectedFormat) {
        zip.file(file.outputFilename.toLowerCase(), file.optimizedBlob);
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `banners_optimizados_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Se descargaron ${completedFiles.length} archivos optimizados`, 'success');
    } catch (error) {
      showToast("No se pudo crear el archivo ZIP.", 'error');
    }
  }, [files, showToast]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      {/* Anuncios Laterales Seguros */}
      <LateralAds />

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Chip icon={<ZapIcon />} label="Banner Optimizer" color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Optimiza Imágenes para Banners Web
        </Typography>
        <Typography variant="body2" color="text.secondary" component="p" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Sube tus imágenes y las convertiremos automáticamente a formatos de banner estándar
          con tamaños de archivo optimizados para uso web.
        </Typography>

        {/* Anuncio Horizontal Superior (Móvil y Escritorio) */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {bannerFormats.map((format) => (
          <Grid item xs={12} sm={6} md={4} key={format.name}>
            <Card sx={{ textAlign: 'center' }}>
              <CardHeader title={format.name} subheader={format.useCase} />
              <CardContent>
                <Typography variant="h4" color="primary">{format.width}×{format.height}</Typography>
                <Typography variant="body2" color="text.secondary">Ratio: {format.aspectRatio.toFixed(2)}:1</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Callout to GIF Banner Optimizer */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 3,
          bgcolor: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'rgba(59, 130, 246, 0.25)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
            <AnimationIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ¿Necesitas optimizar Banners GIF Animados?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nueva herramienta con compresión garantizada <strong>menor a 180 KB</strong> para Google Ads y redes publicitarias IAB.
            </Typography>
          </Box>
        </Box>
        <Button
          component={RouterLink}
          to="/gif-optimizer"
          variant="contained"
          color="primary"
          sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}
        >
          Probar Optimizador GIF
        </Button>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <DropZone
          onFilesSelected={addFilesToQueue}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          showToast={showToast}
        />
      </Box>

      {files.length > 0 && (() => {
        const completedFiles = files.filter(f => f.status === 'completed' && f.optimizedSize);
        const totalOriginalSize = completedFiles.reduce((sum, f) => sum + f.originalSize, 0);
        const totalOptimizedSize = completedFiles.reduce((sum, f) => sum + (f.optimizedSize || 0), 0);
        const totalSavedSize = totalOriginalSize - totalOptimizedSize;
        const totalSavedPercent = totalOriginalSize > 0 ? ((totalSavedSize / totalOriginalSize) * 100).toFixed(1) : '0';

        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {files.some(f => f.status === 'queued') ? 'Cola de Archivos' : 'Resultados del Procesamiento'}
              </Typography>
              <Box>
                {files.some(f => f.status === 'queued') && (
                  <Button
                    onClick={startAllProcessing}
                    variant="contained"
                    color="primary"
                    startIcon={<ZapIcon />}
                  >
                    Optimizar Todo ({files.filter(f => f.status === 'queued').length})
                  </Button>
                )}
                {files.filter(f => f.status === 'completed').length > 1 && (
                  <Button
                    onClick={downloadAllFiles}
                    variant="contained"
                    startIcon={<ArchiveIcon />}
                    sx={{ ml: 2 }}
                  >
                    Descargar Todo ({files.filter(f => f.status === 'completed').length})
                  </Button>
                )}
              </Box>
            </Box>

            {/* Consolidated Optimization Summary Dashboard */}
            {completedFiles.length > 0 && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(18, 18, 18, 0.8) 100%)',
                  borderColor: 'success.dark',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1, mb: 1, fontWeight: 'bold' }}>
                      <ZapIcon /> ¡Resumen de Optimización Global!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Has optimizado con éxito un total de <strong>{completedFiles.length}</strong> {completedFiles.length === 1 ? 'banner' : 'banners'}. Se ha reducido significativamente el peso total para asegurar cargas ultrarrápidas de tus páginas.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Peso Original Total:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatSize(totalOriginalSize)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Peso Optimizado Total:</Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{formatSize(totalOptimizedSize)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.1)', pt: 1, mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="success.main">Espacio Total Liberado:</Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatSize(totalSavedSize)} (-{totalSavedPercent}%)
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={parseFloat(totalSavedPercent)} 
                        color="success" 
                        size={80} 
                        thickness={5}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                          -{parseFloat(totalSavedPercent).toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" align="center">
                      Reducción de Peso Promedio
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Grid container spacing={2}>
              {files.map((file) => (
                <Grid item xs={12} key={file.id}>
                  <FileProcessor file={file} onOutputFilenameChange={handleOutputFilenameChange} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })()}

      {/* Anuncio Horizontal In-Content (Entre la herramienta y el contenido técnico) */}
      <Box sx={{ my: 6 }}>
        <AdPlaceholder type="horizontal" label="In-Content Dinámico" />
      </Box>

      {/* SECCIÓN EDUCATIVA 1: Estándares de Banners Publicitarios y Formatos IAB */}
      <Box sx={{ mt: 6, mb: 6 }} id="estandares-banners">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip icon={<AssessmentIcon />} label="Estándares de la Industria" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Estándares de Banners Publicitarios (IAB & Google Ads)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.6 }}>
            Para maximizar el rendimiento de las campañas en la Red de Display de Google, redes de afiliados y medios digitales, es indispensable cumplir con las dimensiones y especificaciones dictadas por el Interactive Advertising Bureau (IAB).
          </Typography>
        </Box>

        {/* Tabla de Dimensiones Estándar */}
        <Paper variant="outlined" sx={{ mb: 5, overflow: 'hidden', borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <TableContainer>
            <Table aria-label="tabla de dimensiones y formatos estándar de banners">
              <TableHead sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Formato Publicitario</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Dimensiones (px)</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Aspect Ratio</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Ubicación Recomendada</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>Peso Máx. Sugerido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Leaderboard / Superbanner</TableCell>
                  <TableCell><Chip label="728 × 90" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>8.09:1 (Panorámico)</TableCell>
                  <TableCell>Cabecera principal superior (Above the fold) en desktop y tablets</TableCell>
                  <TableCell color="success.main">&lt; 150 KB</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Medium Rectangle / Robapáginas</TableCell>
                  <TableCell><Chip label="300 × 250" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>1.20:1 (Casi cuadrado)</TableCell>
                  <TableCell>Insertado dentro del contenido editorial (In-Article) o barra lateral</TableCell>
                  <TableCell>&lt; 150 KB</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner Cuadrado Promocional</TableCell>
                  <TableCell><Chip label="600 × 500" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>1.20:1 (Retina 2x)</TableCell>
                  <TableCell>Promociones destacadas en newsletters, e-commerce y carruseles</TableCell>
                  <TableCell>&lt; 200 KB</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Banner Horizontal Móvil</TableCell>
                  <TableCell><Chip label="640 × 200" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>3.20:1 (Horizontal)</TableCell>
                  <TableCell>Separador de secciones en blogs y cabeceras de boletines</TableCell>
                  <TableCell>&lt; 120 KB</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Hero Banner Panorámico</TableCell>
                  <TableCell><Chip label="1100 × 361" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>3.05:1 (Ultra-ancho)</TableCell>
                  <TableCell>Portadas de landing pages, cabeceras de tiendas Shopify y WordPress</TableCell>
                  <TableCell>&lt; 250 KB</TableCell>
                </TableRow>
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Wide Skyscraper / Rascacielos</TableCell>
                  <TableCell><Chip label="160 × 600" size="small" variant="outlined" color="primary" /></TableCell>
                  <TableCell>1:3.75 (Vertical)</TableCell>
                  <TableCell>Barras laterales fijas (Sticky Sidebars) en pantallas de escritorio</TableCell>
                  <TableCell>&lt; 150 KB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Comparativa de Formatos: WebP vs JPG vs PNG */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SpeedIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>WebP (Recomendado)</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Desarrollado por Google, ofrece una compresión superior (entre 25% y 34% más eficiente que JPEG equivalente) soportando tanto compresión con pérdida como sin pérdida y transparencias alfa. Es el formato moderno por excelencia para acelerar sitios web.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <ImageIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>JPEG / JPG (Universal)</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ideal para fotografías complejas y banners con degradados fotográficos continuos. Ofrece 100% de compatibilidad en cualquier navegador antiguo o plataforma de correo electrónico, permitiendo graduar el ratio de calidad/peso con precisión milimétrica.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(236, 72, 153, 0.04)', border: '1px solid rgba(236, 72, 153, 0.15)', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LayersIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>PNG (Alta Fidelidad)</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Compresión sin pérdida diseñada para logotipos, textos tipográficos nítidos y gráficos con fondos transparentes. Aunque su peso suele ser mayor, es fundamental cuando se requiere nitidez absoluta en isotipos y bordes de contraste agudo.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SECCIÓN EDUCATIVA 2: Core Web Vitals y Rendimiento Web */}
        <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)', mb: 6 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 800, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon /> Impacto de la Compresión en Core Web Vitals y CTR Publicitario
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Google utiliza las métricas de <strong>Core Web Vitals</strong> como factor de posicionamiento oficial en su motor de búsqueda. Las imágenes pesadas y sin optimizar son la principal causa de calificaciones deficientes en PageSpeed Insights:
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, borderLeft: '3px solid #3b82f6', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.light', mb: 0.5 }}>
                  LCP (Largest Contentful Paint)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mide el tiempo transcurrido hasta que el elemento visual principal de la pantalla se renderiza. Al comprimir banners de 800 KB a menos de 60 KB, el LCP se reduce a menudo de 3.8s a menos de 1.1s, ingresando en la zona verde de Google (&lt; 2.5s).
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, borderLeft: '3px solid #10b981', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.light', mb: 0.5 }}>
                  CLS (Cumulative Layout Shift)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mide la estabilidad visual. Al utilizar proporciones de aspecto estandarizadas (como 728x90 o 300x250), los contenedores HTML reservan el espacio exacto por anticipado, eliminando saltos bruscos de contenido mientras el anuncio se descarga.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, borderLeft: '3px solid #ec4899', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'secondary.light', mb: 0.5 }}>
                  INP & CTR de Campañas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estudios de Google y Akamai demuestran que cada 100 milisegundos de retraso en la carga de un banner reduce el CTR (Click-Through Rate) hasta en un 7%. Banners ultraligeros garantizan que el anuncio sea visto antes de que el usuario haga scroll.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SUITE DE HERRAMIENTAS DE IMAGEN */}
        <Box sx={{ mb: 7 }} id="suite-herramientas-imagen">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip icon={<LayersIcon />} label="Ecosistema Multimedia" color="primary" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
              Más Herramientas de Imagen en DesignKit
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto' }}>
              Utilidades 100% locales ejecutadas en tu navegador para optimizar tu flujo de trabajo digital.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {[
              {
                title: 'Conversor de Formatos',
                desc: 'Convierte lotes de imágenes entre WebP, PNG y JPEG con control de calidad.',
                path: '/conversor-formatos',
                icon: <TransformIcon color="primary" />,
                badge: 'Lotes'
              },
              {
                title: 'Compresor con Vista en Vivo',
                desc: 'Compara calidad antes y después en pantalla dividida en tiempo real.',
                path: '/compresor-imagenes',
                icon: <CompareIcon color="primary" />,
                badge: 'Interactivo'
              },
              {
                title: 'Generador de Favicons',
                desc: 'Genera el paquete completo de iconos web, Apple Touch y site.webmanifest.',
                path: '/favicon-generator',
                icon: <LanguageIcon color="primary" />,
                badge: 'PWA'
              },
              {
                title: 'Redimensionador Redes Sociales',
                desc: 'Adapta creatividades a Instagram, TikTok, YouTube, X y LinkedIn.',
                path: '/redimensionador-redes',
                icon: <ShareIcon color="primary" />,
                badge: 'Presets'
              },
              {
                title: 'Limpiador de EXIF & GPS',
                desc: 'Elimina metadatos privados, coordenadas y modelo de cámara de tus fotos.',
                path: '/limpiador-exif',
                icon: <SecurityIcon color="primary" />,
                badge: 'Privacidad'
              },
              {
                title: 'Rasterizador SVG a PNG/WebP',
                desc: 'Convierte vectores SVG a resoluciones nítidas en 1x, 2x y 4x Ultra HD.',
                path: '/svg-rasterizer',
                icon: <CodeIcon color="primary" />,
                badge: 'Vectorial'
              },
              {
                title: 'Estudio de Marcas de Agua',
                desc: 'Protege tu contenido con marcas de agua de texto, logotipo y patrones.',
                path: '/marcas-agua',
                icon: <WatermarkIcon color="primary" />,
                badge: 'Seguridad'
              },
              {
                title: 'Banners GIF Animados',
                desc: 'Comprime GIFs publicitarios para mantenerlos estrictamente bajo 180 KB.',
                path: '/gif-optimizer',
                icon: <AnimationIcon color="primary" />,
                badge: '≤180KB'
              }
            ].map((tool) => (
              <Grid item xs={12} sm={6} md={3} key={tool.path}>
                <Paper
                  variant="outlined"
                  component={RouterLink}
                  to={tool.path}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.06)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', display: 'flex' }}>
                      {tool.icon}
                    </Box>
                    <Chip label={tool.badge} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {tool.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, flex: 1 }}>
                    {tool.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* SECCIÓN 3: Preguntas Frecuentes (FAQ Accordion) */}
        <Box sx={{ mb: 6 }} id="preguntas-frecuentes">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip icon={<HelpIcon />} label="Dudas Frecuentes" color="secondary" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
              Preguntas Frecuentes sobre Banner Optimizer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todo lo que necesitas saber sobre privacidad, formatos de compresión y especificaciones publicitarias.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Accordion defaultExpanded sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cómo protege mis datos la optimización client-side?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Nuestra herramienta aprovecha las APIs nativas de HTML5 (Canvas y File API) en tu propio navegador. Esto significa que las imágenes se cargan, redimensionan, reencuadran y comprimen en la memoria RAM de tu computadora o teléfono móvil. <strong>Ninguna imagen se transmite por Internet a servidores externos ni queda almacenada en bases de datos</strong>, garantizando 100% de confidencialidad para material creativo y campañas bajo embargo.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cuál es la diferencia entre PNG, JPG y WebP para anuncios publicitarios?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>JPG</strong> utiliza compresión con pérdida y es ideal para creatividades con fotografías complejas; <strong>PNG</strong> ofrece compresión sin pérdida preservando bordes nítidos y fondos transparentes; <strong>WebP</strong> combina las ventajas de ambos, logrando archivos entre un 25% y 35% más ligeros con idéntica calidad visual. Para la Red de Display de Google, WebP y JPG con calidad ~85% representan el balance óptimo entre peso y definición.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Por qué es crítico reducir el peso de las imágenes en la web?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Las imágenes representan más del 60% del peso promedio de una página web moderna. Reducir su tamaño en kilobytes ahorra ancho de banda en conexiones móviles, disminuye la tasa de rebote (bounce rate) y permite que los sitios aprueben las auditorías de <strong>Core Web Vitals</strong> de Google, lo que se traduce en un mejor posicionamiento SEO orgánico y menores costos por clic (CPC) en anuncios publicitarios.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Qué relación de aspecto es ideal para cabeceras y banners laterales?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Para cabeceras superiores (Leaderboard) el estándar internacional es <strong>728×90 px (ratio ~8.09:1)</strong> o <strong>1100×361 px (ratio 3.05:1)</strong> en landing pages panorámicas. Para barras laterales (Sidebars), el formato más efectivo es el Skyscraper de <strong>160×600 px (ratio 1:3.75)</strong> o el Half Page de <strong>300×600 px (ratio 1:2)</strong>, pues garantizan alta visibilidad durante el desplazamiento vertical del lector.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cómo afecta la velocidad de carga al CTR de las campañas de marketing?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Un banner publicitario pesado que tarda más de 2 segundos en renderizarse con frecuencia nunca es visto por el usuario, ya que este suele desplazarse rápidamente hacia el contenido de la página. Banners que cargan en menos de 300 ms registran tasas de visibilidad (Viewability) superiores al 85% y aumentan el Click-Through Rate (CTR) de manera sostenida.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Cuáles son los límites de peso de archivo en Google Display Network y Meta Ads?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Google Ads establece un límite estricto de <strong>150 KB</strong> para banners estáticos o animados HTML5 en su red de Display. Para Meta (Facebook e Instagram Ads), aunque el límite técnico es mayor (hasta 30 MB), se recomienda enfáticamente mantener las imágenes por debajo de <strong>200-300 KB</strong> para evitar penalizaciones en la subasta y maximizar la velocidad de entrega en feeds móviles.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 1.5, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ¿Puedo recortar y optimizar múltiples formatos a la vez y descargarlos en un único archivo ZIP?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Sí. Puedes arrastrar varios archivos a la vez a nuestra zona de carga. Cada imagen será detectada y asociada a su mejor proporción recomendada, o bien podrás personalizar las dimensiones de salida para cada una. Al finalizar, el botón <strong>"Descargar Todo"</strong> generará al instante un archivo comprimido <code>.zip</code> con todos tus banners listos para publicar.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {/* Anuncio Horizontal Inferior con margen de seguridad >= 32px */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BannerOptimizer;