import * as omggifModule from 'omggif';
import * as gifencModule from 'gifenc';
import gifencDefault from 'gifenc';

interface GifEncoderInstance {
  writeFrame: (
    index: Uint8Array,
    width: number,
    height: number,
    opts?: { palette?: number[][]; delay?: number; transparent?: boolean; transparentIndex?: number }
  ) => void;
  finish: () => void;
  bytes: () => Uint8Array;
}

type GifEncoderFactory = () => GifEncoderInstance;
type QuantizeFunction = (rgba: Uint8ClampedArray | Uint8Array, maxColors: number) => number[][];
type ApplyPaletteFunction = (rgba: Uint8ClampedArray | Uint8Array, palette: number[][]) => Uint8Array;

interface OmggifReaderInstance {
  numFrames: () => number;
  width: number;
  height: number;
  frameInfo: (frameIndex: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
    disposal: number;
    delay: number;
  };
  decodeAndBlitFrameRGBA: (frameIndex: number, pixels: Uint8ClampedArray) => void;
}

type OmggifReaderConstructor = new (data: Uint8Array) => OmggifReaderInstance;

function createGifEncoder(): GifEncoderInstance {
  const encFn =
    (gifencModule as Record<string, unknown>).GIFEncoder ||
    ((gifencModule as Record<string, unknown>).default as Record<string, unknown> | undefined)?.GIFEncoder ||
    (typeof gifencDefault === 'function' ? gifencDefault : undefined) ||
    (gifencDefault as Record<string, unknown> | undefined)?.GIFEncoder;

  if (typeof encFn !== 'function') {
    throw new Error('GIFEncoder no es una función. Error al inicializar el codificador GIF.');
  }
  return (encFn as GifEncoderFactory)();
}

function getQuantizeFn(): QuantizeFunction {
  const fn =
    (gifencModule as Record<string, unknown>).quantize ||
    ((gifencModule as Record<string, unknown>).default as Record<string, unknown> | undefined)?.quantize ||
    (gifencDefault as Record<string, unknown> | undefined)?.quantize;

  if (typeof fn !== 'function') {
    throw new Error('quantize no está disponible.');
  }
  return fn as QuantizeFunction;
}

function getApplyPaletteFn(): ApplyPaletteFunction {
  const fn =
    (gifencModule as Record<string, unknown>).applyPalette ||
    ((gifencModule as Record<string, unknown>).default as Record<string, unknown> | undefined)?.applyPalette ||
    (gifencDefault as Record<string, unknown> | undefined)?.applyPalette;

  if (typeof fn !== 'function') {
    throw new Error('applyPalette no está disponible.');
  }
  return fn as ApplyPaletteFunction;
}

function createGifReader(byteArray: Uint8Array): OmggifReaderInstance {
  const readerClass =
    (omggifModule as Record<string, unknown>).GifReader ||
    ((omggifModule as Record<string, unknown>).default as Record<string, unknown> | undefined)?.GifReader ||
    (omggifModule as Record<string, unknown>).default;

  if (typeof readerClass !== 'function') {
    throw new Error('GifReader no está disponible.');
  }
  return new (readerClass as OmggifReaderConstructor)(byteArray);
}

export interface BannerFormat {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  useCase: string;
}

export const GIF_BANNER_FORMATS: BannerFormat[] = [
  { name: 'Banner 600x500', width: 600, height: 500, aspectRatio: 1.2, useCase: 'Banner Cuadrado Estándar' },
  { name: 'Banner 640x200', width: 640, height: 200, aspectRatio: 3.2, useCase: 'Banner Rectangular Horizontal' },
  { name: 'Banner 728x90', width: 728, height: 90, aspectRatio: 8.09, useCase: 'Banner Leaderboard Horizontal' },
  { name: 'Banner 420x200', width: 420, height: 200, aspectRatio: 2.1, useCase: 'Banner Horizontal Mediano' },
  { name: 'Banner 1100x361', width: 1100, height: 361, aspectRatio: 3.05, useCase: 'Banner de Cabecera Grande' },
  { name: 'Banner 630x250', width: 630, height: 250, aspectRatio: 2.52, useCase: 'Banner de Contenido Ancho' },
  { name: 'Robapáginas 300x250', width: 300, height: 250, aspectRatio: 1.2, useCase: 'IAB Medium Rectangle (MPU)' },
  { name: 'Skyscraper 160x600', width: 160, height: 600, aspectRatio: 0.27, useCase: 'IAB Rascacielos Lateral' },
];

