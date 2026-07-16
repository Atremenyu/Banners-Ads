# ⚡ Banner Optimizer - Recortador y Optimizador de Imágenes

¡Optimiza, recorta y comprime tus imágenes para formatos de banner estándar en segundos de forma 100% local, privada y ultrarrápida!

**Banner Optimizer** es una herramienta web profesional diseñada para diseñadores, publicistas y desarrolladores web que necesitan adaptar imágenes a dimensiones específicas de banners publicitarios (Google AdSense, IAB, redes sociales) minimizando al máximo el peso del archivo sin comprometer la calidad visual.

---

## 🚀 Características Principales

### 1. 📐 Selección Inteligente de Formatos Estándar
*   **Formatos Google AdSense e IAB**: Incluye dimensiones predefinidas populares como:
    *   *Robapáginas Medio* (300x250)
    *   *Megabanner* (728x90)
    *   *Rascacielos Ancho* (160x600)
    *   *Banner Grande de Móvil* (320x100)
    *   *Media Página* (300x600)
*   **Dimensiones Personalizadas**: Define tu propio ancho y alto en píxeles para adaptarse a cualquier requerimiento.

### 2. 🔍 Recorte Interactivo (Visual Preview)
*   Vista previa en tiempo real con un contenedor interactivo de recorte.
*   Permite mover, centrar y encuadrar perfectamente la imagen original dentro del formato objetivo seleccionado.

### 3. 📉 Control de Compresión y Formato de Salida
*   **Formatos Soportados**: Exporta tus imágenes en formatos modernos optimizados como **WebP**, **JPEG** o **PNG**.
*   **Ajuste de Calidad Dinámico**: Selector deslizable para regular la calidad de compresión (0% a 100%) y equilibrar el tamaño del archivo con el acabado visual.

### 4. 📊 Comparador de Tamaño Lado a Lado (Original vs. Optimizado)
*   **Estadísticas de Peso Detalladas**: Muestra instantáneamente el tamaño original del archivo vs. el tamaño optimizado una vez procesado.
*   **Medición Porcentual**: Te indica con exactitud qué porcentaje de peso original representa la versión optimizada (por ejemplo, *15% del peso original*).
*   **Barra Visual de Capacidad**: Una pista visual interactiva de color azul y verde que resalta el espacio liberado y la relación de compresión.

### 5. 🏆 Panel Resumen de Optimización Global
*   Cuando procesas múltiples imágenes a la vez, el sistema genera un **Dashboard Consolidado**.
*   **Ahorro de Peso Total**: Sumariza cuántos kilobytes o megabytes exactos has ahorrado en total.
*   **Gráfico de Reducción Promedio**: Un indicador circular dinámico que muestra el porcentaje promedio de espacio liberado globalmente.

### 6. 📦 Descargas Flexibles
*   **Descarga Individual**: Botón directo para bajar cada banner optimizado de forma individual con nombres personalizados.
*   **Descarga Masiva (ZIP)**: Empaqueta todos tus banners optimizados en un único archivo comprimido `.zip` con un solo clic.

### 7. 🔒 Privacidad de Datos y Procesamiento 100% Local
*   **Sin Servidores Externos**: Todo el procesamiento, recorte, renderizado en Canvas y compresión de archivos se realiza localmente en el propio navegador web del usuario.
*   Tus imágenes e información privada **nunca se cargan en internet**, haciéndolo 100% seguro y confidencial.

---

## 🛠️ Tecnologías Utilizadas

*   **Vite** - Servidor de desarrollo y empaquetador ultrarrápido.
*   **React (TypeScript)** - Biblioteca declarativa para la construcción de interfaces robustas y tipado seguro.
*   **Material-UI (MUI v5)** - Componentes de diseño elegantes y responsivos para una experiencia de usuario fluida.
*   **JSZip** - Creación de archivos comprimidos ZIP directamente desde el navegador web.
*   **Vite React SSG** - Generación de Sitios Estáticos (SSG) para una carga inicial instantánea y una indexación SEO perfecta.
*   **Lucide Icons / MUI Icons** - Conjunto de iconografía moderna para facilitar la navegación visual.

---

## 💻 Desarrollo Local

Para correr el proyecto en tu máquina local:

### Requisitos previos
*   Disponer de [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### Pasos de Instalación

1.  **Clonar o descargar** este repositorio de código.
2.  Instalar las dependencias de node:
    ```bash
    npm install
    ```
3.  Arrancar el servidor de desarrollo local:
    ```bash
    npm run dev
    ```
4.  Abrir en tu navegador web la dirección asignada (normalmente `http://localhost:3000`).

### Construcción para Producción

Para compilar y realizar la generación estática (SSG):
```bash
npm run build
```
Los archivos optimizados resultantes se generarán dentro del directorio `dist/`.

---

Creado con precisión y atención al detalle para ofrecer la mejor velocidad de rendimiento web y optimización de recursos gráficos. ¡Disfruta de banners más ligeros y páginas mucho más rápidas!
