import type {
  ImageData,
  ProcessedImage,
  ResizeOptions,
  CompressOptions,
  ConvertOptions,
  ImageFormat,
  Base64Result,
} from "../types/types";

/**
 * Load an image file and extract its metadata
 */
export async function loadImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        format: file.type as ImageFormat,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Resize an image to specified dimensions
 */
export async function resizeImage(
  imageData: ImageData,
  options: ResizeOptions
): Promise<ProcessedImage> {
  const img = new Image();
  img.src = imageData.url;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  let { width, height } = options;

  if (options.maintainAspectRatio) {
    const aspectRatio = imageData.width / imageData.height;
    if (width && !height) {
      height = Math.round(width / aspectRatio);
    } else if (height && !width) {
      width = Math.round(height * aspectRatio);
    } else if (width && height) {
      // Fit within bounds while maintaining aspect ratio
      const targetRatio = width / height;
      if (aspectRatio > targetRatio) {
        height = Math.round(width / aspectRatio);
      } else {
        width = Math.round(height * aspectRatio);
      }
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      imageData.format,
      1.0
    );
  });

  return {
    url: URL.createObjectURL(blob),
    width,
    height,
    size: blob.size,
    format: imageData.format,
    blob,
  };
}

/**
 * Compress an image with specified quality
 */
export async function compressImage(
  imageData: ImageData,
  options: CompressOptions
): Promise<ProcessedImage> {
  const img = new Image();
  img.src = imageData.url;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, 0, 0);

  const quality = options.quality / 100;
  const format =
    imageData.format === "image/png" ? "image/jpeg" : imageData.format;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      format,
      quality
    );
  });

  return {
    url: URL.createObjectURL(blob),
    width: imageData.width,
    height: imageData.height,
    size: blob.size,
    format: format as ImageFormat,
    blob,
  };
}

/**
 * Convert an image to a different format
 */
export async function convertImage(
  imageData: ImageData,
  options: ConvertOptions
): Promise<ProcessedImage> {
  const img = new Image();
  img.src = imageData.url;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Handle transparency for PNG/WebP
  if (options.format === "image/png" || options.format === "image/webp") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const quality = options.quality !== undefined ? options.quality / 100 : 1.0;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      options.format,
      quality
    );
  });

  return {
    url: URL.createObjectURL(blob),
    width: imageData.width,
    height: imageData.height,
    size: blob.size,
    format: options.format,
    blob,
  };
}

/**
 * Encode an image to base64
 */
export async function encodeToBase64(
  imageData: ImageData
): Promise<Base64Result> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];

      resolve({
        dataUrl,
        base64,
        size: base64.length,
      });
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(imageData.file);
  });
}

/**
 * Decode base64 to image
 */
export async function decodeFromBase64(
  base64String: string
): Promise<ImageData> {
  // Add data URL prefix if not present
  const dataUrl = base64String.startsWith("data:")
    ? base64String
    : `data:image/png;base64,${base64String}`;

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], "decoded-image.png", { type: blob.type });

  return loadImage(file);
}

/**
 * Download a processed image
 */
export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
