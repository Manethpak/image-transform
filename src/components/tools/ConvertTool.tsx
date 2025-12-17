import { useState } from "react";
import type { ImageData, ConvertOptions, ImageFormat } from "../../types/types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConvertToolProps {
  imageData: ImageData | null;
  onProcess: (options: ConvertOptions) => void;
}

const formats: { value: ImageFormat; label: string; description: string }[] = [
  { value: "image/jpeg", label: "JPEG", description: "Best for photos" },
  { value: "image/png", label: "PNG", description: "Supports transparency" },
  { value: "image/webp", label: "WebP", description: "Modern, efficient" },
  { value: "image/gif", label: "GIF", description: "Animations supported" },
];

export default function ConvertTool({
  imageData,
  onProcess,
}: ConvertToolProps) {
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/png");
  const [quality, setQuality] = useState(90);

  const handleProcess = () => {
    const options: ConvertOptions = {
      format: targetFormat,
    };

    // Only include quality for lossy formats
    if (targetFormat === "image/jpeg" || targetFormat === "image/webp") {
      options.quality = quality;
    }

    onProcess(options);
  };

  if (!imageData) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8">
        <p className="text-muted-foreground">
          Upload an image to start converting
        </p>
      </div>
    );
  }

  const showQuality =
    targetFormat === "image/jpeg" || targetFormat === "image/webp";
  const currentFormat = imageData.format.split("/")[1].toUpperCase();

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <ArrowRightLeft className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Convert Settings</h2>
      </div>
      
      <div className="space-y-8">
        {/* Current Format */}
        <div className="bg-muted/30 rounded-xl p-4 border flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">Current Format</p>
          <p className="text-2xl font-black text-primary">{currentFormat}</p>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <Label>Convert To</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formats.map((format) => {
              const isSelected = targetFormat === format.value;
              const isCurrent = imageData.format === format.value;

              return (
                <Button
                  key={format.value}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => setTargetFormat(format.value)}
                  className={cn(
                    "flex-col h-auto py-3 gap-1 relative items-start transition-all",
                    isSelected ? "ring-2 ring-primary ring-offset-2 shadow-md scale-[1.02]" : "hover:bg-primary/5 hover:border-primary/30",
                    isCurrent && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-border"
                  )}
                >
                  <span className="font-bold text-lg">{format.label}</span>
                  <span
                    className={cn(
                      "text-[10px] whitespace-normal text-left font-normal",
                      isSelected
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {format.description}
                  </span>

                  {isSelected && !isCurrent && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded">Current</span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quality Slider (for JPEG/WebP) */}
        {showQuality && (
          <div className="space-y-6 p-6 bg-muted/30 rounded-xl border animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Quality</Label>
              <span className="text-2xl font-bold text-primary">{quality}%</span>
            </div>

            <Slider
              value={[quality]}
              onValueChange={(vals) => setQuality(vals[0])}
              min={1}
              max={100}
              className="w-full py-2"
            />
            <p className="text-xs text-muted-foreground text-center">
              Higher quality means larger file size
            </p>
          </div>
        )}

        {/* Format Info */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1 text-teal-700 dark:text-teal-300">
                Format Information
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                {targetFormat === "image/jpeg" && (
                  <>
                    <li>Best for photographs and complex images</li>
                    <li>Does not support transparency</li>
                    <li>Lossy compression</li>
                  </>
                )}
                {targetFormat === "image/png" && (
                  <>
                    <li>Supports transparency</li>
                    <li>Lossless compression</li>
                    <li>Best for graphics and screenshots</li>
                  </>
                )}
                {targetFormat === "image/webp" && (
                  <>
                    <li>Modern format with excellent compression</li>
                    <li>Supports transparency</li>
                    <li>Smaller file sizes than JPEG/PNG</li>
                  </>
                )}
                {targetFormat === "image/gif" && (
                  <>
                    <li>Supports animations</li>
                    <li>Limited to 256 colors</li>
                    <li>Best for simple graphics</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <Button 
          onClick={handleProcess} 
          className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <ArrowRightLeft className="w-5 h-5 mr-2" />
          Convert to {targetFormat.split("/")[1].toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
