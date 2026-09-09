import React, { useState, useRef, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider,
  Chip, Snackbar, Alert, Checkbox, FormControlLabel, RadioGroup,
  Radio, FormControl, FormLabel, Card, CardContent, Divider,
  Tooltip, IconButton
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Tune as TuneIcon,
  Share as ShareIcon,
  Crop as CropIcon,
  BlurOn as BlurIcon,
  FormatColorFill as FillIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

interface SocialPreset {
  id: string;
  platform: string;
  name: string;
  width: number;
  height: number;
  ratio: string;
  recommended: boolean;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  // Instagram
  { id: 'ig-square', platform: 'Instagram', name: 'Post Cuadrado (1:1)', width: 1080, height: 1080, ratio: '1:1', recommended: true },
  { id: 'ig-portrait', platform: 'Instagram', name: 'Post Vertical (4:5)', width: 1080, height: 1350, ratio: '4:5', recommended: true },
  { id: 'ig-story', platform: 'Instagram', name: 'Story / Reel (9:16)', width: 1080, height: 1920, ratio: '9:16', recommended: true },

  // X / Twitter
  { id: 'x-post', platform: 'X / Twitter', name: 'Post Feed (16:9)', width: 1200, height: 675, ratio: '16:9', recommended: true },
  { id: 'x-header', platform: 'X / Twitter', name: 'Encabezado de Perfil (3:1)', width: 1500, height: 500, ratio: '3:1', recommended: false },

  // YouTube
  { id: 'yt-thumb', platform: 'YouTube', name: 'Miniatura (Thumbnail)', width: 1280, height: 720, ratio: '16:9', recommended: true },
  { id: 'yt-banner', platform: 'YouTube', name: 'Cabecera de Canal', width: 2560, height: 1440, ratio: '16:9', recommended: false },

  // LinkedIn
  { id: 'li-post', platform: 'LinkedIn', name: 'Post Compartido', width: 1200, height: 627, ratio: '1.91:1', recommended: true },
  { id: 'li-banner', platform: 'LinkedIn', name: 'Portada de Empresa / Perfil', width: 1584, height: 396, ratio: '4:1', recommended: false },

  // Open Graph & Web
  { id: 'og-card', platform: 'Web / Open Graph', name: 'Tarjeta Enlace (WhatsApp / Slack / FB)', width: 1200, height: 630, ratio: '1.91:1', recommended: true },

  // TikTok
  { id: 'tt-video', platform: 'TikTok', name: 'Portada / Formato Vertical (9:16)', width: 1080, height: 1920, ratio: '9:16', recommended: false },
];

type FitMode = 'cover' | 'blur' | 'color';

const SocialMediaResizer: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<{
    file: File;
    url: string;
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>(
    SOCIAL_PRESETS.filter(p => p.recommended).map(p => p.id)
  );

  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [fillColor, setFillColor] = useState<string>('#111827');
  const [quality, setQuality] = useState<number>(88);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoaded = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'Selecciona un archivo de imagen valido', severity: 'error' });
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
        name: file.name
      });
      setToast({ open: true, message: `Imagen cargada: ${img.naturalWidth}×${img.naturalHeight} px`, severity: 'success' });
    };
    img.onerror = () => {
      setToast({ open: true, message: 'No se pudo leer la imagen', severity: 'error' });
    };
    img.src = objUrl;
  };

  const togglePreset = (id: string) => {
    setSelectedPresetIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedPresetIds(SOCIAL_PRESETS.map(p => p.id));
  };

  const selectNone = () => {
    setSelectedPresetIds([]);
  };

  const selectRecommended = () => {
    setSelectedPresetIds(SOCIAL_PRESETS.filter(p => p.recommended).map(p => p.id));
  };

  // Render a specific preset onto a canvas and return Blob
  const renderPresetToBlob = (preset: SocialPreset): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!sourceImage) return reject(new Error('Sin imagen cargada'));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Contexto 2D no disponible'));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (fitMode === 'cover') {
          // Center crop to fill the canvas completely
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const targetAspect = preset.width / preset.height;
          let drawW = preset.width;
          let drawH = preset.height;
          let offsetX = 0;
          let offsetY = 0;

          if (imgAspect > targetAspect) {
            drawH = preset.height;
            drawW = preset.height * imgAspect;
            offsetX = (preset.width - drawW) / 2;
          } else {
            drawW = preset.width;
            drawH = preset.width / imgAspect;
            offsetY = (preset.height - drawH) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else if (fitMode === 'blur') {
          // 1. Draw blurred background covering entire canvas
          ctx.save();
          ctx.filter = 'blur(30px) brightness(0.7)';
          const scale = Math.max(preset.width / img.naturalWidth, preset.height / img.naturalHeight) * 1.15;
          const bgW = img.naturalWidth * scale;
          const bgH = img.naturalHeight * scale;
          ctx.drawImage(img, (preset.width - bgW) / 2, (preset.height - bgH) / 2, bgW, bgH);
          ctx.restore();

          // 2. Draw proportional contained image in foreground
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const targetAspect = preset.width / preset.height;
          let drawW = preset.width;
          let drawH = preset.height;

          if (imgAspect > targetAspect) {
            drawW = preset.width;
            drawH = preset.width / imgAspect;
          } else {
            drawH = preset.height;
            drawW = preset.height * imgAspect;
          }

          const offsetX = (preset.width - drawW) / 2;
          const offsetY = (preset.height - drawH) / 2;

          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else {
          // Solid color background with proportional contained image
          ctx.fillStyle = fillColor;
          ctx.fillRect(0, 0, preset.width, preset.height);

          const imgAspect = img.naturalWidth / img.naturalHeight;
          const targetAspect = preset.width / preset.height;
          let drawW = preset.width;
          let drawH = preset.height;

          if (imgAspect > targetAspect) {
            drawW = preset.width;
            drawH = preset.width / imgAspect;
          } else {
            drawH = preset.height;
            drawW = preset.height * imgAspect;
          }

          const offsetX = (preset.width - drawW) / 2;
          const offsetY = (preset.height - drawH) / 2;

          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        }

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Fallo blob export'));
        }, 'image/jpeg', quality / 100);
      };
      img.src = sourceImage.url;
    });
  };

  const handleDownloadSingle = async (preset: SocialPreset) => {
    try {
      const blob = await renderPresetToBlob(preset);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = sourceImage?.name.substring(0, sourceImage.name.lastIndexOf('.')) || 'imagen';
      a.download = `${baseName}_${preset.platform.toLowerCase()}_${preset.width}x${preset.height}.jpg`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast({ open: true, message: `Descargado: ${preset.name}`, severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Error al exportar la imagen', severity: 'error' });
    }
  };

  const handleDownloadAllZip = async () => {
    if (!sourceImage || selectedPresetIds.length === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const presetsToExport = SOCIAL_PRESETS.filter(p => selectedPresetIds.includes(p.id));
      const baseName = sourceImage.name.substring(0, sourceImage.name.lastIndexOf('.')) || 'imagen';

      for (const preset of presetsToExport) {
        const blob = await renderPresetToBlob(preset);
        const folderName = preset.platform.replace(/[/\s]/g, '_');
        const filename = `${folderName}/${baseName}_${preset.width}x${preset.height}.jpg`;
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.download = `redes_sociales_${baseName}_${Date.now()}.zip`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({ open: true, message: `${presetsToExport.length} formatos descargados en ZIP`, severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Error al generar el archivo ZIP', severity: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Redimensionador para <Box component="span" sx={{ color: 'primary.main' }}>Redes Sociales</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Convierte tu imagen maestra a todos los formatos de Instagram, TikTok, YouTube, X y LinkedIn en un solo clic, con recorte centrado o fondo difuminado sin pérdida.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Image Upload & Format Selector */}
        <Grid item xs={12} lg={5}>
          {/* Upload Box */}
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
              <UploadFileIcon color="primary" /> 1. Imagen Fuente
            </Typography>

            <input
              id="social-file-input"
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
                id="social-dropzone"
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
                <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Arrastra tu fotografía aquí o haz clic para subir
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recomendado: alta resolución (mínimo 1920×1080 px)
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={sourceImage.url}
                    alt="Preview"
                    sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1.5 }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                      {sourceImage.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sourceImage.width} × {sourceImage.height} px
                    </Typography>
                  </Box>
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

            <Divider sx={{ my: 2.5 }} />

            {/* Framing / Fit Options */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon color="primary" /> 2. Modo de Encuadre
            </Typography>

            <RadioGroup
              value={fitMode}
              onChange={(e) => setFitMode(e.target.value as FitMode)}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  mb: 1,
                  borderRadius: 2,
                  borderColor: fitMode === 'cover' ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                  bgcolor: fitMode === 'cover' ? 'rgba(59, 130, 246, 0.06)' : 'transparent'
                }}
              >
                <FormControlLabel
                  value="cover"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Recorte Centrado (Cover)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Llena todo el espacio sin márgenes. Ideal para fotos de impacto.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  mb: 1,
                  borderRadius: 2,
                  borderColor: fitMode === 'blur' ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                  bgcolor: fitMode === 'blur' ? 'rgba(59, 130, 246, 0.06)' : 'transparent'
                }}
              >
                <FormControlLabel
                  value="blur"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Encuadre con Fondo Difuminado (Blur)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Muestra 100% de la foto y rellena los laterales con un desenfoque elegante.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  borderColor: fitMode === 'color' ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                  bgcolor: fitMode === 'color' ? 'rgba(59, 130, 246, 0.06)' : 'transparent'
                }}
              >
                <FormControlLabel
                  value="color"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Encuadre con Fondo Sólido
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Conserva la foto íntegra con barras laterales o superior/inferior.
                        </Typography>
                      </Box>
                      {fitMode === 'color' && (
                        <input
                          type="color"
                          value={fillColor}
                          onChange={(e) => setFillColor(e.target.value)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer',
                            background: 'none'
                          }}
                        />
                      )}
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>

            {/* Quality Slider */}
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Calidad de Compresión JPEG:
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                  {quality}%
                </Typography>
              </Box>
              <Slider
                value={quality}
                min={50}
                max={100}
                step={2}
                onChange={(_, val) => setQuality(val as number)}
                size="small"
              />
            </Box>

            {/* Master Export Button */}
            <Box sx={{ mt: 3 }}>
              <Button
                id="export-all-social-zip-button"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!sourceImage || selectedPresetIds.length === 0 || isProcessing}
                onClick={handleDownloadAllZip}
                startIcon={<ArchiveIcon />}
                sx={{ py: 1.5, fontWeight: 800 }}
              >
                {isProcessing ? 'Procesando formatos...' : `Descargar ${selectedPresetIds.length} Formatos en ZIP`}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Preset Grid Selection & Individual Download */}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShareIcon color="primary" /> Formatos para Exportar ({selectedPresetIds.length} de {SOCIAL_PRESETS.length})
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="text" onClick={selectRecommended}>
                  Recomendados
                </Button>
                <Button size="small" variant="text" onClick={selectAll}>
                  Todos
                </Button>
                <Button size="small" variant="text" color="error" onClick={selectNone}>
                  Deseleccionar
                </Button>
              </Box>
            </Box>

            <Grid container spacing={1.5}>
              {SOCIAL_PRESETS.map((preset) => {
                const isSelected = selectedPresetIds.includes(preset.id);

                return (
                  <Grid item xs={12} sm={6} key={preset.id}>
                    <Paper
                      variant="outlined"
                      onClick={() => togglePreset(preset.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        borderColor: isSelected ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                        bgcolor: isSelected ? 'rgba(59, 130, 246, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        '&:hover': {
                          borderColor: 'primary.light'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => togglePreset(preset.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                            {preset.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <span>{preset.platform}</span>
                            <span>•</span>
                            <span style={{ fontFamily: 'monospace' }}>{preset.width}×{preset.height} px</span>
                          </Typography>
                        </Box>
                      </Box>

                      {sourceImage && (
                        <Tooltip title="Descargar este formato individual">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSingle(preset);
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
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

export default SocialMediaResizer;
