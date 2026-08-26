import React, { useState, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  IconButton, Tooltip, Chip, Snackbar, Alert, Card, CardContent, Divider,
  Slider, Switch, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Tab, Tabs
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  AutoAwesome as SparklesIcon,
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  Brush as BrushIcon,
  TouchApp as TouchIcon,
  RestartAlt as ResetIcon,
  Send as SendIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Download as DownloadIcon,
  ArrowForward as ArrowRightIcon
} from '@mui/icons-material';

type ButtonVariant = 'solid' | 'outline' | 'soft' | 'gradient' | 'glass' | 'neon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'none' | 'left' | 'right' | 'only';

interface PresetButton {
  name: string;
  variant: ButtonVariant;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  size: ButtonSize;
  radius: number;
  hasShadow: boolean;
  hasGlow: boolean;
  hoverEffect: 'lift' | 'scale' | 'glow' | 'shimmer';
  icon: string;
}

const presets: PresetButton[] = [
  {
    name: 'Primary Modern',
    variant: 'solid',
    label: 'Empieza Gratis',
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    textColor: '#ffffff',
    size: 'md',
    radius: 8,
    hasShadow: true,
    hasGlow: false,
    hoverEffect: 'lift',
    icon: 'arrow'
  },
  {
    name: 'Cyber Neon',
    variant: 'neon',
    label: 'Lanzar App',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    textColor: '#000000',
    size: 'lg',
    radius: 12,
    hasShadow: true,
    hasGlow: true,
    hoverEffect: 'glow',
    icon: 'sparkles'
  },
  {
    name: 'Sunset Gradient',
    variant: 'gradient',
    label: 'Suscribirse Ahora',
    primaryColor: '#ec4899',
    secondaryColor: '#f97316',
    textColor: '#ffffff',
    size: 'lg',
    radius: 99,
    hasShadow: true,
    hasGlow: false,
    hoverEffect: 'scale',
    icon: 'star'
  },
  {
    name: 'Glassmorphism',
    variant: 'glass',
    label: 'Ver Detalles',
    primaryColor: '#ffffff',
    secondaryColor: '#ffffff',
    textColor: '#ffffff',
    size: 'md',
    radius: 16,
    hasShadow: false,
    hasGlow: false,
    hoverEffect: 'lift',
    icon: 'arrow'
  },
  {
    name: 'Soft Badge CTA',
    variant: 'soft',
    label: 'Añadir al Carrito',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    textColor: '#059669',
    size: 'md',
    radius: 10,
    hasShadow: false,
    hasGlow: false,
    hoverEffect: 'lift',
    icon: 'cart'
  }
];

const sizeMap = {
  sm: { px: '14px', py: '6px', font: '0.85rem', icon: 16 },
  md: { px: '20px', py: '10px', font: '0.95rem', icon: 18 },
  lg: { px: '28px', py: '14px', font: '1.05rem', icon: 20 },
  xl: { px: '36px', py: '18px', font: '1.15rem', icon: 22 },
};

