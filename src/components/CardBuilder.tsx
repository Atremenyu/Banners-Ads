import React, { useState, useMemo } from 'react';
import AdPlaceholder from './AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  IconButton, Tooltip, Chip, Snackbar, Alert, Card, CardContent, Divider,
  Slider, Switch, FormControlLabel, Select, MenuItem, FormControl, Tab, Tabs
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  ViewCarousel as CardIcon,
  Star as StarIcon,
  ShoppingBag as CartIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  AttachMoney as MoneyIcon,
  Image as ImageIcon
} from '@mui/icons-material';

type CardType = 'product' | 'profile' | 'pricing' | 'article';

const CardBuilder: React.FC = () => {
  const [cardType, setCardType] = useState<CardType>('product');
  const [title, setTitle] = useState('Audífonos Wireless Pro');
  const [description, setDescription] = useState('Cancelación de ruido activa, batería de 40 horas y sonido de alta fidelidad.');
  const [badgeText, setBadgeText] = useState('Nuevo');
  const [priceText, setPriceText] = useState('$149.99');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
  const [radius, setRadius] = useState<number>(16);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [hasGlass, setHasGlass] = useState(false);
  const [hasBorder, setHasBorder] = useState(true);
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'grid'>('dark');
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Switch presets when card type changes
  const handleCardTypeChange = (type: CardType) => {
    setCardType(type);
    if (type === 'product') {
      setTitle('Audífonos Wireless Pro');
      setDescription('Cancelación de ruido activa, batería de 40 horas y sonido de alta fidelidad.');
      setBadgeText('20% OFF');
      setPriceText('$149.99');
      setImageUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
    } else if (type === 'profile') {
      setTitle('Sofía Rodríguez');
      setDescription('Senior Frontend Engineer & Designer UX. Apasionada por construir experiencias web veloces.');
      setBadgeText('Disponible para Proyectos');
      setPriceText('Lead Dev');
      setImageUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80');
    } else if (type === 'pricing') {
      setTitle('Plan Pro Business');
      setDescription('Ideal para startups y equipos en crecimiento que requieren analíticas avanzadas.');
      setBadgeText('Más Popular');
      setPriceText('$29/mes');
      setImageUrl('');
    } else if (type === 'article') {
      setTitle('Guía Definitiva de Tailwind CSS 4');
      setDescription('Aprende las nuevas características del motor Oxide y la integración sin configuración JS.');
      setBadgeText('Diseño Web');
      setPriceText('Lectura de 5 min');
      setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80');
    }
  };

  // Tailwind export code
  const tailwindCode = useMemo(() => {
    if (cardType === 'product') {
      return `<div className="max-w-sm rounded-[${radius}px] overflow-hidden bg-slate-900 border border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
  <div className="relative">
    <img className="w-full h-48 object-cover" src="${imageUrl}" alt="${title}" />
    <span className="absolute top-3 right-3 bg-[${primaryColor}] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
      ${badgeText}
    </span>
  </div>
  <div className="p-5">
    <h3 className="text-lg font-bold text-white mb-2">${title}</h3>
    <p className="text-slate-400 text-sm mb-4 line-clamp-2">${description}</p>
    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
      <span className="text-xl font-extrabold text-white">${priceText}</span>
      <button className="bg-[${primaryColor}] hover:bg-opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
        Comprar Ahora
      </button>
    </div>
  </div>
</div>`;
    } else if (cardType === 'profile') {
      return `<div className="max-w-xs rounded-[${radius}px] p-6 bg-slate-900 border border-slate-800 text-center shadow-xl">
  <div className="relative inline-block mb-4">
    <img className="w-20 h-20 rounded-full object-cover ring-4 ring-[${primaryColor}]/30 mx-auto" src="${imageUrl}" alt="${title}" />
    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
  </div>
  <h3 className="text-lg font-bold text-white">${title}</h3>
  <span className="inline-block mt-1 bg-[${primaryColor}]/10 text-[${primaryColor}] text-xs font-semibold px-3 py-0.5 rounded-full">
    ${badgeText}
  </span>
  <p className="text-slate-400 text-xs mt-3 leading-relaxed">${description}</p>
  <button className="w-full mt-5 bg-[${primaryColor}] hover:bg-opacity-90 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
    Ver Perfil
  </button>
</div>`;
    } else if (cardType === 'pricing') {
      return `<div className="max-w-sm rounded-[${radius}px] p-6 bg-slate-900 border border-[${primaryColor}]/40 shadow-2xl relative">
  <span className="absolute -top-3 right-6 bg-[${primaryColor}] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
    ${badgeText}
  </span>
  <h3 className="text-xl font-bold text-white">${title}</h3>
  <p className="text-slate-400 text-xs mt-1 mb-4">${description}</p>
  <div className="my-4">
    <span className="text-3xl font-black text-white">${priceText}</span>
  </div>
  <ul className="space-y-2 text-sm text-slate-300 my-6">
    <li className="flex items-center gap-2">✓ Proyectos Ilimitados</li>
    <li className="flex items-center gap-2">✓ Dominio Personalizado</li>
    <li className="flex items-center gap-2">✓ Soporte Prioritario 24/7</li>
  </ul>
  <button className="w-full bg-[${primaryColor}] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all">
    Comenzar Prueba Gratis
  </button>
</div>`;
    } else {
      return `<div className="max-w-sm rounded-[${radius}px] overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
  <img className="w-full h-44 object-cover" src="${imageUrl}" alt="${title}" />
  <div className="p-5">
    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
      <span className="text-[${primaryColor}] font-bold uppercase">${badgeText}</span>
      <span>${priceText}</span>
    </div>
    <h3 className="text-lg font-bold text-white mb-2 leading-snug">${title}</h3>
    <p className="text-slate-400 text-sm">${description}</p>
  </div>
</div>`;
    }
  }, [cardType, title, description, badgeText, priceText, imageUrl, radius, primaryColor]);

  // HTML + CSS export
  const htmlCssCode = useMemo(() => {
    return `<!-- Tarjeta UI -->
<div class="ui-card">
  ${imageUrl ? `<img src="${imageUrl}" class="ui-card-img" alt="${title}">` : ''}
  <div class="ui-card-body">
    <span class="ui-badge">${badgeText}</span>
    <h3 class="ui-title">${title}</h3>
    <p class="ui-desc">${description}</p>
    <div class="ui-footer">
      <span class="ui-price">${priceText}</span>
    </div>
  </div>
</div>

<style>
.ui-card {
  max-width: 360px;
  border-radius: ${radius}px;
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  font-family: system-ui, sans-serif;
  color: #f8fafc;
}
.ui-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.ui-card-body {
  padding: 20px;
}
.ui-badge {
  display: inline-block;
  background-color: ${primaryColor};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  margin-bottom: 8px;
}
.ui-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
}
.ui-desc {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
}
.ui-price {
  font-size: 20px;
  font-weight: 800;
}
</style>`;
  }, [title, description, badgeText, priceText, imageUrl, radius, primaryColor]);

  const handleCopy = () => {
    const text = activeCodeTab === 0 ? tailwindCode : htmlCssCode;
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Lateral Fixed Ads */}
      <Box sx={{ display: { xs: 'none', xl: 'block' }, position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <AdPlaceholder type="vertical" label="Lateral Izquierdo" />
      </Box>
      <Box sx={{ display: { xs: 'none', xl: 'block' }, position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
        <AdPlaceholder type="vertical" label="Lateral Derecho" />
      </Box>

      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
          UI Card & Component Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
          Diseña tarjetas de interfaz para productos, perfiles, planes de precios y artículos. Genera código responsive para Tailwind CSS y HTML/CSS.
        </Typography>

        <AdPlaceholder type="horizontal" label="Superior" />
      </Box>

      {/* Card Category Selection */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
          Tipo de Componente UI
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<CartIcon fontSize="small" />}
            label="Producto E-commerce"
            clickable
            color={cardType === 'product' ? 'primary' : 'default'}
            onClick={() => handleCardTypeChange('product')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<PersonIcon fontSize="small" />}
            label="Perfil de Usuario"
            clickable
            color={cardType === 'profile' ? 'primary' : 'default'}
            onClick={() => handleCardTypeChange('profile')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<MoneyIcon fontSize="small" />}
            label="Tabla de Precios (Pricing)"
            clickable
            color={cardType === 'pricing' ? 'primary' : 'default'}
            onClick={() => handleCardTypeChange('pricing')}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            icon={<ArticleIcon fontSize="small" />}
            label="Artículo de Blog"
            clickable
            color={cardType === 'article' ? 'primary' : 'default'}
            onClick={() => handleCardTypeChange('article')}
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CardIcon color="primary" /> Personalización del Contenido
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Título Principal" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth size="small" />
              <TextField label="Descripción / Subtítulo" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} size="small" />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="Insignia / Badge" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} fullWidth size="small" />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Precio / Tag Principal" value={priceText} onChange={(e) => setPriceText(e.target.value)} fullWidth size="small" />
                </Grid>
              </Grid>

              {cardType !== 'pricing' && (
                <TextField label="URL de la Imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth size="small" />
              )}

              {/* Accent Color */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                  Color Acento / Destacado
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
              </Box>

              {/* Radius slider */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Radio de Esquina (Border Radius)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{radius}px</Typography>
                </Box>
                <Slider value={radius} min={0} max={32} onChange={(_, val) => setRadius(val as number)} size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Preview & Code */}
        <Grid item xs={12} lg={7}>
          {/* Live Render Canvas */}
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              bgcolor: '#090d16',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 340,
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Render Component based on cardType */}
            {cardType === 'product' && (
              <Box sx={{ maxWidth: 320, width: '100%', borderRadius: `${radius}px`, overflow: 'hidden', bgcolor: '#131c2e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 6 }}>
                <Box sx={{ position: 'relative' }}>
                  <img src={imageUrl} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <Chip label={badgeText} size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: primaryColor, color: '#fff', fontWeight: 800, fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, color: '#fff' }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem' }}>{description}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>{priceText}</Typography>
                    <Button variant="contained" size="small" sx={{ bgcolor: primaryColor, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>Comprar</Button>
                  </Box>
                </Box>
              </Box>
            )}

            {cardType === 'profile' && (
              <Box sx={{ maxWidth: 300, width: '100%', borderRadius: `${radius}px`, p: 3, bgcolor: '#131c2e', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: 6 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', mx: 'auto', mb: 2, border: `3px solid ${primaryColor}` }}>
                  <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>{title}</Typography>
                <Chip label={badgeText} size="small" sx={{ bgcolor: `${primaryColor}22`, color: primaryColor, fontWeight: 700, mt: 0.5, mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 2 }}>{description}</Typography>
                <Button fullWidth variant="contained" size="small" sx={{ bgcolor: primaryColor, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>Ver Perfil</Button>
              </Box>
            )}

            {cardType === 'pricing' && (
              <Box sx={{ maxWidth: 320, width: '100%', borderRadius: `${radius}px`, p: 3, bgcolor: '#131c2e', border: `2px solid ${primaryColor}`, boxShadow: 8, position: 'relative' }}>
                <Chip label={badgeText} size="small" sx={{ position: 'absolute', top: -12, right: 16, bgcolor: primaryColor, color: '#fff', fontWeight: 800 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>{title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{description}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, my: 2, color: '#fff' }}>{priceText}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: primaryColor }} />
                    <Typography variant="caption" color="text.secondary">Proyectos Ilimitados</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: primaryColor }} />
                    <Typography variant="caption" color="text.secondary">Dominio Personalizado</Typography>
                  </Box>
                </Box>
                <Button fullWidth variant="contained" sx={{ bgcolor: primaryColor, borderRadius: 2, textTransform: 'none', fontWeight: 800, py: 1 }}>Probar Gratis</Button>
              </Box>
            )}

            {cardType === 'article' && (
              <Box sx={{ maxWidth: 340, width: '100%', borderRadius: `${radius}px`, overflow: 'hidden', bgcolor: '#131c2e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 6 }}>
                <img src={imageUrl} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: primaryColor, textTransform: 'uppercase' }}>{badgeText}</Typography>
                    <Typography variant="caption" color="text.secondary">{priceText}</Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', mb: 1, lineHeight: 1.3 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{description}</Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Code Export */}
          <Paper variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs value={activeCodeTab} onChange={(_, val) => setActiveCodeTab(val)}>
                <Tab label="Tailwind CSS" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
                <Tab label="HTML + CSS" icon={<CodeIcon fontSize="small" />} iconPosition="start" />
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

            <Box sx={{ p: 2, bgcolor: '#060911', fontFamily: 'monospace', fontSize: '0.825rem', color: '#e2e8f0', overflowX: 'auto', maxHeight: 260 }}>
              <pre style={{ margin: 0 }}>
                {activeCodeTab === 0 ? tailwindCode : htmlCssCode}
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

export default CardBuilder;
