import React, { useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any;
  }
}

interface AdPlaceholderProps {
  type: 'vertical' | 'horizontal';
  label: string;
}

export const LateralAds: React.FC = () => {
  return (
    <>
      {/* Lateral Left Ad - Only rendered when screen is wide enough (>=1960px) to prevent overlapping container content */}
      <Box
        sx={{
          display: 'none',
          '@media (min-width: 1960px)': {
            display: 'block',
            position: 'fixed',
            left: 'calc(50vw - 768px - 196px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            pointerEvents: 'auto'
          }
        }}
      >
        <AdPlaceholder type="vertical" label="Lateral Izquierdo" />
      </Box>

      {/* Lateral Right Ad - Only rendered when screen is wide enough (>=1960px) to prevent overlapping container content */}
      <Box
        sx={{
          display: 'none',
          '@media (min-width: 1960px)': {
            display: 'block',
            position: 'fixed',
            right: 'calc(50vw - 768px - 196px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            pointerEvents: 'auto'
          }
        }}
      >
        <AdPlaceholder type="vertical" label="Lateral Derecho" />
      </Box>
    </>
  );
};

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, label }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const styles = {
    vertical: {
      width: '180px',
      height: '600px',
      display: isMobile ? 'none' : 'flex',
    },
    horizontal: {
      width: '100%',
      maxWidth: '728px',
      minHeight: '60px',
      maxHeight: '90px',
      display: 'flex',
      margin: '16px auto',
    },
  };

  return (
    <Box
      sx={{
        ...styles[type],
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '"ANUNCIO"',
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          letterSpacing: '1px',
          color: 'text.secondary',
          opacity: 0.4,
          pointerEvents: 'none',
        }
      }}
    >
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client="ca-pub-8438097053505351"
           data-ad-slot={type === 'vertical' ? "7635642545" : "7635642545"}
           data-ad-format={type === 'vertical' ? undefined : 'auto'}
           data-full-width-responsive={type === 'vertical' ? "false" : "true"}></ins>

      {typeof window !== 'undefined' && !window.adsbygoogle && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', p: 1, position: 'absolute', pointerEvents: 'none', fontSize: '0.75rem' }}>
          Espacio Publicitario ({label})
        </Typography>
      )}
    </Box>
  );
};

export default AdPlaceholder;
