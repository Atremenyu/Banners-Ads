import React, { useState } from 'react';
import { Head } from 'vite-react-ssg';
import AdPlaceholder, { LateralAds } from '@/components/AdPlaceholder';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent,
  Tabs, Tab, Chip, Divider, Button
} from '@mui/material';
import {
  Zap as ZapIcon,
  Type as TextFieldsIcon,
  Link as LinkIcon,
  Palette as PaletteIcon,
  Crop as AspectRatioIcon,
  QrCode as QrCodeIcon,
  Paintbrush as GradientIcon,
  FileText as ArticleIcon,
  Layers as LayersIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle2 as CheckIcon,
  ArrowRight as ArrowRightIcon,
  BookOpen as BookOpenIcon,
  MousePointer as TouchIcon,
  LayoutGrid as CardIcon,
  Shapes as ShapeIcon
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface AppGuideData {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  route: string;
  description: string;
  purpose: string;
  steps: { title: string; desc: string }[];
  features: string[];
  proTip: string;
}

const appGuides: AppGuideData[] = [
  {
    id: 'banner',
    name: 'Banner Optimizer',
    badge: 'Imágenes y Banners',
    icon: ZapIcon,
    route: '/',
    description: 'Conversión y compresión inteligente de imágenes a formatos web estándar.',
    purpose: 'Transformar automáticamente cualquier imagen subida a formatos de banners publicitarios web estándar (728x90, 600x500, 1100x361, 640x200), reduciendo el peso en KB manteniendo alta fidelidad visual.',
    steps: [
      { title: 'Sube tus Imágenes', desc: 'Arrastra tus archivos (PNG, JPG, WebP) al área de carga o selecciónalos desde tu ordenador.' },
      { title: 'Detección Automática', desc: 'El algoritmo analiza las proporciones de tu imagen y sugiere la mejor relación de aspecto para cada formato de banner.' },
      { title: 'Ajuste de Calidad', desc: 'Personaliza la compresión y el formato de salida deseado (WebP optimizado o PNG).' },
      { title: 'Descarga Individual o ZIP', desc: 'Obtén los banners ajustados en un clic o descarga todo el paquete comprimido.' }
    ],
    features: [
      'Procesamiento 100% local en tu navegador (máxima privacidad).',
      'Conversión automática a WebP para máxima aceleración.',
      'Ajuste inteligente de encuadre y recorte automático.',
      'Soporte para múltiples archivos simultáneos.'
    ],
    proTip: 'Aprovecha el formato WebP en tus banners para reducir el peso hasta en un 30% adicional sin pérdida perceptible de calidad, mejorando las métricas Core Web Vitals (LCP) de tu sitio.'
  },
  {
    id: 'textlab',
    name: 'TextLab & SEO Assistant',
    badge: 'Texto y SEO',
    icon: TextFieldsIcon,
    route: '/text-lab',
    description: 'Limpieza, transformación de texto y análisis de palabras clave SEO.',
    purpose: 'Facilitar la edición y optimización de copys publicitarios, artículos de blog y textos web mediante herramientas de limpieza automatizada y conteo de densidad de palabras clave.',
    steps: [
      { title: 'Ingresa tu Texto', desc: 'Pega el texto original en el editor o escribe directamente en el lienzo de trabajo.' },
      { title: 'Aplica Filtros de Limpieza', desc: 'Elimina espacios dobles, limpia etiquetas HTML, convierte mayúsculas/minúsculas o elimina saltos de línea con un clic.' },
      { title: 'Analiza Densidad SEO', desc: 'Consulta la tabla de palabras clave más repetidas (unigramas, bigramas y trigramas) para evitar sobreoptimización.' },
      { title: 'Copia el Resultado', desc: 'Copia el texto limpio y optimizado directo a tu portapapeles o editor CMS.' }
    ],
    features: [
      'Contador en tiempo real de palabras, caracteres, oraciones y párrafos.',
      'Estimador de tiempo de lectura para blogs y publicaciones.',
      'Limpieza rápida de HTML, espacios sobrantes y acentos.',
      'Análisis de densidad de palabras clave de 1, 2 y 3 términos.'
    ],
    proTip: 'Mantén la densidad de tu palabra clave principal por debajo del 2.5% para asegurar un posicionamiento orgánico natural en Google sin incurrir en penalizaciones por keyword stuffing.'
  },
  {
    id: 'utm',
    name: 'UTMCraft Builder',
    badge: 'Marketing y Analytics',
    icon: LinkIcon,
    route: '/utm-builder',
    description: 'Generador de URLs etiquetadas para rastreo en Google Analytics.',
    purpose: 'Construir enlaces estandarizados con parámetros UTM para identificar de manera precisa de dónde proviene el tráfico de tus anuncios en Meta, Google Ads, newsletters y redes sociales.',
    steps: [
      { title: 'Ingresa la URL Destino', desc: 'Escribe la dirección web completa de tu página de aterrizaje o tienda online.' },
      { title: 'Define Fuente, Medio y Campaña', desc: 'Completa los parámetros obligatorios: utm_source (ej. facebook), utm_medium (ej. cpc) y utm_campaign (ej. promo_verano).' },
      { title: 'Agrega Parámetros Opcionales', desc: 'Añade utm_term para palabras clave de anuncios o utm_content para variantes de prueba A/B.' },
      { title: 'Copia tu Enlace Etiquetado', desc: 'Copia la URL lista o activa la limpieza en minúsculas sin espacios.' }
    ],
    features: [
      'Normalización automática de texto a minúsculas.',
      'Historial local de enlaces generados recientemente.',
      'Validación en tiempo real del formato de URL.',
      'Botones de copia rápida para compartir en campañas.'
    ],
    proTip: 'Mantén una nomenclatura en minúsculas y usa guiones bajos (_) o guiones medios (-) en lugar de espacios para mantener informes limpios y ordenados en Google Analytics 4.'
  },
  {
    id: 'color',
    name: 'ColorStudio & WCAG',
    badge: 'Diseño y Accesibilidad',
    icon: PaletteIcon,
    route: '/color-studio',
    description: 'Extractor de paletas de imágenes y verificador de contraste WCAG.',
    purpose: 'Extraer automáticamente los colores predominantes de cualquier imagen de marca y verificar que los contrastes de color entre texto y fondo cumplan los estándares internacionales de accesibilidad WCAG 2.1.',
    steps: [
      { title: 'Sube una Imagen o Selecciona Colores', desc: 'Carga un logo o captura para extraer los códigos HEX de su paleta de color.' },
      { title: 'Prueba Relación de Contraste', desc: 'Selecciona el color del texto y del fondo para calcular el ratio exacto (ej. 4.5:1 o 7:1).' },
      { title: 'Verifica Cumplimiento AA / AAA', desc: 'Comprueba si la combinación aprueba para texto normal, texto grande y componentes de interfaz.' },
      { title: 'Copia Códigos HEX / RGB', desc: 'Copia los valores cromáticos para usarlos en CSS, Tailwind o tu sistema de diseño.' }
    ],
    features: [
      'Algoritmo de extracción cromática inteligente desde imágenes.',
      'Verificación automatizada de estándares WCAG 2.1 Level AA y AAA.',
      'Conversión de formatos HEX, RGB y HSL.',
      'Simulador visual de legibilidad sobre fondos oscuros y claros.'
    ],
    proTip: 'Para textos legibles en web, asegúrate de mantener una relación de contraste mínima de 4.5:1 para texto estándar de 16px y al menos 3.0:1 para encabezados grandes.'
  },
  {
    id: 'aspect',
    name: 'AspectRatio Calculator',
    badge: 'Dimensiones y Maquetación',
    icon: AspectRatioIcon,
    route: '/aspect-ratio',
    description: 'Cálculo de dimensiones proporcionales para imágenes y vídeos.',
    purpose: 'Calcular dimensiones exactas en píxeles al escalar imágenes, vídeos o banners manteniendo una relación de aspecto constante (16:9, 4:3, 1:1, 9:16) para maquetación sin distorsiones.',
    steps: [
      { title: 'Elige una Proporción Preseteada o Personalizada', desc: 'Selecciona presets estándar como 16:9 (YouTube/Vídeo), 1:1 (Cuadrado), 9:16 (Stories) o ingresa W:H.' },
      { title: 'Ingresa Ancho o Alto', desc: 'Escribe el valor en píxeles de una de las dimensiones y observa el cálculo automático de la otra.' },
      { title: 'Inspecciona la Vista Previa Visual', desc: 'Observa el contenedor dinámico para verificar la forma resultante.' },
      { title: 'Consulta la Tabla de Resoluciones', desc: 'Revisa las escalas equivalentes (720p, 1080p, 2K, 4K) generadas al instante.' }
    ],
    features: [
      'Preseteados populares de redes sociales y publicidad.',
      'Cálculo bidireccional en tiempo real.',
      'Visualizador de encuadre escalar.',
      'Tabla comparativa de resoluciones HD y UHD.'
    ],
    proTip: 'Utiliza esta herramienta antes de exportar recursos en herramientas como Figma o Photoshop para asegurar que los marcos de tus publicaciones nunca se vean estirados o recortados.'
  },
  {
    id: 'qr',
    name: 'QR Studio',
    badge: 'Generadores y Utilidades',
    icon: QrCodeIcon,
    route: '/qr-studio',
    description: 'Generador dinámico de códigos QR para enlaces, Wi-Fi y WhatsApp.',
    purpose: 'Crear códigos QR totalmente personalizados para URLs web, conexiones Wi-Fi instantáneas, chats de WhatsApp con mensaje predeterminado y textos planos.',
    steps: [
      { title: 'Selecciona el Tipo de Contenido', desc: 'Elige entre enlace web, acceso Wi-Fi, WhatsApp directo o texto en las pestañas.' },
      { title: 'Rellena los Datos Requeridos', desc: 'Introduce el número con código de país para WhatsApp, o SSID y contraseña para redes Wi-Fi.' },
      { title: 'Personaliza Estilo y Colores', desc: 'Ajusta los colores de primer plano, fondo, margen y el nivel de corrección de errores.' },
      { title: 'Descarga en PNG o Vector SVG', desc: 'Exporta en PNG para uso digital o SVG vectorizado de alta calidad para impresiones.' }
    ],
    features: [
      'Generación de QR para redes Wi-Fi con cifrado WPA/WPA2.',
      'Enlaces directos a WhatsApp con mensaje de saludo predeterminado.',
      'Nivel ajustable de corrección de errores (L, M, Q, H).',
      'Exportación en formato SVG vectorial infinito para impresión gráfica.'
    ],
    proTip: 'Aumenta el nivel de corrección de errores a "H" (High) si planeas imprimir el código QR en volantes o carteles físicos donde pueda sufrir arrugas o desgaste.'
  },
  {
    id: 'gradient',
    name: 'GradientStudio',
    badge: 'Estilo y CSS',
    icon: GradientIcon,
    route: '/gradient-studio',
    description: 'Diseñador de gradientes CSS multinivel y exportación a Tailwind.',
    purpose: 'Diseñar fondos de gradiente de color CSS (lineales y radiales), seleccionar presets de alta estética y copiar código limpio listo para usar en hojas de estilo o proyectos Tailwind CSS.',
    steps: [
      { title: 'Elige un Preset o Crea desde Cero', desc: 'Explora la galería de gradientes de diseñador o configura tus propios puntos de color.' },
      { title: 'Ajusta Puntos y Ángulos', desc: 'Modifica la posición de las paradas de color, ángulos de dirección (deg) o tipo radial.' },
      { title: 'Visualiza en el Lienzo Interactivo', desc: 'Observa la vista previa en pantalla completa para evaluar el impacto en interfaz.' },
      { title: 'Copia Código CSS o Tailwind', desc: 'Copia la regla linear-gradient o la clase arbitraria de Tailwind con un clic.' }
    ],
    features: [
      'Gradientes lineales y radiales personalizables.',
      'Soporte para múltiples paradas de color (color stops).',
      'Generación instantánea de clases Tailwind CSS.',
      'Descarga de imágenes de fondo en resolución HD.'
    ],
    proTip: 'Descarga el gradiente resultante en imagen HD para usarlo como fondo en presentaciones ejecitivas o encabezados de banners promocionales.'
  },
  {
    id: 'lorem',
    name: 'LoremCraft Microcopy',
    badge: 'Contenido y Copywriting',
    icon: ArticleIcon,
    route: '/lorem-generator',
    description: 'Generador de texto de relleno Lorem Ipsum y frases comerciales en español.',
    purpose: 'Generar párrafos de prueba Lorem Ipsum tradicionales o frases comerciales orientadas a marketing en español para maquetas web y botones de llamada a la acción (CTA).',
    steps: [
      { title: 'Selecciona el Tipo de Contenido', desc: 'Elige entre "Lorem Ipsum" clásico, "Comercial en Español" o "Botones CTA".' },
      { title: 'Ajusta Cantidad y Unidades', desc: 'Define si necesitas párrafos, oraciones o palabras y ajusta el número con el deslizador.' },
      { title: 'Envoltorio HTML Opcional', desc: 'Activa el interruptor si deseas incluir etiquetas <p> o <button> alrededor del texto.' },
      { title: 'Copia o Descarga en TXT', desc: 'Copia al portapapeles o guarda como archivo plano de texto.' }
    ],
    features: [
      'Generación de párrafos, oraciones y palabras aisladas.',
      'Microcopy comercial redactado en español para un prototipado más realista.',
      'Frases persuasivas para botones de conversión (CTA).',
      'Envoltorio en marcado HTML estandarizado.'
    ],
    proTip: 'Usa el modo "Comercial en Español" en tus demostraciones a clientes locales para que evalúen la tipografía con palabras reales en lugar del latín de relleno.'
  },
  {
    id: 'shadow',
    name: 'ShadowStudio',
    badge: 'Estilo y CSS',
    icon: LayersIcon,
    route: '/shadow-studio',
    description: 'Generador de sombras CSS box-shadow y efectos Glassmorphism.',
    purpose: 'Crear sombras CSS avanzadas multicapa (`box-shadow`), simular paneles de cristal translúcido (*Glassmorphism*) y exportar código limpio para proyectos web.',
    steps: [
      { title: 'Selecciona un Preset o Agrega Capas', desc: 'Elige elevaciones suaves, neón o crea capas personalizadas.' },
      { title: 'Configura Parámetros de Sombra', desc: 'Ajusta Offset X, Offset Y, Difuminado (Blur), Expansión (Spread) y Opacidad.' },
      { title: 'Activa Efecto Glassmorphism', desc: 'Habilita la transparencia y el desenfoque de fondo (`backdrop-filter: blur`).' },
      { title: 'Copia Código CSS o Tailwind', desc: 'Copia las reglas CSS o las clases arbitrarias de Tailwind directamente a tu proyecto.' }
    ],
    features: [
      'Creación de sombras multinivel avanzadas.',
      'Modo interior (Inset) para botones o campos de entrada.',
      'Simulador de efecto Glassmorphism en tiempo real.',
      'Copia en un clic para CSS puro y Tailwind CSS.'
    ],
    proTip: 'Combina una sombra definida cercana con una muy difuminada en la segunda capa para lograr una sensación de profundidad 3D orgánica en tus tarjetas e interfaces oscuras.'
  },
  {
    id: 'button-forge',
    name: 'Button & Badge Forge',
    badge: 'Desarrollo UI',
    icon: TouchIcon,
    route: '/button-forge',
    description: 'Creador de botones e insignias interactivas con efectos hover y estados.',
    purpose: 'Diseñar y personalizar componentes de botón e insignias UI con estilos sólidos, gradientes, glassmorphism o neón, y exportación limpia a Tailwind CSS, HTML/CSS y React.',
    steps: [
      { title: 'Personaliza el Texto e Icono', desc: 'Edita el mensaje del botón e integra iconos descriptivos a la izquierda o derecha.' },
      { title: 'Selecciona la Estructura Visual', desc: 'Elige entre botones Sólidos, Gradientes, Delineados (Outline), Soft o Glassmorphism.' },
      { title: 'Configura Interacciones y Efectos', desc: 'Añade animaciones hover como elevación translateY, zoom suave o resplandor de neón.' },
      { title: 'Exporta el Código', desc: 'Copia el código generado listo para usar en Tailwind CSS, HTML o React TSX.' }
    ],
    features: [
      'Visualizador interactivo con estados hover, active y disabled.',
      'Efectos de elevación, resplandor y escalado.',
      'Soporte para colores de marca y gradientes personalizados.',
      'Exportador para Tailwind CSS, HTML+CSS y React Component.'
    ],
    proTip: 'Usa la variante Soft con baja opacidad en el fondo para acciones secundarias o de apoyo, manteniendo la jerarquía visual enfocada en el botón de llamada a la acción principal.'
  },
  {
    id: 'card-builder',
    name: 'UI Card Builder',
    badge: 'Desarrollo UI',
    icon: CardIcon,
    route: '/card-builder',
    description: 'Generador de tarjetas de producto, perfiles, precios y artículos.',
    purpose: 'Crear maquetas de tarjetas UI listas para producción con código responsive adaptado para comercio electrónico, paneles SaaS y blogs.',
    steps: [
      { title: 'Elige el Tipo de Tarjeta', desc: 'Selecciona entre Tarjeta de Producto, Perfil de Usuario, Tabla de Precios o Post de Blog.' },
      { title: 'Edita el Contenido y la Imagen', desc: 'Ingresa el título, descripción, etiquetas badge y enlaces de imagen.' },
      { title: 'Ajusta Bordes y Sombras', desc: 'Ajusta el radio de esquina (border-radius) y los colores acento.' },
      { title: 'Obtén el Código Responsive', desc: 'Copia el marcado HTML con clases de Tailwind CSS adaptado para móviles y escritorio.' }
    ],
    features: [
      '4 diseños de componentes listos para producción.',
      'Personalización de colores acento, badges y precios.',
      'Lienzo de prueba interactivo con vista clara y oscura.',
      'Generación de código estructurado en Tailwind y HTML.'
    ],
    proTip: 'Asegúrate de incluir las clases `line-clamp-2` de Tailwind CSS en las descripciones de las tarjetas para mantener una altura uniforme en tus cuadrículas de catálogo.'
  },
  {
    id: 'clip-path',
    name: 'CSS Clip-Path Studio',
    badge: 'Diseño CSS Avanzado',
    icon: ShapeIcon,
    route: '/clip-path-studio',
    description: 'Generador de recortes geométricos, organic blobs y Glassmorphism.',
    purpose: 'Diseñar formas complejas en CSS usando la propiedad `clip-path` con polígonos, esquinas orgánicas asimétricas (*fancy border-radius*) y paneles de cristal translúcido.',
    steps: [
      { title: 'Selecciona la Herramienta', desc: 'Elige entre Recorte Geométrico, Organic Blob o Panel Glassmorphism.' },
      { title: 'Modifica Parámetros', desc: 'Usa los deslizadores para ajustar vértices poligonales o los 8 valores de radio asimétrico.' },
      { title: 'Prueba sobre Fondos Reales', desc: 'Visualiza la forma sobre imágenes de fondo o gradientes para evaluar contraste.' },
      { title: 'Copia el Código CSS o Tailwind', desc: 'Copia la regla `clip-path: polygon(...)` o la clase arbitraria de Tailwind.' }
    ],
    features: [
      'Presets poligonales: hexágonos, estrellas, flechas y biseles cyberpunk.',
      'Generador de bordes orgánicos fluido de 8 puntos.',
      'Simulador de cristal con desenfoque de fondo (backdrop blur).',
      'Exportación directa a CSS y clases de Tailwind CSS.'
    ],
    proTip: 'Usa recortes poligonales biselados en tus avatares o tarjetas de tecnología para darles una estética futurista y moderna sin cargar archivos SVG pesados.'
  },
  {
    id: 'typescale',
    name: 'TypeScale & Fluid Typography',
    badge: 'Desarrollo Frontend',
    icon: TextFieldsIcon,
    route: '/typescale-generator',
    description: 'Calculadora de escalas tipográficas armónicas y reglas CSS Clamp().',
    purpose: 'Establecer jerarquías tipográficas proporcionales y generar código de tipografía fluida para que los títulos se escalen suavemente según la pantalla sin media queries.',
    steps: [
      { title: 'Selecciona la Proporción', desc: 'Elige un ratio escalar como Perfect Fourth (1.333) o Major Third (1.250).' },
      { title: 'Establece el Tamaño Base', desc: 'Ajusta el tamaño base en píxeles (por defecto 16px para el cuerpo de texto).' },
      { title: 'Prueba tu Texto de Muestra', desc: 'Visualiza la escala generada desde H1 hasta texto pequeño.' },
      { title: 'Exporta Variables o CSS Clamp()', desc: 'Copia el bloque de variables CSS, la configuración de Tailwind o las reglas `clamp()`.' }
    ],
    features: [
      '8 proporciones tipográficas matemáticas reconocidas.',
      'Previsualizador completo de escala H1 a Small.',
      'Generador automático de funciones CSS `clamp(min, val, max)`.',
      'Exportador para `:root` CSS y `tailwind.config.js`.'
    ],
    proTip: 'Aplica el ratio Perfect Fourth (1.333) en sitios web de contenido o blogs para lograr un contraste óptimo entre los títulos y el cuerpo de texto.'
  }
];

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentGuide = appGuides[activeTab];
  const IconComponent = currentGuide.icon;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Guía Completa de Uso de DesignKit Studio",
    "description": "Manual y guía paso a paso para utilizar todas las herramientas de DesignKit Studio: optimización de banners, laboratorio de texto SEO, generador UTM, accesibilidad WCAG y más.",
    "step": currentGuide.steps.map((s, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": s.title,
      "text": s.desc
    }))
  };

  return (
    <>
      <Head>
        <title>Guía de Uso Completa - DesignKit Studio</title>
        <meta name="description" content="Aprende a usar todas las aplicaciones de DesignKit Studio: Optimizador de Banners, TextLab, UTMCraft, ColorStudio, QR Studio, GradientStudio y más." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
        {/* Safe Lateral Ads */}
        <LateralAds />

        {/* Page Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Chip icon={<BookOpenIcon size={16} />} label="Centro de Ayuda" color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
            Guía de Uso de DesignKit Studio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', opacity: 0.85 }}>
            Selecciona la herramienta que deseas utilizar para consultar su tutorial paso a paso, características clave y consejos profesionales.
          </Typography>

          {/* Anuncio Horizontal Superior */}
          <AdPlaceholder type="horizontal" label="Superior" />
        </Box>

        {/* Submenu Navigation Bar (App Selector) */}
        <Paper
          variant="outlined"
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: 'background.paper',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            p: 1
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                minHeight: 48,
                borderRadius: 2,
                px: 2,
                mx: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                }
              }
            }}
          >
            {appGuides.map((guide, idx) => {
              const TabIcon = guide.icon;
              return (
                <Tab
                  key={guide.id}
                  icon={<TabIcon size={18} />}
                  iconPosition="start"
                  label={guide.name}
                  id={`guide-tab-${idx}`}
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* Selected App Guide Content */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Header Info Banner */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: 'rgba(59, 130, 246, 0.15)',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={26} />
              </Box>
              <Box>
                <Chip label={currentGuide.badge} size="small" color="primary" variant="outlined" sx={{ mb: 0.5, fontSize: '0.7rem', fontWeight: 700 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {currentGuide.name}
                </Typography>
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to={currentGuide.route}
              variant="contained"
              color="primary"
              endIcon={<ArrowRightIcon size={18} />}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Abrir Herramienta
            </Button>
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
            {currentGuide.purpose}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Step-by-Step Instructions */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpenIcon size={20} className="text-blue-500" /> Instrucciones Paso a Paso
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {currentGuide.steps.map((step, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2.5, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}>
                        {idx + 1}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Key Features & Pro Tip Grid */}
          <Grid container spacing={3}>
            {/* Features list */}
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#080C14', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon size={18} color="#34d399" /> Funcionalidades Destacadas
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {currentGuide.features.map((feat, fIdx) => (
                    <Typography component="li" key={fIdx} variant="body2" color="text.secondary">
                      {feat}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Pro Tip Box */}
            <Grid item xs={12} md={5}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon size={18} /> Consejo Pro de Optimización
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  {currentGuide.proTip}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Anuncio Horizontal Inferior */}
        <Box sx={{ mt: 6 }}>
          <AdPlaceholder type="horizontal" label="Inferior" />
        </Box>
      </Container>
    </>
  );
};

export default GuidePage;
