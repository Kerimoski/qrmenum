"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Package } from "lucide-react";
import { QRTemplate } from "@/components/dashboard/qr-template";
import { TemplateSelector, TemplateStyle } from "@/components/dashboard/template-selector";
import { QRCustomization, CustomizationConfig } from "@/components/dashboard/qr-customization";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface QRCodeClientProps {
    restaurantName: string;
    qrCode: string;
    slug: string;
    wifiPassword?: string;
    instagram?: string;
}

export function QRCodeClient({
    restaurantName,
    qrCode,
    slug,
    wifiPassword,
    instagram: initialInstagram,
}: QRCodeClientProps) {
    const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>('minimal');
    const [customization, setCustomization] = useState<CustomizationConfig>({
        tableCount: 10,
        showWifi: !!wifiPassword,
        showInstagram: !!initialInstagram,
        instagram: initialInstagram || "",
        logo: null,
        primaryColor: "#3B82F6",
    });
    const [previewTableNumber, setPreviewTableNumber] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const templateRef = useRef<HTMLDivElement>(null);

    // Download Single PNG
    const downloadPNG = async (tableNumber?: number) => {
        if (!templateRef.current) return;

        try {
            const toastId = toast.loading("PNG oluşturuluyor...");

            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(templateRef.current, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement('a');
            link.download = `${slug}-masa-${String(tableNumber || previewTableNumber).padStart(3, '0')}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            toast.success("PNG indirildi!", { id: toastId });
        } catch (error) {
            console.error('PNG download error:', error);
            toast.error("PNG oluşturulamadı");
        }
    };

    // Download PDF
    const downloadPDF = async () => {
        if (!templateRef.current) return;

        try {
            const toastId = toast.loading("PDF oluşturuluyor...");

            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(templateRef.current, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [105, 148],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 105, 148);
            pdf.save(`${slug}-masa-${String(previewTableNumber).padStart(3, '0')}.pdf`);

            toast.success("PDF indirildi!", { id: toastId });
        } catch (error) {
            console.error('PDF download error:', error);
            toast.error("PDF oluşturulamadı");
        }
    };

    // Bulk Download
    const downloadBulk = async () => {
        setIsGenerating(true);
        const zip = new JSZip();

        try {
            toast.loading(`${customization.tableCount} QR kod oluşturuluyor...`);

            for (let tableNum = 1; tableNum <= customization.tableCount; tableNum++) {
                setPreviewTableNumber(tableNum);

                await new Promise(resolve => setTimeout(resolve, 100));
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                await new Promise(resolve => setTimeout(resolve, 800));

                if (!templateRef.current) continue;

                const canvas = await html2canvas(templateRef.current, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    imageTimeout: 0,
                    windowWidth: 397,
                    windowHeight: 561,
                });

                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
                });

                zip.file(`masa-${String(tableNum).padStart(3, '0')}.png`, blob);

                if (tableNum % 5 === 0 || tableNum === customization.tableCount) {
                    toast.loading(`${tableNum}/${customization.tableCount} tamamlandı...`);
                }
            }

            toast.loading("ZIP dosyası oluşturuluyor...");
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            saveAs(zipBlob, `${slug}-qr-codes.zip`);

            toast.success(`${customization.tableCount} QR kod indirildi!`);
            setPreviewTableNumber(1);
        } catch (error) {
            toast.error("Toplu indirme başarısız");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>QR Kod Şablonları</CardTitle>
                    <CardDescription>Restoranınıza uygun tasarımı seçin</CardDescription>
                </CardHeader>
                <CardContent>
                    <TemplateSelector
                        selectedStyle={selectedStyle}
                        onSelectStyle={setSelectedStyle}
                    />
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <QRCustomization
                    restaurantName={restaurantName}
                    instagram={initialInstagram}
                    wifiPassword={wifiPassword}
                    onCustomize={setCustomization}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Önizleme</CardTitle>
                        <CardDescription>
                            Masa numarası: {previewTableNumber}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Önizleme Masası:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={customization.tableCount}
                                    value={previewTableNumber}
                                    onChange={(e) => setPreviewTableNumber(parseInt(e.target.value) || 1)}
                                    className="w-20 px-2 py-1 border rounded"
                                />
                            </div>

                            {/* Visible Preview - Scaled */}
                            <div className="border-2 border-gray-200 rounded-lg overflow-auto bg-gray-50">
                                <div className="flex items-center justify-center p-6">
                                    <div
                                        className="shadow-xl"
                                        style={{
                                            transform: 'scale(0.75)',
                                            transformOrigin: 'center',
                                            width: '105mm',
                                            height: '148mm'
                                        }}
                                    >
                                        <QRTemplate
                                            style={selectedStyle}
                                            restaurantName={restaurantName}
                                            qrCode={qrCode}
                                            tableNumber={previewTableNumber}
                                            wifiPassword={customization.showWifi ? wifiPassword : undefined}
                                            instagram={customization.showInstagram ? customization.instagram : undefined}
                                            logo={customization.logo || undefined}
                                            primaryColor={customization.primaryColor}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hidden Full-Size Template for Downloads */}
            <div className="fixed top-[-9999px] left-[-9999px]">
                <div
                    id="qr-template-render"
                    ref={templateRef}
                    style={{
                        width: '105mm',
                        height: '148mm',
                        position: 'absolute'
                    }}
                >
                    <QRTemplate
                        style={selectedStyle}
                        restaurantName={restaurantName}
                        qrCode={qrCode}
                        tableNumber={previewTableNumber}
                        wifiPassword={customization.showWifi ? wifiPassword : undefined}
                        instagram={customization.showInstagram ? customization.instagram : undefined}
                        logo={customization.logo || undefined}
                        primaryColor={customization.primaryColor}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>İndir</CardTitle>
                    <CardDescription>QR kodlarınızı farklı formatlarda indirin</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Button
                            onClick={() => downloadPNG()}
                            className="w-full"
                            size="lg"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            PNG İndir
                        </Button>

                        <Button
                            onClick={downloadPDF}
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            <FileDown className="mr-2 h-5 w-5" />
                            PDF İndir
                        </Button>

                        <Button
                            onClick={downloadBulk}
                            variant="secondary"
                            className="w-full"
                            size="lg"
                            disabled={isGenerating}
                        >
                            <Package className="mr-2 h-5 w-5" />
                            {isGenerating ? "Oluşturuluyor..." : `${customization.tableCount} Masa (ZIP)`}
                        </Button>
                    </div>

                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                            💡 <strong>İpucu:</strong> ZIP indirme ile tüm masalar için QR kodları tek seferde alabilirsiniz.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
