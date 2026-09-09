declare module 'gifenc' {
  export interface GifEncoderInstance {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      opts?: {
        palette?: number[][];
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        dispose?: number;
      }
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
    reset: () => void;
  }

  export function GIFEncoder(opts?: { initialCapacity?: number; auto?: boolean }): GifEncoderInstance;
  export function quantize(rgba: Uint8ClampedArray | Uint8Array, maxColors: number): number[][];
  export function applyPalette(rgba: Uint8ClampedArray | Uint8Array, palette: number[][]): Uint8Array;
  export function nearestColor(color: number[], palette: number[][]): number[];
  export function nearestColorIndex(color: number[], palette: number[][]): number;
  export function snapColorsToPalette(rgba: Uint8ClampedArray | Uint8Array, palette: number[][]): Uint8Array;

  const defaultExport: typeof GIFEncoder;
  export default defaultExport;
}
