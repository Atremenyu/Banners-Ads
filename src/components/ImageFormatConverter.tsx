import React, { useState, useCallback, useRef } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider, Select,
  MenuItem, FormControl, InputLabel, Chip, Alert, LinearProgress,
  IconButton, Tooltip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Snackbar, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  DeleteOutline as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  Archive as ArchiveIcon,
  CompareArrows as CompareIcon,
  Transform as TransformIcon,
  Tune as TuneIcon,
  Security as SecurityIcon,
  Layers as LayersIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png';

interface QueuedFile {
  id: string;
  file: File;
  targetFormat: OutputFormat;
  quality: number;
  bgColor: string;
  status: 'queued' | 'converting' | 'done' | 'error';
  progress: number;
  originalSize: number;
  convertedBlob?: Blob;
  convertedSize?: number;
  errorMsg?: string;
  outputName: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const getExtension = (mime: OutputFormat): string => {
  switch (mime) {
    case 'image/webp': return 'webp';
    case 'image/png': return 'png';
    case 'image/jpeg': return 'jpg';
  }
};

const ImageFormatConverter: React.FC = () => {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>('image/webp');
  const [globalQuality, setGlobalQuality] = useState<number>(85);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isConvertingAll, setIsConvertingAll] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const validImages = newFiles.filter(f => f.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(f.name));
    if (validImages.length === 0) {
      setToast({ open: true, message: 'Ninguno de los archivos seleccionados es una imagen valida', severity: 'error' });
      return;
    }

    const newQueued: QueuedFile[] = validImages.map(file => {
      const extIdx = file.name.lastIndexOf('.');
      const baseName = extIdx > -1 ? file.name.substring(0, extIdx) : file.name;
      return {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        file,
        targetFormat: globalFormat,
        quality: globalQuality,
        bgColor,
        status: 'queued',
        progress: 0,
        originalSize: file.size,
        outputName: `${baseName}.${getExtension(globalFormat)}`
      };
    });

