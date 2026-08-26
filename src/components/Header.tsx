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
  AutoAwesome as AutoAwesomeIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Image as ImageIcon,
  EditNote as EditNoteIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  TouchApp as TouchIcon,
  ViewCarousel as CardIcon,
  Category as ShapeIcon,
  FormatSize as FormatSizeIcon
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
    title: 'Imágenes & Banners',
    icon: <ImageIcon fontSize="small" />,
    items: [
      { label: 'Optimizador Banners', desc: 'Recorta, reencuadra y comprime WebP/JPEG', path: '/', icon: <CropIcon fontSize="small" />, badge: 'Pro' },
      { label: 'Ratio Calculator', desc: 'Calcula dimensiones y aspect ratios', path: '/aspect-ratio', icon: <AspectRatioIcon fontSize="small" /> },
      { label: 'QR Studio', desc: 'Genera códigos QR para URLs, Wi-Fi y WhatsApp', path: '/qr-studio', icon: <QrCodeIcon fontSize="small" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'text',
    title: 'Texto & SEO',
    icon: <EditNoteIcon fontSize="small" />,
    items: [
      { label: 'TextLab & SEO', desc: 'Transformador de texto y límites de caracteres', path: '/texto', icon: <TextFieldsIcon fontSize="small" />, badge: 'SEO' },
      { label: 'UTM Builder', desc: 'Generador de enlaces de marketing rastreables', path: '/utm-builder', icon: <LinkIcon fontSize="small" /> },
      { label: 'LoremCraft', desc: 'Generador de Lorem Ipsum y microcopy comercial', path: '/lorem-generator', icon: <QuoteIcon fontSize="small" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'design',
    title: 'Diseño & CSS',
    icon: <BrushIcon fontSize="small" />,
    items: [
      { label: 'Color Studio', desc: 'Extractor de paletas y validador WCAG', path: '/color-studio', icon: <PaletteIcon fontSize="small" /> },
      { label: 'Gradient Studio', desc: 'Gradientes CSS y fondos HD en 1080p', path: '/gradient-studio', icon: <GradientIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'Shadow Studio', desc: 'Sombras box-shadow y Glassmorphism', path: '/shadow-studio', icon: <LayersIcon fontSize="small" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'dev',
    title: 'Desarrollo Frontend',
    icon: <CodeIcon fontSize="small" />,
    items: [
      { label: 'Button & Badge Forge', desc: 'Creador de botones interactivas y badges', path: '/button-forge', icon: <TouchIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'UI Card Builder', desc: 'Generador de componentes y tarjetas UI', path: '/card-builder', icon: <CardIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'CSS Clip-Path Studio', desc: 'Formas geométricas y organic blobs', path: '/clip-path-studio', icon: <ShapeIcon fontSize="small" />, badge: 'Nuevo' },
      { label: 'TypeScale Generator', desc: 'Escalas tipográficas y CSS Clamp()', path: '/typescale-generator', icon: <FormatSizeIcon fontSize="small" />, badge: 'Nuevo' },
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
                <AutoAwesomeIcon sx={{ fontSize: 20 }} />
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

          {/* Desktop Categorized Dropdowns */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {categories.map((cat) => {
              const isCatActive = cat.items.some(item => item.path === location.pathname);
              const anchorEl = anchorEls[cat.id];
              const isOpen = Boolean(anchorEl);

              return (
                <Box key={cat.id}>
                  <Button
                    onClick={(e) => handleMenuOpen(cat.id, e)}
                    startIcon={cat.icon}
                    endIcon={<ArrowDownIcon sx={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />}
                    sx={{
                      px: 1.75,
                      py: 0.75,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: isCatActive ? 700 : 500,
                      fontSize: '0.875rem',
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
                        width: 310,
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

          {/* Quick Active Badge or Mobile Trigger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeTool && (
              <Chip
                icon={activeTool.icon as React.ReactElement}
                label={activeTool.label}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ display: { xs: 'none', sm: 'inline-flex', lg: 'none' }, fontWeight: 700, height: 26, fontSize: '0.75rem' }}
              />
            )}

            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Horizontal Quick Pill Bar (Desktop) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.75,
            py: 0.75,
            overflowX: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {categories.flatMap(c => c.items).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Chip
                key={item.path}
                component={RouterLink}
                to={item.path}
                clickable
                label={item.label}
                size="small"
                variant={isActive ? 'filled' : 'outlined'}
                color={isActive ? 'primary' : 'default'}
                sx={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.725rem',
                  height: 24,
                  borderColor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                  bgcolor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#fff' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff'
                  }
                }}
              />
            );
          })}
        </Box>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: '#0b0f17',
            p: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, px: 1 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
            DesignKit Studio
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {categories.map((cat) => (
            <Box key={cat.id}>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 700, px: 1, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
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
                          py: 0.75,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(59, 130, 246, 0.18)',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 32 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.85rem'
                          }}
                        />
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            color={item.badge === 'Nuevo' ? 'success' : item.badge === 'Pro' ? 'primary' : 'default'}
                            sx={{ height: 16, fontSize: '0.6rem' }}
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
      </Drawer>
    </AppBar>
  );
};

export default Header;
