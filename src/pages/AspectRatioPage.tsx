import React from 'react';
import { Head } from 'vite-react-ssg';
import AspectRatioCalculator from '@/components/AspectRatioCalculator';

const AspectRatioPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RatioCalculator - Calculadora de Proporciones y Aspect Ratio",
    "description": "Calcula dimensiones exactas en píxeles para banners, imágenes y redes sociales manteniendo la relación de aspecto.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <title>RatioCalculator - Calculadora de Aspect Ratio y Dimensiones de Banner</title>
        <meta name="description" content="Calcula relaciones de aspecto (16:9, 4:5, 1:1, 9:16) y dimensiones en píxeles para Instagram, YouTube, TikTok y Google Ads." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <AspectRatioCalculator />
    </>
  );
};

export default AspectRatioPage;
