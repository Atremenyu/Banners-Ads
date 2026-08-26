import React, { useState, useMemo } from 'react';
import AdPlaceholder, { LateralAds } from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  Chip, Snackbar, Alert, Slider, FormControl, InputLabel, Select, MenuItem, Tab, Tabs, Switch, FormControlLabel
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  TextFields as TextIcon,
  AutoAwesome as SparklesIcon
} from '@mui/icons-material';

interface ScaleRatio {
  name: string;
  value: number;
}

const ratios: ScaleRatio[] = [
  { name: 'Minor Second (1.067)', value: 1.067 },
  { name: 'Major Second (1.125)', value: 1.125 },
  { name: 'Minor Third (1.200)', value: 1.200 },
  { name: 'Major Third (1.250) - Estándar UI', value: 1.250 },
  { name: 'Perfect Fourth (1.333) - Recomendado Web', value: 1.333 },
  { name: 'Augmented Fourth (1.414)', value: 1.414 },
  { name: 'Perfect Fifth (1.500)', value: 1.500 },
  { name: 'Golden Ratio (1.618) - Alto Impacto', value: 1.618 },
];

const TypeScaleGenerator: React.FC = () => {
  const [baseSize, setBaseSize] = useState<number>(16);
  const [selectedRatio, setSelectedRatio] = useState<number>(1.333);
  const [sampleText, setSampleText] = useState('Diseño web ágil y adaptativo');
  const [isFluid, setIsFluid] = useState(true);
  
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Calculate sizes for H1 to Small (6 steps above base, 1 step below base)
  const sizes = useMemo(() => {
    const calc = (step: number) => Math.round(baseSize * Math.pow(selectedRatio, step) * 100) / 100;
    return {
      h1: calc(5),
      h2: calc(4),
      h3: calc(3),
      h4: calc(2),
      h5: calc(1),
      h6: calc(0), // Base
      small: calc(-1),
    };
  }, [baseSize, selectedRatio]);

  // CSS Root variables export
  const cssVariables = useMemo(() => {
    return `:root {
  /* Escala Tipográfica Basada en Ratio ${selectedRatio} */
  --font-size-base: ${baseSize}px;
  --font-size-h1: ${sizes.h1}px; /* ${Math.round((sizes.h1 / 16) * 100) / 100}rem */
  --font-size-h2: ${sizes.h2}px; /* ${Math.round((sizes.h2 / 16) * 100) / 100}rem */
  --font-size-h3: ${sizes.h3}px; /* ${Math.round((sizes.h3 / 16) * 100) / 100}rem */
  --font-size-h4: ${sizes.h4}px; /* ${Math.round((sizes.h4 / 16) * 100) / 100}rem */
  --font-size-h5: ${sizes.h5}px; /* ${Math.round((sizes.h5 / 16) * 100) / 100}rem */
  --font-size-h6: ${sizes.h6}px; /* ${Math.round((sizes.h6 / 16) * 100) / 100}rem */
  --font-size-sm: ${sizes.small}px;
}`;
  }, [baseSize, selectedRatio, sizes]);

  // Tailwind config export
  const tailwindConfig = useMemo(() => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'h1': ['${Math.round((sizes.h1 / 16) * 100) / 100}rem', { lineHeight: '1.2' }],
        'h2': ['${Math.round((sizes.h2 / 16) * 100) / 100}rem', { lineHeight: '1.25' }],
        'h3': ['${Math.round((sizes.h3 / 16) * 100) / 100}rem', { lineHeight: '1.3' }],
        'h4': ['${Math.round((sizes.h4 / 16) * 100) / 100}rem', { lineHeight: '1.35' }],
        'h5': ['${Math.round((sizes.h5 / 16) * 100) / 100}rem', { lineHeight: '1.4' }],
        'h6': ['${Math.round((sizes.h6 / 16) * 100) / 100}rem', { lineHeight: '1.45' }],
      }
    }
  }
}`;
  }, [sizes]);

  // Fluid CSS Clamp rules
  const fluidClampCss = useMemo(() => {
    // Calculates clamp(min, preferred, max)
    const clampRule = (maxPx: number) => {
      const minPx = Math.round(maxPx * 0.75);
      return `clamp(${minPx / 16}rem, 2.5vw + ${minPx / 32}rem, ${maxPx / 16}rem)`;
    };

    return `/* Tipografía Fluida CSS (Mobile to Desktop) */
