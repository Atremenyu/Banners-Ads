import React from 'react';
import { Head } from 'vite-react-ssg';
import GifBannerOptimizer from '@/components/GifBannerOptimizer';

const GifOptimizerPage: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Optimizador de Banners GIF - Compresión Publicitaria ≤ 180 KB',
    'description':
      'Herramienta gratuita para redimensionar y optimizar banners GIF animados a formatos estándar (728x90, 600x500, 640x200, 300x250) garantizando un peso menor a 180 KB para Google Ads y redes publicitarias.',
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  return (
    <>
      <Head>
        <title>Optimizador de Banners GIF Animados (≤ 180 KB) | DesignKit Studio</title>
        <meta
          name="description"
          content="Optimiza y recorta tus banners GIF animados para Google Ads, Meta e IAB. Redimensiona a 728x90, 600x500, 640x200 y comprime por debajo de 180 KB sin perder calidad ni sincronización."
        />
        <meta
          name="keywords"
          content="optimizador banner gif, comprimir gif menos de 180 kb, banner gif google ads, recortar gif 728x90, compresor gif iab, banner animado ligero"
        />
        <meta property="og:title" content="Optimizador de Banners GIF Animados (≤ 180 KB) | DesignKit Studio" />
        <meta
          property="og:description"
          content="Optimiza y recorta banners GIF animados a 728x90, 600x500 y 640x200 con compresión estricta menor a 180 KB."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Optimizador de Banners GIF Animados ≤ 180 KB" />
        <meta
          name="twitter:description"
          content="Herramienta 100% local en navegador para optimizar banners GIF para redes publicitarias con descarga individual y por lotes en ZIP."
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <GifBannerOptimizer />
    </>
  );
};

export default GifOptimizerPage;
