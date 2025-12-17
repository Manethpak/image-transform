import { useState } from "react";
import type { ImageData } from "../../types/types";
import { encodeToBase64, decodeFromBase64 } from "../../utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Loader2, Copy, Check, Download, Info } from "lucide-react";

interface Base64ToolProps {
  imageData: ImageData | null;
  onImageLoad: (imageData: ImageData) => void;
}

export default function Base64Tool({
  imageData,
  onImageLoad,
}: Base64ToolProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [base64Output, setBase64Output] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = async () => {
    if (!imageData) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await encodeToBase64(imageData);
      setBase64Output(result.dataUrl);
    } catch (err) {
      setError("Failed to encode image");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!base64Input.trim()) {
      setError("Please enter a base64 string");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const decodedImage = await decodeFromBase64(base64Input);
      onImageLoad(decodedImage);
      setBase64Input("");
    } catch (err) {
      setError("Invalid base64 string");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <FileCode className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Base64 Encoding/Decoding</h2>
      </div>
      
      <div className="space-y-6">
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as "encode" | "decode")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/30 rounded-xl border">
            <TabsTrigger value="encode" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Encode</TabsTrigger>
            <TabsTrigger value="decode" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Decode</TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6 animate-in fade-in slide-in-from-top-2">
            {!imageData ? (
              <div className="border-2 border-dashed rounded-xl p-12 text-center bg-muted/30 border-muted-foreground/20">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileCode className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Upload an image to encode
                </p>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleEncode}
                  disabled={isProcessing}
                  className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Encoding...
                    </>
                  ) : (
                    <>
                      <FileCode className="w-5 h-5 mr-2" />
                      Encode to Base64
                    </>
                  )}
                </Button>

                {base64Output && (
                  <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Base64 Output</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <Textarea
                        value={base64Output}
                        readOnly
                        rows={8}
                        className="font-mono text-xs resize-none bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20 ![field-sizing:fixed]"
                      />
                      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-muted-foreground border shadow-sm">
                        {(base64Output.length / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="decode" className="space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label className="text-base">Base64 String</Label>
              <Textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste your base64 string here..."
                rows={8}
                className="font-mono text-xs resize-none bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20 ![field-sizing:fixed]"
              />
              <p className="text-xs text-muted-foreground">
                Accepts both data URLs and raw base64 strings
              </p>
            </div>

            <Button
              onClick={handleDecode}
              disabled={isProcessing || !base64Input.trim()}
              className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Decoding...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Decode to Image
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 animate-in slide-in-from-top-2">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1 text-purple-700 dark:text-purple-300">
                About Base64
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Encode images to embed in HTML/CSS</li>
                <li>Decode base64 strings back to images</li>
                <li>Useful for data URIs and API responses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
