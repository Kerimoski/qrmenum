"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  url: string;
  restaurantName: string;
}

export function QRCodeGenerator({ url, restaurantName }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      setIsLoading(true);
      await QRCode.toCanvas(canvasRef.current, url, {
        width: 512,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("QR kod oluşturma hatası:", error);
      setIsLoading(false);
    }
  };

  const downloadQRCode = (format: "png" | "svg") => {
    if (!canvasRef.current) return;

    if (format === "png") {
      const pngUrl = canvasRef.current.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${restaurantName}-qr-menu.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Kod</CardTitle>
        <CardDescription>
          Menünüz için QR kodu hazır. İndirin ve masalarınıza yerleştirin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
            {isLoading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-64 h-64" />
            )}
          </div>
        </div>

        {/* URL Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Menü URL:</div>
          <div className="font-mono text-sm break-all">{url}</div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => downloadQRCode("png")} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            PNG İndir
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="font-semibold mb-2">💡 İpuçları</div>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• QR kodu yüksek kalitede yazdırın</li>
            <li>• Her masaya ayrı numara verebilirsiniz</li>
            <li>• QR kod asla değişmez, menü her zaman güncel</li>
            <li>• Müşteriler WiFi&apos;ye bağlanmadan görebilir</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

