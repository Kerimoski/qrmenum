"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface QRCustomizationProps {
    onCustomize: (config: CustomizationConfig) => void;
    restaurantName: string;
    instagram?: string;
    wifiPassword?: string;
}

export interface CustomizationConfig {
    tableCount: number;
    showWifi: boolean;
    showInstagram: boolean;
    instagram: string;
    logo: string | null;
    primaryColor: string;
}

export function QRCustomization({
    onCustomize,
    restaurantName,
    instagram: initialInstagram,
    wifiPassword,
}: QRCustomizationProps) {
    const [config, setConfig] = useState<CustomizationConfig>({
        tableCount: 10,
        showWifi: !!wifiPassword,
        showInstagram: !!initialInstagram,
        instagram: initialInstagram || "",
        logo: null,
        primaryColor: "#3B82F6",
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newConfig = { ...config, logo: reader.result as string };
                setConfig(newConfig);
                onCustomize(newConfig);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateConfig = (updates: Partial<CustomizationConfig>) => {
        const newConfig = { ...config, ...updates };
        setConfig(newConfig);
        onCustomize(newConfig);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Özelleştirme</CardTitle>
                <CardDescription>QR kodlarınızı kişiselleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Table Count */}
                <div className="space-y-2">
                    <Label htmlFor="tableCount">Kaç Masa?</Label>
                    <Input
                        id="tableCount"
                        type="number"
                        min="1"
                        max="200"
                        value={config.tableCount}
                        onChange={(e) => updateConfig({ tableCount: parseInt(e.target.value) || 1 })}
                        className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                        1-200 arası masa QR kodu oluşturulacak
                    </p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                    <Label>Logo (Opsiyonel)</Label>
                    <div className="flex items-center gap-4">
                        {config.logo && (
                            <div className="w-16 h-16 border-2 border-gray-200 rounded-lg overflow-hidden">
                                <img src={config.logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div className="flex-1">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                            />
                            <Label htmlFor="logo-upload" className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-gray-400 transition flex items-center justify-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm">{config.logo ? "Değiştir" : "Logo Yükle"}</span>
                                </div>
                            </Label>
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <p className="text-xs text-yellow-800">
                            💡 <strong>İpucu:</strong> En iyi sonuç için arka planı şeffaf (PNG) ve kare boyutunda (örn. 500x500px) logo kullanın.
                        </p>
                    </div>
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Switch
                            checked={config.showInstagram}
                            onCheckedChange={(checked) => updateConfig({ showInstagram: checked })}
                        />
                    </div>
                    {config.showInstagram && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">@</span>
                            <Input
                                id="instagram"
                                placeholder="kullaniciadi"
                                value={config.instagram}
                                onChange={(e) => updateConfig({ instagram: e.target.value })}
                                className="flex-1"
                            />
                        </div>
                    )}
                </div>

                {/* WiFi Password */}
                {wifiPassword && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>WiFi Şifresi</Label>
                            <Switch
                                checked={config.showWifi}
                                onCheckedChange={(checked) => updateConfig({ showWifi: checked })}
                            />
                        </div>
                        {config.showWifi && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-mono">{wifiPassword}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Primary Color */}
                <div className="space-y-2">
                    <Label htmlFor="primaryColor">Ana Renk</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="primaryColor"
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                            type="text"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            className="flex-1 font-mono"
                            placeholder="#3B82F6"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Bu renk, seçtiğiniz şablonun ana hatlarında, başlıklarında ve vurgularında kullanılır. (Modern şablonunda kullanılır)
                    </p>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                        <strong>{config.tableCount}</strong> adet QR kod oluşturulacak
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
