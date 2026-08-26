import React from 'react';
import { Head } from 'vite-react-ssg';
import QrStudio from '@/components/QrStudio';

const QrStudioPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QRStudio - Generador de Códigos QR Personalizados",
    "description": "Crea y personaliza códigos QR en alta resolución para URLs, mensajes de WhatsApp, redes Wi-Fi y textos publicitarios.",
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
        <title>QRStudio - Generador de Códigos QR para WhatsApp, WiFi y URLs</title>
        <meta name="description" content="Genera códigos QR personalizados en alta definición (PNG y SVG). Compatible con enlaces web, WhatsApp con mensaje y redes Wi-Fi." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <QrStudio />
    </>
  );
};

export default QrStudioPage;
