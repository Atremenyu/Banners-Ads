import React, { useState, useRef, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, Slider,
  TextField, Chip, Snackbar, Alert, Tooltip, IconButton, Switch,
  FormControlLabel, Divider, Card, CardContent
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Language as BrowserIcon,
  PhoneIphone as MobileIcon,
  Visibility as VisibilityIcon,
  Tune as TuneIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import JSZip from 'jszip';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';

interface IconSizeSpec {
  name: string;
  size: number;
  label: string;
  platform: string;
}

const ICON_SPECS: IconSizeSpec[] = [
  { name: 'favicon-16x16.png', size: 16, label: 'Favicon Clásico 16x16', platform: 'Navegadores Desktop' },
  { name: 'favicon-32x32.png', size: 32, label: 'Favicon Retina 32x32', platform: 'Pestañas de Navegador' },
  { name: 'favicon-48x48.png', size: 48, label: 'Favicon HD 48x48', platform: 'Marcadores de Navegador' },
  { name: 'apple-touch-icon.png', size: 180, label: 'Apple Touch Icon (180x180)', platform: 'iOS Pantalla de Inicio' },
  { name: 'android-chrome-192x192.png', size: 192, label: 'Android Chrome (192x192)', platform: 'Android & PWA' },
  { name: 'android-chrome-512x512.png', size: 512, label: 'Splash Screen (512x512)', platform: 'PWA Pantalla de Carga' },
];

// Helper to construct a valid Windows/Browser binary .ico containing 16x16 and 32x32 PNGs
async function createIcoBlob(png16Blob: Blob, png32Blob: Blob): Promise<Blob> {
  const buf16 = await png16Blob.arrayBuffer();
  const buf32 = await png32Blob.arrayBuffer();

  const numImages = 2;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirTotalSize = dirEntrySize * numImages;
  const offset1 = headerSize + dirTotalSize;
  const offset2 = offset1 + buf16.byteLength;

  const totalSize = offset2 + buf32.byteLength;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type 1 = ICO
  view.setUint16(4, numImages, true); // 2 images

  // Entry 1: 16x16
  view.setUint8(6, 16); // Width
  view.setUint8(7, 16); // Height
  view.setUint8(8, 0);  // Palette
  view.setUint8(9, 0);  // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, buf16.byteLength, true); // Size of data
  view.setUint32(18, offset1, true); // Offset

  // Entry 2: 32x32
  view.setUint8(22, 32); // Width
  view.setUint8(23, 32); // Height
  view.setUint8(24, 0);  // Palette
  view.setUint8(25, 0);  // Reserved
  view.setUint16(26, 1, true); // Color planes
  view.setUint16(28, 32, true); // Bits per pixel
  view.setUint32(30, buf32.byteLength, true); // Size of data
  view.setUint32(34, offset2, true); // Offset

  // Copy raw PNG bytes
  new Uint8Array(buffer, offset1, buf16.byteLength).set(new Uint8Array(buf16));
  new Uint8Array(buffer, offset2, buf32.byteLength).set(new Uint8Array(buf32));

  return new Blob([buffer], { type: 'image/x-icon' });
}

const FaviconGenerator: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<{
    file: File;
    url: string;
    width: number;
    height: number;
  } | null>(null);

  const [appName, setAppName] = useState<string>('Mi Aplicación');
  const [paddingPercent, setPaddingPercent] = useState<number>(5);
  const [useCustomBg, setUseCustomBg] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'El archivo seleccionado debe ser una imagen', severity: 'error' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSourceImage({
        file,
        url: objectUrl,
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      setToast({ open: true, message: `Logo cargado con éxito (${img.naturalWidth}×${img.naturalHeight} px)`, severity: 'success' });
    };
    img.onerror = () => {
      setToast({ open: true, message: 'No se pudo decodificar la imagen', severity: 'error' });
    };
    img.src = objectUrl;
  };

  const renderIconToBlob = (size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!sourceImage) return reject(new Error('Sin imagen cargada'));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));

        if (useCustomBg) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
        }

        const paddingPx = (size * paddingPercent) / 100;
        const targetW = size - paddingPx * 2;
        const targetH = size - paddingPx * 2;

        // Proportional fit within the square canvas
        const aspect = img.naturalWidth / img.naturalHeight;
        let drawW = targetW;
        let drawH = targetH;
        if (aspect > 1) {
          drawH = targetW / aspect;
        } else {
          drawW = targetH * aspect;
        }

        const drawX = paddingPx + (targetW - drawW) / 2;
        const drawY = paddingPx + (targetH - drawH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Error al generar blob'));
        }, 'image/png');
      };
      img.src = sourceImage.url;
    });
  };

  const generateZipPackage = async () => {
    if (!sourceImage) return;
    setIsGenerating(true);

    try {
      const zip = new JSZip();

      // Generate all PNG sizes
      const blobs: Record<string, Blob> = {};
      for (const spec of ICON_SPECS) {
        const blob = await renderIconToBlob(spec.size);
        blobs[spec.name] = blob;
        zip.file(spec.name, blob);
      }

      // Generate binary favicon.ico combining 16x16 and 32x32
      const icoBlob = await createIcoBlob(blobs['favicon-16x16.png'], blobs['favicon-32x32.png']);
      zip.file('favicon.ico', icoBlob);

      // Generate site.webmanifest
      const manifestObj = {
        name: appName,
        short_name: appName,
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        theme_color: useCustomBg ? bgColor : '#ffffff',
        background_color: useCustomBg ? bgColor : '#ffffff',
        display: 'standalone'
      };
      zip.file('site.webmanifest', JSON.stringify(manifestObj, null, 2));

      // Generate HTML integration snippet
      const htmlSnippet = `<!-- Favicon & App Icons Generados por DesignKit Studio -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${useCustomBg ? bgColor : '#ffffff'}">`;
      zip.file('instrucciones_html.txt', htmlSnippet);

      // Trigger ZIP download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favicon_package_${appName.toLowerCase().replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({ open: true, message: 'Paquete completo de Favicons descargado en ZIP', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Error al compilar el paquete de iconos', severity: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHtmlSnippet = () => {
    const htmlSnippet = `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${useCustomBg ? bgColor : '#ffffff'}">`;

    navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
    setToast({ open: true, message: 'Código HTML copiado al portapapeles', severity: 'success' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <LateralAds />

      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
          Generador de <Box component="span" sx={{ color: 'primary.main' }}>Favicons & App Icons</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto' }}>
          Crea el paquete completo de iconos web para navegadores de escritorio, iOS, Android y Progressive Web Apps (PWA) a partir de una sola imagen.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Main Workspace */}
      <Grid container spacing={3}>
        {/* Left Column: Upload & Controls */}
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
              <UploadFileIcon color="primary" /> 1. Cargar Logotipo o Imagen Maestra
            </Typography>

            <input
              id="favicon-source-input"
              ref={fileInputRef}
              type="file"
              accept="image/*,.svg,.png,.jpg,.jpeg,.webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelected(file);
              }}
            />

            {!sourceImage ? (
              <Paper
                variant="outlined"
                id="favicon-dropzone"
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
                  if (file) handleImageSelected(file);
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
                <UploadFileIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Arrastra tu logotipo aquí o haz clic para subir
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recomendado: archivo PNG transparente o SVG de al menos 512×512 px
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={sourceImage.url}
                    alt="Logo cargado"
                    sx={{
                      width: 48,
                      height: 48,
                      objectFit: 'contain',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 1.5,
                      p: 0.5
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {sourceImage.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sourceImage.width} × {sourceImage.height} px ({((sourceImage.file.size) / 1024).toFixed(1)} KB)
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

            <Divider sx={{ my: 3 }} />

            {/* Customization Controls */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon color="primary" /> 2. Ajustes de Generación
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre de la Aplicación"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  helperText="Para site.webmanifest y accesos directos"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ px: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Margen Interno (Padding):
                    </Typography>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
                      {paddingPercent}%
                    </Typography>
                  </Box>
                  <Slider
                    value={paddingPercent}
                    min={0}
                    max={25}
                    step={1}
                    onChange={(_, val) => setPaddingPercent(val as number)}
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useCustomBg}
                        onChange={(e) => setUseCustomBg(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Fondo de color sólido (útil para logos transparentes en iOS/Android)
                      </Typography>
                    }
                  />

                  {useCustomBg && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {bgColor.toUpperCase()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3 }}>
              <Button
                id="generate-favicon-zip-button"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!sourceImage || isGenerating}
                onClick={generateZipPackage}
                startIcon={<ArchiveIcon />}
                sx={{ py: 1.5, fontWeight: 800 }}
              >
                {isGenerating ? 'Generando Iconos...' : 'Descargar Paquete Completo (.zip)'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Previews & HTML Code */}
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
              <VisibilityIcon color="primary" /> Previsualización en Tiempo Real
            </Typography>

            {/* Desktop Browser Tab Preview */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                Pestaña de Navegador Web:
              </Typography>
              <Box
                sx={{
                  bgcolor: '#090d16',
                  borderRadius: 2,
                  p: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#192438',
                    px: 2,
                    py: 0.8,
                    borderRadius: 1.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.2,
                    maxWidth: 260
                  }}
                >
                  {sourceImage ? (
                    <Box
                      component="img"
                      src={sourceImage.url}
                      alt="Favicon tab"
                      sx={{
                        width: 16,
                        height: 16,
                        objectFit: 'contain',
                        bgcolor: useCustomBg ? bgColor : 'transparent',
                        borderRadius: 0.5
                      }}
                    />
                  ) : (
                    <BrowserIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  )}
                  <Typography variant="caption" noWrap sx={{ fontWeight: 600, color: '#f3f4f6' }}>
                    {appName}
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary', fontSize: '0.7rem' }}>
                    ✕
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Mobile Home Screen Preview */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                Pantalla de Inicio Móvil (iOS / Android PWA):
              </Typography>
              <Box
                sx={{
                  bgcolor: '#090d16',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                {/* iOS Squircle */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '14px',
                      bgcolor: useCustomBg ? bgColor : '#192438',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      p: `${paddingPercent}%`,
                      mb: 0.5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    {sourceImage ? (
                      <Box
                        component="img"
                        src={sourceImage.url}
                        alt="iOS Icon"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <MobileIcon sx={{ color: 'text.secondary' }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    iOS (180px)
                  </Typography>
                </Box>

                {/* Android Adaptive Circle */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: useCustomBg ? bgColor : '#192438',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      p: `${paddingPercent}%`,
                      mb: 0.5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    {sourceImage ? (
                      <Box
                        component="img"
                        src={sourceImage.url}
                        alt="Android Icon"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <MobileIcon sx={{ color: 'text.secondary' }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    Android (192px)
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* HTML Integration Snippet */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CodeIcon fontSize="small" color="primary" /> Código HTML para tu &lt;head&gt;:
                </Typography>
                <Button
                  id="copy-html-tags-button"
                  size="small"
                  variant="outlined"
                  onClick={copyHtmlSnippet}
                  startIcon={copiedHtml ? <CheckIcon color="success" /> : <CopyIcon />}
                  sx={{ textTransform: 'none', py: 0.2 }}
                >
                  {copiedHtml ? 'Copiado' : 'Copiar Etiquetas'}
                </Button>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: '#080c14',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  borderRadius: 2,
                  color: '#93c5fd',
                  overflowX: 'auto'
                }}
              >
                {`<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`}
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Bottom Specs Table */}
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Archivos incluidos en el paquete ZIP descargable
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    favicon.ico
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Archivo binario multi-resolución (16x16 y 32x32) compatible con navegadores legacy y favoritos.
                  </Typography>
                </Box>
              </Grid>

              {ICON_SPECS.slice(0, 3).map((spec) => (
                <Grid item xs={12} sm={6} md={3} key={spec.name}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {spec.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {spec.label} para {spec.platform}.
                    </Typography>
                  </Box>
                </Grid>
              ))}

              {ICON_SPECS.slice(3).map((spec) => (
                <Grid item xs={12} sm={6} md={3} key={spec.name}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {spec.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {spec.label} ({spec.platform}).
                    </Typography>
                  </Box>
                </Grid>
              ))}

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>
                    site.webmanifest
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Manifiesto JSON estandarizado para Progressive Web Apps (PWA) e instalación en móviles.
                  </Typography>
                </Box>
              </Grid>
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

export default FaviconGenerator;