export const MAX_GIF_BYTES = 180 * 1024; // 184,320 bytes (180 KB strict ceiling)

export interface OptimizationResult {
  blob: Blob;
  size: number;
  width: number;
  height: number;
  originalFramesCount: number;
  exportedFramesCount: number;
  colorsUsed: number;
  durationSeconds: number;
  isUnder180KB: boolean;
  compressionRatio: number;
}

export interface OptimizationProgress {
  phase: 'decoding' | 'resizing' | 'encoding' | 'refining' | 'completed';
  percent: number;
  message: string;
}

interface DecodedFrame {
  canvas: HTMLCanvasElement;
  delayMs: number;
}

/**
 * Decodes all frames of an animated GIF respecting disposal methods and delay timings.
 */
export async function decodeGifFrames(
  arrayBuffer: ArrayBuffer,
  onProgress?: (progress: number) => void
): Promise<{ frames: DecodedFrame[]; width: number; height: number; totalDurationMs: number }> {
  const byteArray = new Uint8Array(arrayBuffer);
  const reader = createGifReader(byteArray);

  const totalFrames = reader.numFrames();
  const gifWidth = reader.width;
  const gifHeight = reader.height;

  if (totalFrames <= 0) {
    throw new Error('El archivo GIF no contiene fotogramas válidos.');
  }

  // Work canvases for compositing
  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = gifWidth;
  compositeCanvas.height = gifHeight;
  const compositeCtx = compositeCanvas.getContext('2d', { willReadFrequently: true });
  if (!compositeCtx) throw new Error('No se pudo inicializar el contexto 2D.');

  // Canvas for previous frame restore (disposal method 3)
  const previousCanvas = document.createElement('canvas');
  previousCanvas.width = gifWidth;
  previousCanvas.height = gifHeight;
  const previousCtx = previousCanvas.getContext('2d', { willReadFrequently: true });

  const tempPatchCanvas = document.createElement('canvas');
  const tempPatchCtx = tempPatchCanvas.getContext('2d', { willReadFrequently: true });

  const decodedFrames: DecodedFrame[] = [];
  let totalDurationMs = 0;

  for (let i = 0; i < totalFrames; i++) {
    const frameInfo = reader.frameInfo(i);
    // delay in omggif is hundredths of a second (10ms units)
    let delayMs = (frameInfo.delay || 10) * 10;
    if (delayMs < 20) delayMs = 100; // Normal browser fallback for 0 or sub-20ms delay
    totalDurationMs += delayMs;

    // Save previous state if disposal is 3 (restore to previous)
    if (frameInfo.disposal === 3 && previousCtx) {
      previousCtx.clearRect(0, 0, gifWidth, gifHeight);
      previousCtx.drawImage(compositeCanvas, 0, 0);
    }

    // Decode current frame RGBA pixels
    const frameWidth = frameInfo.width;
    const frameHeight = frameInfo.height;
    const frameData = new Uint8ClampedArray(frameWidth * frameHeight * 4);
    reader.decodeAndBlitFrameRGBA(i, frameData);

    // Render frame patch onto temporary canvas
    tempPatchCanvas.width = frameWidth;
    tempPatchCanvas.height = frameHeight;
    const imgData = new ImageData(frameData, frameWidth, frameHeight);
    tempPatchCtx?.putImageData(imgData, 0, 0);

    // Blit onto composite canvas at frame (x, y)
    compositeCtx.drawImage(tempPatchCanvas, frameInfo.x, frameInfo.y);

    // Clone current composited state
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = gifWidth;
    frameCanvas.height = gifHeight;
    const frameCtx = frameCanvas.getContext('2d');
    if (frameCtx) {
      frameCtx.drawImage(compositeCanvas, 0, 0);
    }

    decodedFrames.push({
      canvas: frameCanvas,
      delayMs,
    });

    // Handle disposal for subsequent frame
    if (frameInfo.disposal === 2) {
      // Restore to background (clear frame rectangle)
      compositeCtx.clearRect(frameInfo.x, frameInfo.y, frameWidth, frameHeight);
    } else if (frameInfo.disposal === 3 && previousCtx) {
      // Restore to previous
      compositeCtx.clearRect(0, 0, gifWidth, gifHeight);
      compositeCtx.drawImage(previousCanvas, 0, 0);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFrames) * 100));
    }
  }

  return {
    frames: decodedFrames,
    width: gifWidth,
    height: gifHeight,
    totalDurationMs,
  };
}

