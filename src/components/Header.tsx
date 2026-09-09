import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, Container, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, Divider,
  Menu, MenuItem, Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Crop as CropIcon,
  TextFields as TextFieldsIcon,
  Link as LinkIcon,
  Palette as PaletteIcon,
  AspectRatio as AspectRatioIcon,
  QrCode as QrCodeIcon,
  Gradient as GradientIcon,
  Layers as LayersIcon,
  FormatQuote as QuoteIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Image as ImageIcon,
  EditNote as EditNoteIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  TouchApp as TouchIcon,
  ViewCarousel as CardIcon,
  Category as ShapeIcon,
  FormatSize as FormatSizeIcon,
  Animation as AnimationIcon,
  Transform as TransformIcon,
  Compare as CompareIcon,
  Language as LanguageIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  BrandingWatermark as WatermarkIcon,
  AutoFixHigh as ToolsIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface ToolItem {
  label: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface CategoryGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ToolItem[];
}

const categories: CategoryGroup[] = [
  {
    id: 'images',
    title: 'Banners & Web',
    icon: <ImageIcon fontSize="small" />,
    items: [
      { label: 'Optimizador Banners', desc: 'Recorta, reencuadra y comprime WebP/JPEG', path: '/', icon: <CropIcon fontSize="small" />, badge: 'Pro' },
      { label: 'Banners GIF (≤180KB)', desc: 'Optimiza banners GIF animados para Google Ads', path: '/gif-optimizer', icon: <AnimationIcon fontSize="small" />, badge: '≤180K' },
      { label: 'Conversor de Formatos', desc: 'Convierte por lotes entre WebP, PNG y JPEG', path: '/conversor-formatos', icon: <TransformIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Compresor en Vivo', desc: 'Comparador antes y después en pantalla dividida', path: '/compresor-imagenes', icon: <CompareIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Ratio Calculator', desc: 'Calcula dimensiones y ratios con subida de imagen', path: '/aspect-ratio', icon: <AspectRatioIcon fontSize="small" /> },
      { label: 'QR Studio', desc: 'Genera códigos QR para URLs, Wi-Fi y WhatsApp', path: '/qr-studio', icon: <QrCodeIcon fontSize="small" /> },
    ]
  },
  {
    id: 'image-tools',
    title: 'Utilidades de Imagen',
    icon: <ToolsIcon fontSize="small" />,
    items: [
      { label: 'Generador de Favicons', desc: 'Crea el paquete ICO, Apple Touch y site.webmanifest', path: '/favicon-generator', icon: <LanguageIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Redes Sociales', desc: 'Redimensiona para Instagram, TikTok, X y YouTube', path: '/redimensionador-redes', icon: <ShareIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Limpiador EXIF', desc: 'Elimina coordenadas GPS y datos privados de fotos', path: '/limpiador-exif', icon: <SecurityIcon fontSize="small" />, badge: 'Privacidad' },
      { label: 'SVG a PNG / WebP', desc: 'Rasteriza vectores a alta definición en 1x, 2x y 4x', path: '/svg-rasterizer', icon: <CodeIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Estudio de Marcas de Agua', desc: 'Añade textos, logos y patrones de seguridad', path: '/marcas-agua', icon: <WatermarkIcon fontSize="small" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'text',
    title: 'Texto & SEO',
    icon: <EditNoteIcon fontSize="small" />,
    items: [
      { label: 'TextLab & SEO', desc: 'Transformador de texto y límites de caracteres', path: '/texto', icon: <TextFieldsIcon fontSize="small" />, badge: 'SEO' },
      { label: 'UTM Builder', desc: 'Generador de enlaces de marketing rastreables', path: '/utm-builder', icon: <LinkIcon fontSize="small" /> },
      { label: 'LoremCraft', desc: 'Generador de Lorem Ipsum y microcopy comercial', path: '/lorem-generator', icon: <QuoteIcon fontSize="small" /> },
    ]
  },
  {
    id: 'design',
    title: 'Diseño & CSS',
    icon: <BrushIcon fontSize="small" />,
    items: [
      { label: 'Color Studio', desc: 'Extractor de paletas y validador WCAG', path: '/color-studio', icon: <PaletteIcon fontSize="small" /> },
      { label: 'Gradient Studio', desc: 'Gradientes CSS y fondos HD en 1080p', path: '/gradient-studio', icon: <GradientIcon fontSize="small" /> },
      { label: 'Shadow Studio', desc: 'Sombras box-shadow y Glassmorphism', path: '/shadow-studio', icon: <LayersIcon fontSize="small" /> },
    ]
  },
  {
    id: 'dev',
    title: 'Frontend & UI',
    icon: <CodeIcon fontSize="small" />,
    items: [
      { label: 'Button & Badge Forge', desc: 'Creador de botones interactivas y badges', path: '/button-forge', icon: <TouchIcon fontSize="small" /> },
      { label: 'UI Card Builder', desc: 'Generador de componentes y tarjetas UI', path: '/card-builder', icon: <CardIcon fontSize="small" /> },
      { label: 'CSS Clip-Path Studio', desc: 'Formas geométricas y organic blobs', path: '/clip-path-studio', icon: <ShapeIcon fontSize="small" /> },
      { label: 'TypeScale Generator', desc: 'Escalas tipográficas y CSS Clamp()', path: '/typescale-generator', icon: <FormatSizeIcon fontSize="small" /> },
    ]
  }
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Popover Menu state for desktop categories
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (categoryId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEls(prev => ({ ...prev, [categoryId]: event.currentTarget }));
  };

  const handleMenuClose = (categoryId: string) => {
    setAnchorEls(prev => ({ ...prev, [categoryId]: null }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Find active item
  const activeTool = categories
    .flatMap(c => c.items)
    .find(item => item.path === location.pathname);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(11, 15, 23, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 58, md: 62 }, px: { xs: 1, sm: 2 } }}>
          
          {/* Brand & Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Box
                id="app-logo-box"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
                }}
              >
                <LayersIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5, fontSize: '1.1rem' }}>
                  Design<Box component="span" sx={{ color: 'primary.main' }}>Kit</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.68rem', opacity: 0.8 }}>
                  Suite Creativa & Marketing
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Desktop Categorized Dropdowns - Visible on lg screens and up to prevent overflow */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.75 }}>
            {categories.map((cat) => {
              const isCatActive = cat.items.some(item => item.path === location.pathname);
              const anchorEl = anchorEls[cat.id];
              const isOpen = Boolean(anchorEl);

              return (
                <Box key={cat.id}>
                  <Button
                    onClick={(e) => handleMenuOpen(cat.id, e)}
                    startIcon={cat.icon}
                    endIcon={<ArrowDownIcon sx={{ fontSize: 18, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />}
                    sx={{
                      px: 1.5,
                      py: 0.7,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: isCatActive ? 700 : 500,
                      fontSize: '0.84rem',
                      whiteSpace: 'nowrap',
                      color: isCatActive ? 'primary.main' : 'text.primary',
                      bgcolor: isCatActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: isCatActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                      '&:hover': {
                        bgcolor: isCatActive ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    {cat.title}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={() => handleMenuClose(cat.id)}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1,
                        width: 320,
                        p: 1,
                        bgcolor: '#131c2e',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                      }
                    }}
                  >
                    {cat.items.map((item) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <MenuItem
                          key={item.path}
                          component={RouterLink}
                          to={item.path}
                          onClick={() => handleMenuClose(cat.id)}
                          selected={isItemActive}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            px: 1.5,
                            mb: 0.5,
                            alignItems: 'flex-start',
                            '&.Mui-selected': {
                              bgcolor: 'rgba(59, 130, 246, 0.15)',
                              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.22)' }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: isItemActive ? 'primary.main' : 'text.secondary', minWidth: 32, mt: 0.25 }}>
                            {item.icon}
                          </ListItemIcon>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: isItemActive ? 700 : 600, color: isItemActive ? 'primary.main' : 'text.primary' }}>
                                {item.label}
                              </Typography>
                              {item.badge && (
                                <Chip
                                  label={item.badge}
                                  size="small"
                                  color={item.badge === 'Nuevo' ? 'success' : item.badge === 'Pro' ? 'primary' : 'default'}
                                  sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, px: 0.5 }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.3, mt: 0.25 }}>
                              {item.desc}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </Box>
              );
            })}
          </Box>

          {/* Right Side: Active Badge & Hamburger Trigger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeTool && (
              <Chip
                icon={activeTool.icon as React.ReactElement}
                label={activeTool.label}
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex', xl: 'none' },
                  fontWeight: 700,
                  height: 26,
                  fontSize: '0.75rem',
                  maxWidth: 180
                }}
              />
            )}

            {/* Hamburger Button for screens below lg (<1200px) */}
            <IconButton
              id="mobile-drawer-toggle"
              color="inherit"
              aria-label="Abrir menú de herramientas"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { lg: 'none' },
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 0.75,
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.15)' }
              }}
            >
              <MenuIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile & Tablet Navigation Drawer */}
      <Drawer
        id="mobile-nav-drawer"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: { xs: '85vw', sm: 340 },
            maxWidth: 360,
            bgcolor: '#0b0f17',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <LayersIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Design<Box component="span" sx={{ color: 'primary.main' }}>Kit</Box> Studio
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Suite Creativa Completa
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'text.secondary' }}>
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
          <Stack spacing={2.5}>
            {categories.map((cat) => (
              <Box key={cat.id}>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, px: 1, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                  {cat.icon} {cat.title}
                </Typography>
                <List disablePadding>
                  {cat.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          component={RouterLink}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          selected={isActive}
                          sx={{
                            borderRadius: 2,
                            py: 0.85,
                            px: 1.25,
                            '&.Mui-selected': {
                              bgcolor: 'rgba(59, 130, 246, 0.18)',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 30 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            secondary={item.desc}
                            primaryTypographyProps={{
                              fontWeight: isActive ? 700 : 500,
                              fontSize: '0.85rem',
                              color: isActive ? 'primary.main' : 'text.primary'
                            }}
                            secondaryTypographyProps={{
                              fontSize: '0.7rem',
                              lineHeight: 1.2,
                              color: 'text.secondary',
                              sx: { display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
                            }}
                          />
                          {item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              color={item.badge === 'Nuevo' ? 'success' : item.badge === 'Pro' ? 'primary' : 'default'}
                              sx={{ height: 16, fontSize: '0.6rem', ml: 0.5 }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5, px: 0.5 }}>
          <Button component={RouterLink} to="/acerca-de" onClick={() => setMobileOpen(false)} size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', color: 'text.secondary' }}>
            Acerca de
          </Button>
          <Button component={RouterLink} to="/guia" onClick={() => setMobileOpen(false)} size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', color: 'text.secondary' }}>
            Guía & FAQs
          </Button>
          <Button component={RouterLink} to="/contacto" onClick={() => setMobileOpen(false)} size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', color: 'text.secondary' }}>
            Contacto
          </Button>
          <Button component={RouterLink} to="/privacidad" onClick={() => setMobileOpen(false)} size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', color: 'text.secondary' }}>
            Privacidad
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
