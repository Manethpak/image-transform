import type { ImageData, ProcessedImage } from "../types/types";
import { formatFileSize, downloadImage } from "../utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, ArrowRight } from "lucide-react";

interface ImagePreviewProps {
  original: ImageData | null;
  processed: ProcessedImage | null;
  isProcessing: boolean;
}

export default function ImagePreview({
  original,
  processed,
  isProcessing,
}: ImagePreviewProps) {
  if (!original) return null;

  const handleDownload = () => {
    if (processed) {
      const extension = processed.format.split("/")[1];
      const filename = `processed-image.${extension}`;
      downloadImage(processed.blob, filename);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <CardTitle className="text-xl font-bold">
            Preview & Download
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        <div className="grid gap-8">
          {/* Original Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                Original
              </h3>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border">
                {formatFileSize(original.size)}
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-muted/30 border-2 border-dashed border-muted flex items-center justify-center min-h-[200px] group">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <img
                src={original.url}
                alt="Original"
                className="w-full h-auto max-h-[300px] object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 p-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <p className="text-xs text-white font-medium text-center">
                  {original.width} × {original.height} pixels
                </p>
              </div>
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Processed Result
              </h3>
              {processed && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border">
                    {formatFileSize(processed.size)}
                  </span>
                  {processed.size < original.size && (
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-md font-bold border border-green-200 dark:border-green-900">
                      -
                      {Math.round(
                        ((original.size - processed.size) / original.size) * 100
                      )}
                      %
                    </span>
                  )}
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="ml-2 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Result
                  </Button>
                </div>
              )}
            </div>
            <div className="relative rounded-xl overflow-hidden bg-muted/30 border-2 border-primary/20 flex items-center justify-center min-h-[300px] shadow-inner group">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              {isProcessing ? (
                <div className="w-full h-[300px] flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                      <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                      Processing image...
                    </p>
                  </div>
                </div>
              ) : processed ? (
                <>
                  <img
                    src={processed.url}
                    alt="Processed"
                    className="w-full h-auto max-h-[400px] object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 p-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <p className="text-xs text-white font-medium text-center">
                      {processed.width} × {processed.height} pixels •{" "}
                      {processed.format.split("/")[1].toUpperCase()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-muted-foreground/50 flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-muted/50">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Configure settings to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Comparison */}
        {processed && (
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-muted/30 rounded-xl p-4 text-center border hover:bg-muted/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Dimensions
              </p>
              <div className="text-sm font-bold flex items-center justify-center gap-2">
                <span>
                  {original.width}×{original.height}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-primary">
                  {processed.width}×{processed.height}
                </span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center border hover:bg-muted/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                File Size
              </p>
              <div className="text-sm font-bold flex items-center justify-center gap-2">
                <span>{formatFileSize(original.size)}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span
                  className={
                    processed.size < original.size
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  {formatFileSize(processed.size)}
                </span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center border hover:bg-muted/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Format
              </p>
              <div className="text-sm font-bold flex items-center justify-center gap-2 uppercase">
                <span>{original.format.split("/")[1]}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-primary">
                  {processed.format.split("/")[1]}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
