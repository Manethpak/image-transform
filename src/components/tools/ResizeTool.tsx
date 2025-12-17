import { useState } from "react";
import type { ImageData, ResizeOptions } from "../../types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Scaling, Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResizeToolProps {
  imageData: ImageData | null;
  onProcess: (options: ResizeOptions) => void;
}

const presets = [
  { name: "Thumbnail", width: 150, height: 150 },
  { name: "Small", width: 640, height: 480 },
  { name: "Medium", width: 1280, height: 720 },
  { name: "HD", width: 1920, height: 1080 },
  { name: "4K", width: 3840, height: 2160 },
];

export default function ResizeTool({ imageData, onProcess }: ResizeToolProps) {
  const [width, setWidth] = useState(imageData?.width || 0);
  const [height, setHeight] = useState(imageData?.height || 0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && imageData) {
      const aspectRatio = imageData.width / imageData.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && imageData) {
      const aspectRatio = imageData.width / imageData.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handlePreset = (presetWidth: number, presetHeight: number) => {
    if (maintainAspectRatio && imageData) {
      const aspectRatio = imageData.width / imageData.height;
      const presetRatio = presetWidth / presetHeight;

      if (aspectRatio > presetRatio) {
        setWidth(presetWidth);
        setHeight(Math.round(presetWidth / aspectRatio));
      } else {
        setHeight(presetHeight);
        setWidth(Math.round(presetHeight * aspectRatio));
      }
    } else {
      setWidth(presetWidth);
      setHeight(presetHeight);
    }
  };

  const handleProcess = () => {
    onProcess({ width, height, maintainAspectRatio });
  };

  if (!imageData) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8">
        <p className="text-muted-foreground">
          Upload an image to start resizing
        </p>
      </div>
    );
  }

  const scalePercentage = Math.round((width / imageData.width) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Scaling className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Resize Settings</h2>
      </div>
      
      <div className="space-y-6">
        {/* Dimension Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              min="1"
              className="text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              min="1"
              className="text-lg font-medium"
            />
          </div>
        </div>

        {/* Aspect Ratio Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg transition-colors", maintainAspectRatio ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
              {maintainAspectRatio ? <Lock className="w-5 h-5" /> : <LockOpen className="w-5 h-5" />}
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="aspect-ratio" className="text-base">Maintain Aspect Ratio</Label>
              <p className="text-xs text-muted-foreground">
                Keep the image proportions consistent
              </p>
            </div>
          </div>
          <Switch
            id="aspect-ratio"
            checked={maintainAspectRatio}
            onCheckedChange={setMaintainAspectRatio}
          />
        </div>

        {/* Scale Info */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground mb-1">Current Scale</p>
          <p className="text-3xl font-black text-primary">{scalePercentage}%</p>
        </div>

        {/* Presets */}
        <div className="space-y-3">
          <Label>Quick Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => handlePreset(preset.width, preset.height)}
                className="flex-col h-auto py-2 gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
              >
                <span className="font-medium text-xs">{preset.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {preset.width}×{preset.height}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleProcess} 
          className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Scaling className="w-5 h-5 mr-2" />
          Resize Image
        </Button>
      </div>
    </div>
  );
}