h1 { font-size: ${clampRule(sizes.h1)}; }
h2 { font-size: ${clampRule(sizes.h2)}; }
h3 { font-size: ${clampRule(sizes.h3)}; }
h4 { font-size: ${clampRule(sizes.h4)}; }
h5 { font-size: ${clampRule(sizes.h5)}; }
h6 { font-size: ${clampRule(sizes.h6)}; }`;
  }, [sizes]);

  const handleCopy = () => {
    const text = activeCodeTab === 0 ? cssVariables : activeCodeTab === 1 ? tailwindConfig : fluidClampCss;
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Safe Lateral Ads */}
      <LateralAds />

      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          TypeScale & Fluid Typography Generator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Calcula escalas tipográficas armónicas para jerarquía visual y genera reglas de **tipografía fluida CSS `clamp()`** para diseño responsive sin esfuerzo.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} lg={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextIcon color="primary" /> Configuración de Escala
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Texto de Muestra"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                fullWidth
                size="small"
              />

              {/* Base Font Size */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Tamaño Base (Body / H6)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{baseSize}px</Typography>
                </Box>
                <Slider value={baseSize} min={12} max={20} onChange={(_, v) => setBaseSize(v as number)} size="small" />
              </Box>

              {/* Scale Ratio Selection */}
              <FormControl fullWidth size="small">
                <InputLabel>Proporción / Ratio Escalar</InputLabel>
                <Select value={selectedRatio} label="Proporción / Ratio Escalar" onChange={(e) => setSelectedRatio(Number(e.target.value))}>
                  {ratios.map((r, i) => (
                    <MenuItem key={i} value={r.value}>{r.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch checked={isFluid} onChange={(e) => setIsFluid(e.target.checked)} size="small" />}
                label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Modo Tipografía Fluida CSS Clamp()</Typography>}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Live Typographic Scale Preview */}
        <Grid item xs={12} lg={8}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#090d16', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>
              Jerarquía Visual Generada
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* H1 */}
              <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>H1 - Heading Level 1</Typography>
                  <Typography variant="caption" color="text.secondary">{sizes.h1}px / {Math.round((sizes.h1 / 16) * 100) / 100}rem</Typography>
                </Box>
                <Typography sx={{ fontSize: `${sizes.h1}px`, fontWeight: 800, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sampleText}
                </Typography>
              </Box>

              {/* H2 */}
              <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>H2 - Heading Level 2</Typography>
                  <Typography variant="caption" color="text.secondary">{sizes.h2}px / {Math.round((sizes.h2 / 16) * 100) / 100}rem</Typography>
                </Box>
                <Typography sx={{ fontSize: `${sizes.h2}px`, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sampleText}
                </Typography>
              </Box>

              {/* H3 */}
              <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>H3 - Heading Level 3</Typography>
                  <Typography variant="caption" color="text.secondary">{sizes.h3}px / {Math.round((sizes.h3 / 16) * 100) / 100}rem</Typography>
                </Box>
                <Typography sx={{ fontSize: `${sizes.h3}px`, fontWeight: 700, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sampleText}
                </Typography>
              </Box>

              {/* H4 */}
              <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>H4 - Heading Level 4</Typography>
                  <Typography variant="caption" color="text.secondary">{sizes.h4}px / {Math.round((sizes.h4 / 16) * 100) / 100}rem</Typography>
                </Box>
                <Typography sx={{ fontSize: `${sizes.h4}px`, fontWeight: 700, lineHeight: 1.3 }}>
                  {sampleText}
                </Typography>
              </Box>

              {/* Base / Body */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 800 }}>Body / Base Text</Typography>
                  <Typography variant="caption" color="text.secondary">{sizes.h6}px / 1rem</Typography>
                </Box>
                <Typography sx={{ fontSize: `${sizes.h6}px`, color: 'text.secondary' }}>
                  {sampleText} - Diseñar con una escala tipográfica matemática garantiza consistencia visual y legibilidad en todas las resoluciones.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Code Export */}
          <Paper variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs value={activeCodeTab} onChange={(_, val) => setActiveCodeTab(val)}>
                <Tab label="Variables CSS (:root)" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="Tailwind Config" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="CSS Fluid Clamp()" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
              </Tabs>

              <Button
                size="small"
                variant="contained"
                startIcon={copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                onClick={handleCopy}
                color={copied ? 'success' : 'primary'}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {copied ? '¡Copiado!' : 'Copiar Código'}
              </Button>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#060911', fontFamily: 'monospace', fontSize: '0.825rem', color: '#e2e8f0', overflowX: 'auto', maxHeight: 220 }}>
              <pre style={{ margin: 0 }}>
                {activeCodeTab === 0 ? cssVariables : activeCodeTab === 1 ? tailwindConfig : fluidClampCss}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Ad */}
      <Box sx={{ mt: 6 }}>
        <AdPlaceholder type="horizontal" label="Inferior" />
      </Box>

      {/* Toast */}
      <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">
          ¡Código copiado al portapapeles con éxito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TypeScaleGenerator;
