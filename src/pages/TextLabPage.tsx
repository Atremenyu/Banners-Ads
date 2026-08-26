import React from 'react';
import { Head } from 'vite-react-ssg';
import TextLab from '@/components/TextLab';

const TextLabPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TextLab - Transformador de Texto y Contador SEO",
    "description": "Herramienta online para cambiar mayúsculas/minúsculas, limpiar texto, contar caracteres y analizar límites para SEO y redes sociales.",
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
        <title>TextLab - Convertidor de Mayúsculas, Limpieza y Contador SEO</title>
        <meta name="description" content="Convierte texto a mayúsculas, minúsculas, Title Case, remueve acentos, limpia espacios y analiza límites para Meta Titles, Twitter e Instagram." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <TextLab />
    </>
  );
};

export default TextLabPage;
