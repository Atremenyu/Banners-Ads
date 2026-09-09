import React, { useState, useRef, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Chip,
  Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Card, CardContent,
  Divider, LinearProgress
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  DeleteOutline as DeleteIcon,
  Security as SecurityIcon,
  LocationOff as LocationOffIcon,
  CheckCircle as CheckCircleIcon,
  Archive as ArchiveIcon,
  WarningAmber as WarningIcon,
  Visibility as VisibilityIcon,
  LockOpen as LockOpenIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

interface SanitizedItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  cleanBlob?: Blob;
  cleanSize?: number;
  detectedTags: {
    hasGps: boolean;
    gpsCoords?: string;
    cameraModel?: string;
    dateTime?: string;
    software?: string;
  };
  status: 'analyzing' | 'clean' | 'error';
}

// Basic binary EXIF parser for JPEG files (reads APP1 0xFFE1 header)
const inspectJpegExif = async (file: File): Promise<{
  hasGps: boolean;
  gpsCoords?: string;
  cameraModel?: string;
  dateTime?: string;
  software?: string;
}> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve({ hasGps: false });
        return;
      }

      const view = new DataView(buffer);
      if (view.getUint16(0, false) !== 0xFFD8) {
        // Not a standard JPEG or format without standard APP1 header
        resolve({ hasGps: false });
        return;
      }

      let offset = 2;
      let hasGps = false;
      let cameraModel: string | undefined;
      let dateTime: string | undefined;
      let software: string | undefined;

      while (offset < view.byteLength - 2) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xFFE1) {
          // APP1 Marker found (EXIF / XMP data block)
          const length = view.getUint16(offset, false);
          const exifHeader = String.fromCharCode(
            view.getUint8(offset + 2),
            view.getUint8(offset + 3),
            view.getUint8(offset + 4),
            view.getUint8(offset + 5)
          );

          if (exifHeader === 'Exif') {
            // Read raw bytes chunk into string to detect known sensitive tag names
            const chunk = new Uint8Array(buffer, offset + 2, Math.min(length, buffer.byteLength - (offset + 2)));
            let rawStr = '';
            for (let i = 0; i < chunk.length; i++) {
              if (chunk[i] >= 32 && chunk[i] <= 126) {
                rawStr += String.fromCharCode(chunk[i]);
              } else {
                rawStr += ' ';
              }
            }

            if (/GPS|latitude|longitude/i.test(rawStr)) {
              hasGps = true;
            }
            if (/Apple|Canon|Nikon|Sony|Samsung|Google|Xiaomi|HUAWEI/i.test(rawStr)) {
              const match = rawStr.match(/(Apple|Canon|Nikon|Sony|Samsung|Google|Xiaomi|HUAWEI)[A-Za-z0-9\s-_]{2,20}/i);
              if (match) cameraModel = match[0].trim();
            }
            const dateMatch = rawStr.match(/\d{4}[:/-]\d{2}[:/-]\d{2}\s\d{2}:\d{2}:\d{2}/);
            if (dateMatch) {
              dateTime = dateMatch[0];
            }
          }
          break;
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }

      resolve({
        hasGps,
        gpsCoords: hasGps ? 'Coordenadas detectadas en metadatos' : undefined,
        cameraModel,
        dateTime,
        software
      });
    };

    reader.readAsArrayBuffer(file.slice(0, 128 * 1024)); // inspect first 128KB
  });
};

const sanitizeImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0);

      // Re-encoding directly into JPEG strips all original EXIF, GPS, camera serials and TIFF blocks
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Blob creation failed'));
      }, mime, 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Error al decodificar la imagen'));
    };

    img.src = objectUrl;
  });
};