/**
 * Resizes and crops a source frame canvas to the target banner dimensions.
 */
function renderFrameToTarget(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  fit: 'cover' | 'contain' = 'cover',
  backgroundColor: string = '#000000'
): HTMLCanvasElement {
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = targetWidth;
  targetCanvas.height = targetHeight;
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return targetCanvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  if (fit === 'contain') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const scale = Math.min(targetWidth / srcW, targetHeight / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const drawX = (targetWidth - drawW) / 2;
    const drawY = (targetHeight - drawH) / 2;

    ctx.drawImage(sourceCanvas, drawX, drawY, drawW, drawH);
  } else {
    // 'cover' - smart center crop
    const scale = Math.max(targetWidth / srcW, targetHeight / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const drawX = (targetWidth - drawW) / 2;
    const drawY = (targetHeight - drawH) / 2;

    ctx.drawImage(sourceCanvas, drawX, drawY, drawW, drawH);
  }

  return targetCanvas;
}

/**
 * Encodes a subset of frames with a specific color count and delay multiplier.
 */
function encodeGifWithSettings(
  resizedCanvases: HTMLCanvasElement[],
  delaysMs: number[],
  targetWidth: number,
  targetHeight: number,
  maxColors: number,
  step: number
): Uint8Array {
  const encoder = createGifEncoder();
  const quantize = getQuantizeFn();
  const applyPalette = getApplyPaletteFn();

  for (let i = 0; i < resizedCanvases.length; i += step) {
    const canvas = resizedCanvases[i];
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) continue;

    const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const rgba = imgData.data;

    // Generate optimal color palette for this frame
    const palette = quantize(rgba, maxColors);
    const indexedPixels = applyPalette(rgba, palette);

    // Sum delays of skipped frames to keep total animation duration identical
    let accumulatedDelay = 0;
    for (let s = 0; s < step && i + s < delaysMs.length; s++) {
      accumulatedDelay += delaysMs[i + s];
    }
    // gifenc delay is in milliseconds
    const frameDelayMs = Math.max(20, accumulatedDelay);

    encoder.writeFrame(indexedPixels, targetWidth, targetHeight, {
      palette,
      delay: frameDelayMs,
    });
  }

  encoder.finish();
  return encoder.bytes();
}

/**
 * Core Optimizer:
 * Systematically iterates over quality, palette and frame budgeting to GUARANTEE
 * that output stays <= 180 KB (or minimal size) while preserving exact dimensions.
 */
