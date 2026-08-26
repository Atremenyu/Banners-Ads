import React from 'react';
import { Head } from 'vite-react-ssg';
import TypeScaleGenerator from '@/components/TypeScaleGenerator';

const TypeScalePage = () => {
  return (
    <>
      <Head>
        <title>TypeScale & Fluid Typography Generator | DesignKit Studio</title>
        <meta name="description" content="Calcula escalas tipográficas armónicas y genera código de tipografía fluida CSS clamp() para desarrollo frontend." />
      </Head>
      <TypeScaleGenerator />
    </>
  );
};

export default TypeScalePage;