const ExifCleaner: React.FC = () => {
  const [items, setItems] = useState<SanitizedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) {
      setToast({ open: true, message: 'Selecciona imagenes validas (JPG, PNG, WebP)', severity: 'error' });
      return;
    }

    setIsProcessing(true);
    const newItems: SanitizedItem[] = [];

    for (const file of valid) {
      const tags = await inspectJpegExif(file);
      try {
        const cleanBlob = await sanitizeImage(file);
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          file,
          name: file.name,
          originalSize: file.size,
          cleanBlob,
          cleanSize: cleanBlob.size,
          detectedTags: tags,
          status: 'clean'
        });
      } catch {
        newItems.push({
          id: `${file.name}-${Date.now()}`,
          file,
          name: file.name,
          originalSize: file.size,
          detectedTags: tags,
          status: 'error'
        });
      }
    }

    setItems(prev => [...prev, ...newItems]);
    setIsProcessing(false);
    setToast({
      open: true,
      message: `${newItems.length} foto${newItems.length > 1 ? 's sanitizadas' : ' sanitizada'} sin metadatos`,
      severity: 'success'
    });
  }, []);

  const handleDownloadSingle = (item: SanitizedItem) => {
    if (!item.cleanBlob) return;
    const url = URL.createObjectURL(item.cleanBlob);
    const a = document.createElement('a');
    const extIdx = item.name.lastIndexOf('.');
    const base = extIdx > -1 ? item.name.substring(0, extIdx) : item.name;
    const ext = item.file.type === 'image/png' ? 'png' : 'jpg';
    a.download = `${base}_limpia.${ext}`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    const ready = items.filter(i => i.status === 'clean' && i.cleanBlob);
    if (ready.length === 0) return;

    try {
      const zip = new JSZip();
      ready.forEach(item => {
        if (item.cleanBlob) {
          const extIdx = item.name.lastIndexOf('.');
          const base = extIdx > -1 ? item.name.substring(0, extIdx) : item.name;
          const ext = item.file.type === 'image/png' ? 'png' : 'jpg';
          zip.file(`${base}_sin_exif.${ext}`, item.cleanBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.download = `fotos_privacidad_sanitizadas_${Date.now()}.zip`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast({ open: true, message: 'Archivo ZIP descargado con éxito', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Error al generar ZIP', severity: 'error' });
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Limpiador de Metadatos <Box component="span" sx={{ color: 'primary.main' }}>EXIF & Privacidad</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Elimina por completo la geolocalización GPS, número de serie de cámara, fecha exacta y rastros personales antes de compartir o publicar tus fotografías.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Upload Zone */}
      <Paper
        variant="outlined"
        id="exif-dropzone"
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
          processFiles(dropped);
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
          id="exif-file-input"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.jpg,.jpeg,.png,.webp,.heic"
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            processFiles(files);
          }}
        />
        <ShieldIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Arrastra fotografías aquí para limpiar sus metadatos automáticamente
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tus imágenes se procesan de forma privada dentro de tu navegador web sin transmitirse a servidores
        </Typography>
      </Paper>

      {/* Action Bar when items loaded */}
      {items.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2.5,
            bgcolor: 'background.paper',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {items.filter(i => i.status === 'clean').length} de {items.length} imágenes sanitizadas y libres de EXIF
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              id="download-all-clean-zip"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleDownloadZip}
              startIcon={<ArchiveIcon />}
              sx={{ fontWeight: 700 }}
            >
              Descargar Todo en ZIP
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={clearAll}
              startIcon={<DeleteIcon />}
            >
              Limpiar Lista
            </Button>
          </Box>
        </Paper>
      )}

      {/* Items Table */}
      {items.length > 0 && (
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
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Fotografía</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Metadatos Detectados y Removidos</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Peso Original</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado de Privacidad</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Descarga</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 220 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {item.detectedTags.hasGps ? (
                          <Chip
                            label="Ubicación GPS Eliminada"
                            size="small"
                            color="error"
                            variant="outlined"
                            icon={<LocationOffIcon />}
                            sx={{ fontWeight: 700 }}
                          />
                        ) : (
                          <Chip label="Sin GPS" size="small" variant="outlined" />
                        )}

                        {item.detectedTags.cameraModel && (
                          <Chip
                            label={`Cámara: ${item.detectedTags.cameraModel}`}
                            size="small"
                            variant="outlined"
                            sx={{ color: 'text.secondary' }}
                          />
                        )}

                        {item.detectedTags.dateTime && (
                          <Chip
                            label={`Fecha original: ${item.detectedTags.dateTime}`}
                            size="small"
                            variant="outlined"
                            sx={{ color: 'text.secondary' }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontFamily: 'monospace' }}>
                      {(item.originalSize / 1024).toFixed(1)} KB
                    </TableCell>

                    <TableCell>
                      {item.status === 'clean' && (
                        <Chip
                          label="100% Sanitizada"
                          size="small"
                          color="success"
                          icon={<SecurityIcon />}
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                      {item.status === 'error' && (
                        <Chip label="Fallo al procesar" size="small" color="error" />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {item.status === 'clean' && (
                          <Tooltip title="Descargar imagen limpia">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleDownloadSingle(item)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Eliminar de la lista">
                          <IconButton
                            size="small"
                            onClick={() => removeItem(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Educational Information on Photo Privacy */}
      <Box sx={{ mb: 6 }} id="privacy-educational-guide">
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          ¿Por qué es importante limpiar los metadatos EXIF?
        </Typography>
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
                <LocationOffIcon color="error" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Coordenadas GPS de tu Casa o Trabajo
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Los teléfonos inteligentes graban la latitud, longitud y altitud exacta del lugar donde tomaste la foto. Al publicar sin limpiar, terceros pueden deducir tu domicilio.
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
                <SecurityIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Número de Serie y Dispositivo
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Las etiquetas EXIF guardan el modelo exacto, versión de firmware y número de serie del sensor fotográfico, lo que permite vincular fotos anónimas a un dispositivo específico.
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
                <CheckCircleIcon color="success" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Procesamiento 100% en Cliente
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No subimos tus fotos a ningún servidor remoto. La sanitización se realiza directamente en la memoria de tu navegador eliminando cualquier bloque de metadatos no visual.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

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

export default ExifCleaner;
