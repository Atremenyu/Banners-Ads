import React from 'react';
import { Head } from 'vite-react-ssg';
import GradientStudio from '@/components/GradientStudio';

const GradientStudioPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GradientStudio - Generador de Gradientes CSS y Fondos HD",
    "description": "Diseña gradientes CSS lineales, radiales y cónicos multinivel, exporta código limpio para Tailwind o descarga fondos en alta resolución.",
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
        <title>GradientStudio - Generador de Gradientes CSS y Fondos HD</title>
        <meta name="description" content="Diseña gradientes CSS de múltiples colores, copia código para CSS/Tailwind y descarga fondos de pantalla en resolución 1920x1080 HD." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <GradientStudio />
    </>
  );
};

export default GradientStudioPage;
