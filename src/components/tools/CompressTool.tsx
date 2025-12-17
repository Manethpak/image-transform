import { useState } from "react";
import type { ImageData, CompressOptions } from "../../types/types";
import { formatFileSize } from "../../utils/imageUtils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minimize2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompressToolProps {
  imageData: ImageData | null;
  onProcess: (options: CompressOptions) => void;
}

const qualityPresets = [
  { name: "Low", quality: 50, description: "Smallest file size" },
  { name: "Medium", quality: 70, description: "Balanced" },
  { name: "High", quality: 85, description: "Best quality" },
  { name: "Maximum", quality: 95, description: "Near lossless" },
];

export default function CompressTool({
  imageData,
  onProcess,
}: CompressToolProps) {
  const [quality, setQuality] = useState(80);

  const handleProcess = () => {
    onProcess({ quality });
  };

  if (!imageData) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8">
        <p className="text-muted-foreground">
          Upload an image to start compressing
        </p>
      </div>
    );
  }

  const estimatedSize = Math.round((imageData.size * quality) / 100);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Minimize2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Compress Settings</h2>
      </div>
      
      <div className="space-y-8">
        {/* Quality Slider */}
        <div className="space-y-6 p-6 bg-muted/30 rounded-xl border">
          <div className="flex items-center justify-between">
            <Label className="text-base">Quality Level</Label>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-primary">{quality}%</span>
            </div>
          </div>

          <Slider
            value={[quality]}
            onValueChange={(vals) => setQuality(vals[0])}
            min={1}
            max={100}
            step={1}
            className="w-full py-4"
          />

          <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Smaller Size</span>
            <span>Better Quality</span>
          </div>
        </div>

        {/* Quality Presets */}
        <div className="space-y-3">
          <Label>Quick Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {qualityPresets.map((preset) => (
              <Button
                key={preset.name}
                variant={quality === preset.quality ? "default" : "outline"}
                onClick={() => setQuality(preset.quality)}
                className={cn(
                  "flex-col h-auto py-3 gap-1 items-start transition-all",
                  quality === preset.quality ? "shadow-md scale-[1.02]" : "hover:bg-primary/5 hover:border-primary/30"
                )}
              >
                <span className="font-semibold">{preset.name}</span>
                <span className={cn("text-[10px] font-normal", quality === preset.quality ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {preset.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Size Estimation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-xl p-4 border text-center">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Original Size</p>
            <p className="text-lg font-bold">
              {formatFileSize(imageData.size)}
            </p>
          </div>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Estimated Size</p>
            <p className="text-lg font-bold text-primary">
              {formatFileSize(estimatedSize)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-bold">
              ~
              {Math.round(
                ((imageData.size - estimatedSize) / imageData.size) * 100
              )}
              % reduction
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground/80">
              <p className="font-medium mb-1 text-blue-700 dark:text-blue-300">
                Compression Tips
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Quality 70-85% offers the best balance</li>
                <li>Lower quality = smaller file size</li>
                <li>PNG images will be converted to JPEG for compression</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleProcess} 
          className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Minimize2 className="w-5 h-5 mr-2" />
          Compress Image
        </Button>
      </div>
    </div>
  );
}
