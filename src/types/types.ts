export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number;
  format: ImageFormat;
}

export interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  size: number;
  format: ImageFormat;
  blob: Blob;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export interface CompressOptions {
  quality: number; // 0-100
}

export interface ConvertOptions {
  format: ImageFormat;
  quality?: number;
}

export type ToolType = "resize" | "compress" | "convert" | "base64";

export interface Base64Result {
  dataUrl: string;
  base64: string;
  size: number;
}
