import React from 'react';
import { Head } from 'vite-react-ssg';
import ClipPathStudio from '@/components/ClipPathStudio';

const ClipPathPage = () => {
  return (
    <>
      <Head>
        <title>CSS Shape, Clip-Path & Organic Blob Generator | DesignKit Studio</title>
        <meta name="description" content="Genera recortes poligonales clip-path, formas orgánicas blob y paneles Glassmorphism con exportación instantánea a CSS y Tailwind." />
      </Head>
      <ClipPathStudio />
    </>
  );
};

export default ClipPathPage;
