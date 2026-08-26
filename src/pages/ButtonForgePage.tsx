import React from 'react';
import { Head } from 'vite-react-ssg';
import ButtonForge from '@/components/ButtonForge';

const ButtonForgePage = () => {
  return (
    <>
      <Head>
        <title>Button & Badge Forge - Creador de Botones UI | DesignKit Studio</title>
        <meta name="description" content="Diseña botones e insignias UI interactivas con efectos hover y exportación directa a Tailwind CSS, HTML/CSS y React TSX." />
      </Head>
      <ButtonForge />
    </>
  );
};

export default ButtonForgePage;
