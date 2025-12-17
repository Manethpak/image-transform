import type { ToolType } from "../types/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scaling, Minimize2, ArrowRightLeft, FileCode } from "lucide-react";

interface TabNavigationProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export default function TabNavigation({
  activeTool,
  onToolChange,
}: TabNavigationProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 h-[4em]">
      <Tabs
        value={activeTool}
        onValueChange={(val) => onToolChange(val as ToolType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-transparent rounded-xl gap-2">
          <TabsTrigger
            value="resize"
            className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Scaling className="size-5" />
            <span className="text-xs font-medium">Resize</span>
          </TabsTrigger>
          <TabsTrigger
            value="compress"
            className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Minimize2 className="size-5" />
            <span className="text-xs font-medium">Compress</span>
          </TabsTrigger>
          <TabsTrigger
            value="convert"
            className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <ArrowRightLeft className="size-5" />
            <span className="text-xs font-medium">Convert</span>
          </TabsTrigger>
          <TabsTrigger
            value="base64"
            className="flex flex-col gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <FileCode className="size-5" />
            <span className="text-xs font-medium">Base64</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
