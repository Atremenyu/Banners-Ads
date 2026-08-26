import React from 'react';
import { Head } from 'vite-react-ssg';
import CardBuilder from '@/components/CardBuilder';

const CardBuilderPage = () => {
  return (
    <>
      <Head>
        <title>UI Card & Component Builder | DesignKit Studio</title>
        <meta name="description" content="Diseña tarjetas UI para productos, perfiles, planes de precios y artículos con exportación a Tailwind CSS y HTML." />
      </Head>
      <CardBuilder />
    </>
  );
};

export default CardBuilderPage;