    setFiles(prev => [...prev, ...newQueued]);
    setToast({
      open: true,
      message: `${validImages.length} imagen${validImages.length > 1 ? 'es añadidas' : ' añadida'} a la cola`,
      severity: 'success'
    });
  }, [globalFormat, globalQuality, bgColor]);

  const convertSingleFile = async (item: QueuedFile): Promise<QueuedFile> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(item.file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            ...item,
            status: 'error',
            errorMsg: 'Contexto de lienzo no disponible'
          });
          return;
        }

        // Handle background color for JPEG (which does not support transparency)
        if (item.targetFormat === 'image/jpeg') {
          ctx.fillStyle = item.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);

        const qualityParam = item.targetFormat === 'image/png' ? undefined : item.quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                ...item,
                status: 'error',
                errorMsg: 'Fallo la creacion del archivo binario'
              });
              return;
            }

            const extIdx = item.file.name.lastIndexOf('.');
            const baseName = extIdx > -1 ? item.file.name.substring(0, extIdx) : item.file.name;
            const finalName = `${baseName}.${getExtension(item.targetFormat)}`;

            resolve({
              ...item,
              status: 'done',
              progress: 100,
              convertedBlob: blob,
              convertedSize: blob.size,
              outputName: finalName
            });
          },
          item.targetFormat,
          qualityParam
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          ...item,
          status: 'error',
          errorMsg: 'Error al decodificar la imagen fuente'
        });
      };

      img.src = objectUrl;
    });
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;
    setIsConvertingAll(true);

    const pending = files.filter(f => f.status !== 'done');
    if (pending.length === 0) {
      setToast({ open: true, message: 'Todos los archivos ya han sido procesados', severity: 'info' });
      setIsConvertingAll(false);
      return;
    }

    const updatedList = [...files];

    for (let i = 0; i < updatedList.length; i++) {
      if (updatedList[i].status !== 'done') {
        updatedList[i] = { ...updatedList[i], status: 'converting', progress: 50 };
        setFiles([...updatedList]);

        const result = await convertSingleFile(updatedList[i]);
        updatedList[i] = result;
        setFiles([...updatedList]);
      }
    }

    setIsConvertingAll(false);
    setToast({ open: true, message: 'Conversion completada con exito', severity: 'success' });
  };

  const handleDownloadSingle = (item: QueuedFile) => {
    if (!item.convertedBlob) return;
    const url = URL.createObjectURL(item.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    const readyItems = files.filter(f => f.status === 'done' && f.convertedBlob);
    if (readyItems.length === 0) {
      setToast({ open: true, message: 'No hay imagenes convertidas listas para descargar', severity: 'error' });
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      readyItems.forEach(item => {
        if (item.convertedBlob) {
          zip.file(item.outputName, item.convertedBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagenes_convertidas_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast({ open: true, message: 'Archivo ZIP descargado correctamente', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Error al generar el archivo comprimido', severity: 'error' });
    } finally {
      setIsZipping(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setToast({ open: true, message: 'Lista vaciada', severity: 'info' });
  };

  const handleGlobalFormatChange = (fmt: OutputFormat) => {
    setGlobalFormat(fmt);
    setFiles(prev => prev.map(f => {
      const extIdx = f.file.name.lastIndexOf('.');
      const baseName = extIdx > -1 ? f.file.name.substring(0, extIdx) : f.file.name;
      return {
        ...f,
        targetFormat: fmt,
        status: 'queued',
        convertedBlob: undefined,
        convertedSize: undefined,
        outputName: `${baseName}.${getExtension(fmt)}`
      };
    }));
  };

  const handleGlobalQualityChange = (val: number) => {
    setGlobalQuality(val);
    setFiles(prev => prev.map(f => ({
      ...f,
      quality: val,
      status: 'queued',
      convertedBlob: undefined,
      convertedSize: undefined
    })));
  };

  const completedCount = files.filter(f => f.status === 'done').length;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Conversor Universal de <Box component="span" sx={{ color: 'primary.main' }}>Formatos de Imagen</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Convierte por lotes entre WebP, PNG y JPEG con control de calidad y compresion 100% en tu navegador, sin enviar datos a ningun servidor externo.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Controls Bar */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Output Format */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="target-format-label">Formato de Salida</InputLabel>
              <Select
                labelId="target-format-label"
                id="target-format-select"
                value={globalFormat}
                label="Formato de Salida"
                onChange={(e) => handleGlobalFormatChange(e.target.value as OutputFormat)}
              >
                <MenuItem value="image/webp">WebP (Optimo para Web, con alfa)</MenuItem>
                <MenuItem value="image/png">PNG (Sin perdidas, transparente)</MenuItem>
                <MenuItem value="image/jpeg">JPEG (Universal, fondo solido)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Quality Slider (for WebP and JPEG) */}
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Calidad de Compresion:
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                  {globalFormat === 'image/png' ? '100% (Lossless)' : `${globalQuality}%`}
                </Typography>
              </Box>
              <Slider
                id="converter-quality-slider"
                value={globalQuality}
                disabled={globalFormat === 'image/png'}
                min={20}
                max={100}
                step={5}
                onChange={(_, val) => handleGlobalQualityChange(val as number)}
                valueLabelDisplay="auto"
                size="small"
              />
            </Box>
          </Grid>

          {/* Background fill for JPEG */}
          {globalFormat === 'image/jpeg' && (
            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                  Fondo para transparencias:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input
                    id="jpeg-bg-color-picker"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      background: 'none'
                    }}
                  />
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {bgColor.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid item xs={12} sm={globalFormat === 'image/jpeg' ? 6 : 12} md={globalFormat === 'image/jpeg' ? 3 : 5} sx={{ display: 'flex', gap: 1.5, justifyContent: { md: 'flex-end' } }}>
            <Button
              id="convert-all-button"
              variant="contained"
              color="primary"
              disabled={files.length === 0 || isConvertingAll}
              onClick={handleConvertAll}
              startIcon={<TransformIcon />}
              sx={{ fontWeight: 700, px: 2.5 }}
            >
              {isConvertingAll ? 'Convirtiendo...' : `Convertir Todo (${files.length})`}
            </Button>
            {completedCount > 0 && (
              <Button
                id="download-zip-button"
                variant="outlined"
                color="success"
                disabled={isZipping}
                onClick={handleDownloadZip}
                startIcon={<ArchiveIcon />}
                sx={{ fontWeight: 700 }}
              >
                {isZipping ? 'Comprimiendo...' : `Descargar ZIP (${completedCount})`}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Drag & Drop Area */}
      <Paper
        variant="outlined"
        id="converter-dropzone"
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
          const dropped = Array.from(e.dataTransfer.files);
          addFiles(dropped);
        }}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          cursor: 'pointer',
          borderRadius: 3,
          transition: 'all 0.2s ease',
          '&:hover, &:focus-visible': {
            borderColor: 'primary.main',
            bgcolor: 'rgba(59, 130, 246, 0.05)',
            outline: 'none'
          }
        }}
      >
        <input
          id="converter-file-input"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.webp,.png,.jpg,.jpeg,.gif,.bmp,.svg,.avif"
          style={{ display: 'none' }}
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            addFiles(selected);
          }}
        />
        <UploadFileIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Arrastra imagenes aqui o haz clic para explorar tus archivos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Admite multiples archivos PNG, JPG, WebP, GIF, SVG, BMP y AVIF
        </Typography>
      </Paper>

      {/* Queue Table */}
      {files.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Cola de Procesamiento ({files.length} archivos)
            </Typography>
            <Button
              id="clear-queue-button"
              size="small"
              variant="text"
              color="error"
              onClick={clearAll}
              startIcon={<DeleteIcon />}
            >
              Limpiar Lista
            </Button>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Archivo Original</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Formato Destino</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Peso Original</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Peso Resultante</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ahorro</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Accion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((item) => {
                  const hasReduction = item.convertedSize && item.convertedSize < item.originalSize;
                  const diffPercent = item.convertedSize
                    ? (((item.originalSize - item.convertedSize) / item.originalSize) * 100).toFixed(0)
                    : null;

                  return (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 600, maxWidth: 220 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                          {item.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.file.type || 'image'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getExtension(item.targetFormat).toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        {formatBytes(item.originalSize)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {item.convertedSize ? formatBytes(item.convertedSize) : 'En espera'}
                      </TableCell>
                      <TableCell>
                        {diffPercent !== null ? (
                          <Chip
                            label={hasReduction ? `-${diffPercent}%` : `+${Math.abs(Number(diffPercent))}%`}
                            size="small"
                            color={hasReduction ? 'success' : 'default'}
                            sx={{ fontWeight: 700 }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.status === 'queued' && (
                          <Chip label="Listo" size="small" variant="outlined" />
                        )}
                        {item.status === 'converting' && (
                          <Box sx={{ width: 100 }}>
                            <LinearProgress variant="indeterminate" sx={{ borderRadius: 1 }} />
                          </Box>
                        )}
                        {item.status === 'done' && (
                          <Chip label="Completado" size="small" color="success" icon={<CheckCircleIcon />} />
                        )}
                        {item.status === 'error' && (
                          <Chip label="Error" size="small" color="error" icon={<ErrorIcon />} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          {item.status === 'done' && item.convertedBlob && (
                            <Tooltip title="Descargar archivo">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleDownloadSingle(item)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Eliminar de la cola">
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => removeFile(item.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Educational & Technical Guidance Section */}
      <Box sx={{ mb: 6 }} id="format-technical-guide">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TransformIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  WebP: Eficiencia Moderna
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Desarrollado por Google, ofrece entre 25% y 35% de reduccion de peso frente a JPEG con igual fidelidad visual, ademas de admitir canal alfa con transparencia completa.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LayersIcon color="success" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  PNG: Nitidez Sin Perdidas
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Ideal para logotipos, iconos vectorizados y graficos con texto donde los artefactos de compresion no son tolerables. Conserva 100% de la informacion de cada pixel.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                bgcolor: 'background.paper',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SecurityIcon color="secondary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  100% Local y Confidencial
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Toda la conversion y compresion se ejecuta en la memoria RAM y el procesador de tu dispositivo mediante la API Canvas HTML5. Tus imagenes jamas viajan por internet.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Lower Ad Placeholder */}
      <Box sx={{ mt: 4 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
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

export default ImageFormatConverter;
