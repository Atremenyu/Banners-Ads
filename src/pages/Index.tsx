import React from 'react';
import { Head } from 'vite-react-ssg';
import BannerOptimizer from '@/components/BannerOptimizer';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://ais-dev-zmu464tqcat55vzvjpxme2-181959893203.us-east5.run.app/#webapp",
    "name": "Banner Optimizer",
    "alternateName": "Optimizador de Banners",
    "url": "https://ais-dev-zmu464tqcat55vzvjpxme2-181959893203.us-east5.run.app/",
    "description": "Optimiza y recorta tus imágenes para formatos de banner estándar en segundos. Herramienta web gratuita y 100% local para recortar y comprimir banners con descarga en ZIP.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Recorte inteligente con preajustes de banners estándar (728x90, 600x500, etc.)",
      "Compresión optimizada en el navegador para máxima velocidad de carga",
      "Descarga individual o en lote comprimido en un archivo ZIP",
      "Procesamiento local seguro sin subir imágenes a ningún servidor",
      "Interfaz fluida con modo oscuro y optimización para Core Web Vitals"
    ]
  };

  return (
    <>
      <Head>
        <title>Banner Optimizer - Recorta y Optimiza Imágenes de Banners Online</title>
        <meta name="description" content="Optimiza y recorta tus imágenes para formatos de banner estándar en segundos. Herramienta web gratuita y 100% local para recortar y comprimir banners con descarga en ZIP." />
        <meta name="keywords" content="banner optimizer, optimizador de banners, recortar banners, comprimir imagenes webp, formatos iab 728x90, compresor imagenes adsense" />
        <meta property="og:title" content="Banner Optimizer - Recorta y Optimiza Imágenes de Banners Online" />
        <meta property="og:description" content="Optimiza y recorta imágenes para banners estándar (728x90, 600x500, 640x200) de forma 100% local y gratuita." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Banner Optimizer | DesignKit Studio" />
        <meta name="twitter:description" content="Herramienta gratuita para optimizar banners con descarga por lotes en ZIP y procesamiento privado en el navegador." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <BannerOptimizer />
    </>
  );
};

export default Index;