const ButtonForge: React.FC = () => {
  const [label, setLabel] = useState('Obtener Acceso');
  const [variant, setVariant] = useState<ButtonVariant>('gradient');
  const [size, setSize] = useState<ButtonSize>('md');
  const [radius, setRadius] = useState<number>(10);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [hasShadow, setHasShadow] = useState(true);
  const [hasGlow, setHasGlow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [iconType, setIconType] = useState<string>('arrow');
  const [iconPosition, setIconPosition] = useState<IconPosition>('right');
  const [hoverEffect, setHoverEffect] = useState<'lift' | 'scale' | 'glow' | 'shimmer'>('lift');
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'grid' | 'gradient'>('dark');
  
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const applyPreset = (preset: PresetButton) => {
    setVariant(preset.variant);
    setLabel(preset.label);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setTextColor(preset.textColor);
    setSize(preset.size);
    setRadius(preset.radius);
    setHasShadow(preset.hasShadow);
    setHasGlow(preset.hasGlow);
    setHoverEffect(preset.hoverEffect);
    setIconType(preset.icon);
  };

  const renderIcon = (type: string, sizePx: number) => {
    switch (type) {
      case 'arrow': return <ArrowRightIcon sx={{ fontSize: sizePx }} />;
      case 'sparkles': return <SparklesIcon sx={{ fontSize: sizePx }} />;
      case 'send': return <SendIcon sx={{ fontSize: sizePx }} />;
      case 'star': return <StarIcon sx={{ fontSize: sizePx }} />;
      case 'cart': return <CartIcon sx={{ fontSize: sizePx }} />;
      case 'download': return <DownloadIcon sx={{ fontSize: sizePx }} />;
      default: return null;
    }
  };

  // Inline CSS generator
  const generatedStyles = useMemo(() => {
    const s = sizeMap[size];
    let bg = primaryColor;
    let border = 'none';
    let color = textColor;
    let shadow = 'none';
    let backdrop = 'none';

    if (variant === 'gradient') {
      bg = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    } else if (variant === 'outline') {
      bg = 'transparent';
      border = `2px solid ${primaryColor}`;
      color = primaryColor;
    } else if (variant === 'soft') {
      bg = `${primaryColor}1a`; // 10% opacity
      color = primaryColor;
    } else if (variant === 'glass') {
      bg = 'rgba(255, 255, 255, 0.12)';
      border = '1px solid rgba(255, 255, 255, 0.25)';
      color = '#ffffff';
      backdrop = 'blur(12px)';
    } else if (variant === 'neon') {
      bg = primaryColor;
      color = textColor;
      if (hasGlow) {
        shadow = `0 0 20px ${primaryColor}aa, 0 0 40px ${primaryColor}44`;
      }
    }

    if (hasShadow && variant !== 'neon') {
      shadow = `0 10px 25px -5px ${primaryColor}66, 0 8px 10px -6px ${primaryColor}44`;
    }

    return {
      padding: `${s.py} ${s.px}`,
      fontSize: s.font,
      borderRadius: `${radius}px`,
      background: bg,
      border: border,
      color: color,
      boxShadow: shadow,
      backdropFilter: backdrop,
      WebkitBackdropFilter: backdrop
    };
  }, [variant, size, radius, primaryColor, secondaryColor, textColor, hasShadow, hasGlow]);

  // Code snippets
  const tailwindClasses = useMemo(() => {
    const s = size === 'sm' ? 'px-3.5 py-1.5 text-xs' : size === 'md' ? 'px-5 py-2.5 text-sm' : size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-9 py-4.5 text-lg';
    let rounded = `rounded-[${radius}px]`;
    if (radius === 99) rounded = 'rounded-full';
    if (radius === 0) rounded = 'rounded-none';

    let bg = `bg-[${primaryColor}]`;
    if (variant === 'gradient') bg = `bg-gradient-to-r from-[${primaryColor}] to-[${secondaryColor}]`;
    if (variant === 'outline') bg = `bg-transparent border-2 border-[${primaryColor}] text-[${primaryColor}]`;
    if (variant === 'soft') bg = `bg-[${primaryColor}]/10 text-[${primaryColor}]`;
    if (variant === 'glass') bg = `bg-white/10 backdrop-blur-md border border-white/20 text-white`;

    let effectClass = '';
    if (hoverEffect === 'lift') effectClass = 'hover:-translate-y-0.5 transition-transform duration-200';
    if (hoverEffect === 'scale') effectClass = 'hover:scale-105 transition-transform duration-200';
    if (hoverEffect === 'glow') effectClass = `hover:shadow-[0_0_25px_${primaryColor}] transition-shadow duration-300`;

    return `inline-flex items-center justify-center gap-2 font-semibold ${s} ${rounded} ${bg} ${effectClass} active:opacity-90 disabled:opacity-50 cursor-pointer`;
  }, [size, radius, primaryColor, secondaryColor, variant, hoverEffect]);

  const htmlCssCode = useMemo(() => {
    return `<button class="btn-custom">
  ${iconPosition === 'left' ? `<span class="icon">${iconType}</span> ` : ''}${label}${iconPosition === 'right' ? ` <span class="icon">${iconType}</span>` : ''}
</button>

<style>
.btn-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.25s ease;
  padding: ${generatedStyles.padding};
  font-size: ${generatedStyles.fontSize};
  border-radius: ${generatedStyles.borderRadius};
  background: ${generatedStyles.background};
  border: ${generatedStyles.border};
  color: ${generatedStyles.color};
  box-shadow: ${generatedStyles.boxShadow};
  ${variant === 'glass' ? `backdrop-filter: ${generatedStyles.backdropFilter};` : ''}
}

.btn-custom:hover {
  ${hoverEffect === 'lift' ? 'transform: translateY(-2px);' : ''}
  ${hoverEffect === 'scale' ? 'transform: scale(1.04);' : ''}
  ${hoverEffect === 'glow' ? `box-shadow: 0 0 30px ${primaryColor};` : ''}
}

.btn-custom:active {
  transform: translateY(0) scale(0.98);
}
</style>`;
  }, [label, iconPosition, iconType, generatedStyles, variant, hoverEffect, primaryColor]);

  const reactCode = useMemo(() => {
    return `import React from 'react';

export const CustomButton = ({ label = "${label}", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="${tailwindClasses}"
    >
      ${label}
    </button>
  );
};`;
  }, [label, tailwindClasses]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Title */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          Button & Badge Forge
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Diseña botones e insignias interactivas profesionales con efectos hover, animaciones y exportación directa a Tailwind CSS, HTML/CSS y React TSX.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Presets Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
          Presets de Estilo Rápidos
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {presets.map((p, idx) => (
            <Chip
              key={idx}
              label={p.name}
              onClick={() => applyPreset(p)}
              icon={<BrushIcon fontSize="small" />}
              variant="outlined"
              color="primary"
              clickable
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Controls Panel */}
        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TouchIcon color="primary" /> Configuración de Botón
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Text Label */}
              <TextField
                label="Texto del Botón"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
              />

              {/* Variant & Size */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estilo / Estructura</InputLabel>
                    <Select value={variant} label="Estilo / Estructura" onChange={(e) => setVariant(e.target.value as ButtonVariant)}>
                      <MenuItem value="solid">Sólido</MenuItem>
                      <MenuItem value="gradient">Gradiente Moderno</MenuItem>
                      <MenuItem value="outline">Delineado (Outline)</MenuItem>
                      <MenuItem value="soft">Suave (Soft)</MenuItem>
                      <MenuItem value="glass">Glassmorphism</MenuItem>
                      <MenuItem value="neon">Neón / Cyber</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tamaño</InputLabel>
                    <Select value={size} label="Tamaño" onChange={(e) => setSize(e.target.value as ButtonSize)}>
                      <MenuItem value="sm">Pequeño (SM)</MenuItem>
                      <MenuItem value="md">Mediano (MD)</MenuItem>
                      <MenuItem value="lg">Grande (LG)</MenuItem>
                      <MenuItem value="xl">Extra Grande (XL)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Colors */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Color Primario
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                    <TextField size="small" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} fullWidth />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Color Secundario (Gradiente)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                    <TextField size="small" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} fullWidth />
                  </Box>
                </Grid>
              </Grid>

              {/* Radius slider */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Radio de Esquina (Border Radius)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {radius === 99 ? 'Pill (Redondo)' : `${radius}px`}
                  </Typography>
                </Box>
                <Slider
                  value={radius}
                  min={0}
                  max={32}
                  onChange={(_, val) => setRadius(val as number)}
                  size="small"
                />
              </Box>

              {/* Icon Selection & Position */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Icono</InputLabel>
                    <Select value={iconType} label="Icono" onChange={(e) => setIconType(e.target.value)}>
                      <MenuItem value="none">Sin Icono</MenuItem>
                      <MenuItem value="arrow">Flecha derechas</MenuItem>
                      <MenuItem value="sparkles">Brillos IA</MenuItem>
                      <MenuItem value="send">Enviar</MenuItem>
                      <MenuItem value="star">Estrella</MenuItem>
                      <MenuItem value="cart">Carrito</MenuItem>
                      <MenuItem value="download">Descargar</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Posición Icono</InputLabel>
                    <Select value={iconPosition} label="Posición Icono" onChange={(e) => setIconPosition(e.target.value as IconPosition)}>
                      <MenuItem value="left">Izquierda</MenuItem>
                      <MenuItem value="right">Derecha</MenuItem>
                      <MenuItem value="none">Oculto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Hover Effect */}
              <FormControl fullWidth size="small">
                <InputLabel>Efecto Hover (Interacción)</InputLabel>
                <Select value={hoverEffect} label="Efecto Hover (Interacción)" onChange={(e) => setHoverEffect(e.target.value as 'lift' | 'scale' | 'glow' | 'shimmer')}>
                  <MenuItem value="lift">Elevación (+TranslateY)</MenuItem>
                  <MenuItem value="scale">Escala (+Zoom)</MenuItem>
                  <MenuItem value="glow">Resplandor (Glow Shadow)</MenuItem>
                </Select>
              </FormControl>

              {/* Toggles */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={<Switch checked={hasShadow} onChange={(e) => setHasShadow(e.target.checked)} size="small" />}
                  label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Sombra Profunda</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />}
                  label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Estado Deshabilitado</Typography>}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Live Preview & Code Export */}
        <Grid item xs={12} lg={7}>
          {/* Live Stage */}
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 280,
              bgcolor: previewBg === 'dark' ? '#090d16' : previewBg === 'light' ? '#f8fafc' : previewBg === 'gradient' ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : '#090d16',
              backgroundImage: previewBg === 'grid' ? 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)' : 'none',
              backgroundSize: previewBg === 'grid' ? '16px 16px' : 'auto',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              transition: 'background 0.3s ease'
            }}
          >
            {/* Background Switcher Controls */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
              <Chip
                label="Oscuro"
                size="small"
                clickable
                color={previewBg === 'dark' ? 'primary' : 'default'}
                onClick={() => setPreviewBg('dark')}
              />
              <Chip
                label="Claro"
                size="small"
                clickable
                color={previewBg === 'light' ? 'primary' : 'default'}
                onClick={() => setPreviewBg('light')}
              />
              <Chip
                label="Malla"
                size="small"
                clickable
                color={previewBg === 'grid' ? 'primary' : 'default'}
                onClick={() => setPreviewBg('grid')}
              />
            </Box>

            {/* Interactive Render Button */}
            <Box sx={{ textAlign: 'center' }}>
              <button
                disabled={isDisabled}
                onClick={() => setClickCount(prev => prev + 1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: 600,
                  border: generatedStyles.border,
                  padding: generatedStyles.padding,
                  fontSize: generatedStyles.fontSize,
                  borderRadius: generatedStyles.borderRadius,
                  background: generatedStyles.background,
                  color: generatedStyles.color,
                  boxShadow: generatedStyles.boxShadow,
                  backdropFilter: generatedStyles.backdropFilter,
                  WebkitBackdropFilter: generatedStyles.WebkitBackdropFilter,
                }}
                onMouseEnter={(e) => {
                  if (isDisabled) return;
                  if (hoverEffect === 'lift') e.currentTarget.style.transform = 'translateY(-3px)';
                  if (hoverEffect === 'scale') e.currentTarget.style.transform = 'scale(1.05)';
                  if (hoverEffect === 'glow') e.currentTarget.style.boxShadow = `0 0 30px ${primaryColor}`;
                }}
                onMouseLeave={(e) => {
                  if (isDisabled) return;
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = generatedStyles.boxShadow;
                }}
                onMouseDown={(e) => {
                  if (isDisabled) return;
                  e.currentTarget.style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  if (isDisabled) return;
                  e.currentTarget.style.transform = hoverEffect === 'scale' ? 'scale(1.05)' : 'translateY(-3px)';
                }}
              >
                {iconPosition === 'left' && iconType !== 'none' && renderIcon(iconType, sizeMap[size].icon)}
                <span>{label}</span>
                {iconPosition === 'right' && iconType !== 'none' && renderIcon(iconType, sizeMap[size].icon)}
              </button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
                ¡Haz clic en el botón para probar la interacción! (Clicks: {clickCount})
              </Typography>
            </Box>
          </Paper>

          {/* Code Export Tabs */}
          <Paper variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs value={activeCodeTab} onChange={(_, val) => setActiveCodeTab(val)}>
                <Tab label="Tailwind CSS" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="HTML + CSS" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="React / TSX" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
              </Tabs>

              <Button
                size="small"
                variant="contained"
                startIcon={copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                onClick={() => handleCopy(activeCodeTab === 0 ? tailwindClasses : activeCodeTab === 1 ? htmlCssCode : reactCode)}
                color={copied ? 'success' : 'primary'}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {copied ? '¡Copiado!' : 'Copiar Código'}
              </Button>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#060911', fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', overflowX: 'auto', maxHeight: 260 }}>
              <pre style={{ margin: 0 }}>
                {activeCodeTab === 0 && tailwindClasses}
                {activeCodeTab === 1 && htmlCssCode}
                {activeCodeTab === 2 && reactCode}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Ad */}
      <Box sx={{ mt: 6 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Notification Toast */}
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">
          ¡Código copiado al portapapeles con éxito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ButtonForge;
