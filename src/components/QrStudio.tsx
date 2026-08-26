import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import QRCode from 'qrcode';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  IconButton, Chip, Snackbar, Alert, Card, CardContent, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, Slider
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
  WhatsApp as WhatsAppIcon,
  Wifi as WifiIcon,
  TextFields as TextFieldsIcon,
  Colorize as ColorizeIcon,
  Tune as TuneIcon,
  AutoAwesome as MagicIcon
} from '@mui/icons-material';

const QrStudio = () => {
  const [activeTab, setActiveTab] = useState<number>(0); // 0: URL, 1: Text, 2: WhatsApp, 3: WiFi

  // Input states
  const [urlInput, setUrlInput] = useState<string>('https://misitio.com');
  const [textInput, setTextInput] = useState<string>('Hola, escanea este código QR');
  const [waPhone, setWaPhone] = useState<string>('5215512345678');
  const [waMessage, setWaMessage] = useState<string>('Hola, quisiera más información.');
  const [wifiSsid, setWifiSsid] = useState<string>('MiRedWiFi');
  const [wifiPass, setWifiPass] = useState<string>('clave1234');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');

  // QR Styling states
  const [fgColor, setFgColor] = useState<string>('#90CAF9');
  const [bgColor, setBgColor] = useState<string>('#0F172A');
  const [qrSize, setQrSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(2);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Get raw payload string based on current tab
  const getPayload = useCallback((): string => {
    switch (activeTab) {
      case 0: {
        let u = urlInput.trim();
        if (u && !/^https?:\/\//i.test(u)) {
          u = 'https://' + u;
        }
        return u || 'https://ejemplo.com';
      }
      case 1: {
        return textInput || 'Texto de muestra';
      }
      case 2: {
        const cleanPhone = waPhone.replace(/[^\d]/g, '');
        const encodedMsg = encodeURIComponent(waMessage);
        return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      }
      case 3: {
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPass};;`;
      }
      default: {
        return 'https://ejemplo.com';
      }
    }
  }, [activeTab, urlInput, textInput, waPhone, waMessage, wifiSsid, wifiPass, wifiEncryption]);

  // Generate QR code whenever payload or styling changes
  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    const opts: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: errorLevel,
      width: qrSize,
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor
      }
    };

    // PNG Data URL
    QRCode.toDataURL(payload, opts, (err, url) => {
      if (!err && url) {
        setQrDataUrl(url);
      }
    });

    // SVG String
    QRCode.toString(payload, { ...opts, type: 'svg' }, (err, svg) => {
      if (!err && svg) {
        setQrSvgString(svg);
      }
    });
  }, [getPayload, fgColor, bgColor, qrSize, margin, errorLevel]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `codigo-qr-${Date.now()}.png`;
    link.click();
    setToast({ open: true, message: '¡Código QR descargado en PNG!' });
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codigo-qr-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    setToast({ open: true, message: '¡Código QR descargado en SVG vectorial!' });
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setToast({ open: true, message: '¡Imagen QR copiada al portapapeles!' });
    } catch {
      navigator.clipboard.writeText(getPayload());
      setToast({ open: true, message: 'Enlace copiado al portapapeles' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          QR<Box component="span" sx={{ color: 'primary.main' }}>Studio</Box> — Generador de Códigos QR
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Crea y personaliza códigos QR en alta resolución para URLs, mensajes de WhatsApp, redes Wi-Fi y textos publicitarios.
        </Typography>

        {/* Anuncio Horizontal Superior */}
        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Input Form & Styling */}
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
            {/* Input Type Tabs */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MagicIcon fontSize="small" /> 1. Contenido del Código QR
            </Typography>

            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<LinkIcon />} iconPosition="start" label="Sitio Web (URL)" sx={{ fontWeight: 700 }} />
              <Tab icon={<TextFieldsIcon />} iconPosition="start" label="Texto Libre" sx={{ fontWeight: 700 }} />
              <Tab icon={<WhatsAppIcon />} iconPosition="start" label="WhatsApp" sx={{ fontWeight: 700 }} />
              <Tab icon={<WifiIcon />} iconPosition="start" label="Red Wi-Fi" sx={{ fontWeight: 700 }} />
            </Tabs>

            {/* TAB 0: URL */}
            {activeTab === 0 && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Enlace o URL de Destino"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://tu-empresa.com/promo"
                  helperText="Redirige a tus clientes directamente a tu sitio web o landing page"
                />
              </Box>
            )}

            {/* TAB 1: Text */}
            {activeTab === 1 && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Texto o Mensaje Promocional"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Escribe el texto que aparecerá al escanear..."
                />
              </Box>
            )}

            {/* TAB 2: WhatsApp */}
            {activeTab === 2 && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número Telefónico (Con código de país)"
                    value={waPhone}
                    onChange={e => setWaPhone(e.target.value)}
                    placeholder="ej. 5215512345678"
                    helperText="Formato internacional sin el signo +"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mensaje Predeterminado"
                    value={waMessage}
                    onChange={e => setWaMessage(e.target.value)}
                    placeholder="Hola, quisiera consultar precios"
                  />
                </Grid>
              </Grid>
            )}

            {/* TAB 3: WiFi */}
            {activeTab === 3 && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Nombre de la Red (SSID)"
                    value={wifiSsid}
                    onChange={e => setWifiSsid(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    value={wifiPass}
                    onChange={e => setWifiPass(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Cifrado</InputLabel>
                    <Select
                      value={wifiEncryption}
                      label="Cifrado"
                      onChange={e => setWifiEncryption(e.target.value)}
                    >
                      <MenuItem value="WPA">WPA / WPA2</MenuItem>
                      <MenuItem value="WEP">WEP</MenuItem>
                      <MenuItem value="nopass">Abierta (Sin clave)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {/* Styling Controls */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon fontSize="small" /> 2. Personalización Visual del QR
            </Typography>

            <Grid container spacing={2}>
              {/* Foreground Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  Color del Código (Módulos)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    style={{ width: 44, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    fullWidth
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                  />
                </Box>
              </Grid>

              {/* Background Color */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  Color del Fondo
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    style={{ width: 44, height: 44, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    fullWidth
                    inputProps={{ style: { fontFamily: 'monospace' } }}
                  />
                </Box>
              </Grid>

              {/* Size Slider */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Tamaño de Imagen ({qrSize} px)
                </Typography>
                <Slider
                  value={qrSize}
                  min={150}
                  max={600}
                  step={10}
                  onChange={(_, val) => setQrSize(val as number)}
                  valueLabelDisplay="auto"
                />
              </Grid>

              {/* Error Correction Level */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Nivel de Corrección de Errores</InputLabel>
                  <Select
                    value={errorLevel}
                    label="Nivel de Corrección de Errores"
                    onChange={e => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  >
                    <MenuItem value="L">L - Bajo (7% recuperable)</MenuItem>
                    <MenuItem value="M">M - Medio (15% recuperable)</MenuItem>
                    <MenuItem value="Q">Q - Cuartil (25% recuperable)</MenuItem>
                    <MenuItem value="H">H - Alto (30% recuperable)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Preview & Download */}
        <Grid item xs={12} lg={5}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCodeIcon color="primary" /> Vista Previa del Código QR
            </Typography>

            {/* QR Canvas Box */}
            <Box
              sx={{
                p: 3,
                bgcolor: bgColor,
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {qrDataUrl && (
                <Box
                  component="img"
                  src={qrDataUrl}
                  alt="Código QR Generado"
                  sx={{
                    width: Math.min(260, qrSize),
                    height: Math.min(260, qrSize),
                    objectFit: 'contain'
                  }}
                />
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPng}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                Descargar PNG (Alta Res)
              </Button>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadSvg}
                  >
                    SVG Vectorial
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CopyIcon />}
                    onClick={handleCopyImage}
                  >
                    Copiar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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

export default QrStudio;
