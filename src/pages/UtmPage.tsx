import React from 'react';
import { Head } from 'vite-react-ssg';
import UtmBuilder from '@/components/UtmBuilder';

const UtmPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "UTMCraft - Creador de Enlaces UTM para Marketing",
    "description": "Generador gratuito de URLs con parámetros UTM para campañas de Google Analytics, Meta Ads, Newsletter y Redes Sociales.",
    "applicationCategory": "BusinessApplication",
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
        <title>UTMCraft - Creador de Enlaces UTM para Campañas de Marketing</title>
        <meta name="description" content="Genera URLs etiquetadas con parámetros UTM (utm_source, utm_medium, utm_campaign) para medir el rendimiento en Google Analytics." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <UtmBuilder />
    </>
  );
};

export default UtmPage;
