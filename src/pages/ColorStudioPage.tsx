import React from 'react';
import { Head } from 'vite-react-ssg';
import ColorStudio from '@/components/ColorStudio';

const ColorStudioPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ColorStudio - Extractor de Paletas y Accesibilidad WCAG",
    "description": "Extrae paletas de color desde imágenes y comprueba el contraste de colores según los estándares de accesibilidad WCAG 2.1.",
    "applicationCategory": "DesignApplication",
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
        <title>ColorStudio - Extractor de Paletas e Inspector de Contraste WCAG</title>
        <meta name="description" content="Sube una imagen para extraer su paleta de colores HEX/RGB/HSL y verifica la relación de contraste WCAG para diseño web accesible." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <ColorStudio />
    </>
  );
};

export default ColorStudioPage;