export async function optimizeGifBanner(
  arrayBuffer: ArrayBuffer,
  format: BannerFormat,
  options: {
    fit?: 'cover' | 'contain';
    maxBytes?: number;
    onProgress?: (progress: OptimizationProgress) => void;
  } = {}
): Promise<OptimizationResult> {
  const { fit = 'cover', maxBytes = MAX_GIF_BYTES, onProgress } = options;
  const targetWidth = format.width;
  const targetHeight = format.height;

  // Step 1: Decode GIF
  onProgress?.({
    phase: 'decoding',
    percent: 10,
    message: 'Decodificando fotogramas y temporizaciones...',
  });

  const { frames, totalDurationMs } = await decodeGifFrames(arrayBuffer, (decProgress) => {
    onProgress?.({
      phase: 'decoding',
      percent: Math.round(10 + decProgress * 0.3),
      message: `Extrayendo fotogramas (${decProgress}%)...`,
    });
  });

  const originalFramesCount = frames.length;

  // Step 2: Resize each frame to exact banner format dimensions
  onProgress?.({
    phase: 'resizing',
    percent: 45,
    message: `Adaptando fotogramas a ${targetWidth}×${targetHeight}px (${fit})...`,
  });

  const resizedCanvases: HTMLCanvasElement[] = [];
  const frameDelays: number[] = [];

  for (let i = 0; i < frames.length; i++) {
    const resized = renderFrameToTarget(frames[i].canvas, targetWidth, targetHeight, fit);
    resizedCanvases.push(resized);
    frameDelays.push(frames[i].delayMs);
  }

  // Step 3: Multi-pass compression to achieve <= 180 KB
  onProgress?.({
    phase: 'encoding',
    percent: 60,
    message: 'Calculando presupuesto de fotogramas y compresión de color...',
  });

  // Iteration profiles: from pristine highest quality to aggressive optimization
  // [maxColors, frameStep]
  const passProfiles: Array<{ colors: number; step: number; desc: string }> = [
    { colors: 256, step: 1, desc: 'Calidad Máxima (256 colores, 100% fotogramas)' },
    { colors: 192, step: 1, desc: 'Alta Calidad (192 colores, 100% fotogramas)' },
    { colors: 128, step: 1, desc: 'Calidad Balanceada (128 colores, 100% fotogramas)' },
    { colors: 96, step: 1, desc: 'Optimización de Paleta (96 colores)' },
    { colors: 64, step: 1, desc: 'Optimización de Paleta (64 colores)' },
    // If high frame count, step frames while preserving duration
    { colors: 128, step: 2, desc: 'Muestreo Inteligente 15 FPS (128 colores)' },
    { colors: 96, step: 2, desc: 'Muestreo Inteligente 15 FPS (96 colores)' },
    { colors: 64, step: 2, desc: 'Muestreo Inteligente 15 FPS (64 colores)' },
    { colors: 48, step: 2, desc: 'Compresión Publicitaria (48 colores, 15 FPS)' },
    { colors: 32, step: 2, desc: 'Compresión Publicitaria (32 colores, 15 FPS)' },
    { colors: 64, step: 3, desc: 'Presupuesto IAB Estricto (64 colores, paso 3)' },
    { colors: 32, step: 3, desc: 'Presupuesto IAB Estricto (32 colores, paso 3)' },
    { colors: 24, step: 4, desc: 'Ultra-Compacto IAB (24 colores, paso 4)' },
  ];

  let bestBytes: Uint8Array | null = null;
  let bestColors = 256;
  let bestStep = 1;

  for (let p = 0; p < passProfiles.length; p++) {
    const profile = passProfiles[p];

    // Skip step 2 or 3 if original GIF has very few frames (e.g. <= 6 frames)
    if (profile.step > 1 && originalFramesCount <= 6) {
      continue;
    }

    onProgress?.({
      phase: 'refining',
      percent: Math.min(95, Math.round(65 + (p / passProfiles.length) * 30)),
      message: `Probando ${profile.desc}...`,
    });

    const candidateBytes = encodeGifWithSettings(
      resizedCanvases,
      frameDelays,
      targetWidth,
      targetHeight,
      profile.colors,
      profile.step
    );

    bestBytes = candidateBytes;
    bestColors = profile.colors;
    bestStep = profile.step;

    // Check if target <= 180 KB achieved
    if (candidateBytes.length <= maxBytes) {
      break;
    }
  }

  if (!bestBytes) {
    throw new Error('Error al procesar la secuencia del banner GIF.');
  }

  const outputBlob = new Blob([bestBytes], { type: 'image/gif' });
  const exportedFramesCount = Math.ceil(originalFramesCount / bestStep);
  const compressionRatio = arrayBuffer.byteLength > 0 ? (1 - bestBytes.length / arrayBuffer.byteLength) * 100 : 0;

  onProgress?.({
    phase: 'completed',
    percent: 100,
    message: 'Banner GIF optimizado con éxito.',
  });

  return {
    blob: outputBlob,
    size: bestBytes.length,
    width: targetWidth,
    height: targetHeight,
    originalFramesCount,
    exportedFramesCount,
    colorsUsed: bestColors,
    durationSeconds: Number((totalDurationMs / 1000).toFixed(2)),
    isUnder180KB: bestBytes.length <= maxBytes,
    compressionRatio: Number(compressionRatio.toFixed(1)),
  };
}
