import React from 'react';
import { Head } from 'vite-react-ssg';
import ShadowStudio from '@/components/ShadowStudio';

const ShadowStudioPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ShadowStudio - Generador de Sombras CSS y Glassmorphism",
    "description": "Diseña efectos de sombras multinivel (`box-shadow`), simula efectos de Glassmorphism y copia código para CSS o Tailwind.",
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
        <title>ShadowStudio - Generador de Sombras CSS Box-Shadow y Glassmorphism</title>
        <meta name="description" content="Generador visual de sombras box-shadow multinivel, efecto cristal Glassmorphism y exportación de código para CSS y Tailwind CSS." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <ShadowStudio />
    </>
  );
};

export default ShadowStudioPage;
