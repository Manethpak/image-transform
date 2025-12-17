import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ImagePreview from "./ImagePreview";
import TabNavigation from "./TabNavigation";
import ResizeTool from "./tools/ResizeTool";
import CompressTool from "./tools/CompressTool";
import ConvertTool from "./tools/ConvertTool";
import Base64Tool from "./tools/Base64Tool";
import { resizeImage, compressImage, convertImage } from "../utils/imageUtils";
import type {
  ImageData,
  ProcessedImage,
  ResizeOptions,
  CompressOptions,
  ConvertOptions,
  ToolType,
} from "../types/types";

export default function ImageTransform() {
  const [activeTool, setActiveTool] = useState<ToolType>("resize");
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageLoad = (image: ImageData | null) => {
    setOriginalImage(image);
    setProcessedImage(null);
  };

  const handleResize = async (options: ResizeOptions) => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const result = await resizeImage(originalImage, options);
      setProcessedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompress = async (options: CompressOptions) => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const result = await compressImage(originalImage, options);
      setProcessedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = async (options: ConvertOptions) => {
    if (!originalImage) return;
    setIsProcessing(true);
    try {
      const result = await convertImage(originalImage, options);
      setProcessedImage(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-8 max-w-7xl">
      <div className="text-center space-y-6 mb-12 pt-8">
        <div className="inline-flex items-center justify-center p-2 bg-muted/50 rounded-full mb-4 backdrop-blur-sm border border-border/50">
          <span className="text-xs font-medium px-3 py-1">✨ Free & Secure Image Tools</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/80 to-foreground/40 pb-2">
          Image Transform
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Professional grade image tools in your browser. Resize, compress, convert and encode securely without uploading files.
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/5">
        <TabNavigation activeTool={activeTool} onToolChange={setActiveTool} />

        <div className="grid lg:grid-cols-12 gap-8 items-start mt-8">
          <div className="lg:col-span-5 space-y-6">
            <ImageUploader
              currentImage={originalImage}
              onImageLoad={handleImageLoad}
            />

            {originalImage && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-card border rounded-2xl p-6 shadow-sm">
                {activeTool === "resize" && (
                  <ResizeTool
                    imageData={originalImage}
                    onProcess={handleResize}
                  />
                )}
                {activeTool === "compress" && (
                  <CompressTool
                    imageData={originalImage}
                    onProcess={handleCompress}
                  />
                )}
                {activeTool === "convert" && (
                  <ConvertTool
                    imageData={originalImage}
                    onProcess={handleConvert}
                  />
                )}
                {activeTool === "base64" && (
                  <Base64Tool
                    imageData={originalImage}
                    onImageLoad={handleImageLoad}
                  />
                )}
              </div>
            )}

            {!originalImage && activeTool === "base64" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-card border rounded-2xl p-6 shadow-sm">
                <Base64Tool
                  imageData={originalImage}
                  onImageLoad={handleImageLoad}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-8">
            <ImagePreview
              original={originalImage}
              processed={processedImage}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
