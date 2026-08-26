import React from 'react';
import { Head } from 'vite-react-ssg';
import CopyGen from '@/components/CopyGen';

const CopyGenPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LoremCraft - Generador de Texto Lorem Ipsum y Microcopy Comercial",
    "description": "Genera texto de relleno Lorem Ipsum o frases comerciales reales en español para botones CTA y maquetas de diseño.",
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
        <title>LoremCraft - Generador de Texto Lorem Ipsum y Microcopy Comercial</title>
        <meta name="description" content="Genera párrafos de Lorem Ipsum o frases comerciales en español para maquetas web, landings y botones de llamada a la acción." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <CopyGen />
    </>
  );
};

export default CopyGenPage;
