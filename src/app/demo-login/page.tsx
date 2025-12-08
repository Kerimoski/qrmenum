"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BuildingStorefrontIcon,
    ArrowRightIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    FolderIcon,
    BoltIcon,
    PaintBrushIcon,
    VideoCameraIcon,
    QrCodeIcon,
    WifiIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DemoLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleDemoLogin = async (email: string, password: string, name: string) => {
        setLoading(email);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/dashboard");
        } else {
            alert("Giriş başarısız!");
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <BuildingStorefrontIcon className="w-4 h-4" />
                        Demo Hesaplar
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Demo Restoranları Keşfedin
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        İki farklı restoran örneğiyle QR Menü sistemini test edin
                    </p>
                </div>

                {/* Demo Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Turkish Restaurant */}
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                        <CardHeader>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                                🇹🇷
                            </div>
                            <CardTitle className="text-2xl">Lezzet Durağı</CardTitle>
                            <CardDescription className="text-base">
                                Geleneksel Türk mutfağı örneği
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => handleDemoLogin("demo-turk@qrmenu.com", "demo123", "Türk Restoranı")}
                                disabled={loading !== null}
                                className="w-full gap-2 h-12 text-base"
                                size="lg"
                            >
                                {loading === "demo-turk@qrmenu.com" ? (
                                    "Giriş yapılıyor..."
                                ) : (
                                    <>
                                        Dashboard&apos;a Git
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </Button>

                            <Link href="/menu/lezzet-duragi" target="_blank" className="block">
                                <Button variant="outline" className="w-full gap-2">
                                    Menüyü Görüntüle
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Korean Restaurant */}
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                        <CardHeader>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 text-3xl">
                                🇰🇷
                            </div>
                            <CardTitle className="text-2xl">Seoul Kitchen</CardTitle>
                            <CardDescription className="text-base">
                                Modern Kore mutfağı örneği
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => handleDemoLogin("demo-kore@qrmenu.com", "demo123", "Kore Restoranı")}
                                disabled={loading !== null}
                                className="w-full gap-2 h-12 text-base"
                                size="lg"
                            >
                                {loading === "demo-kore@qrmenu.com" ? (
                                    "Giriş yapılıyor..."
                                ) : (
                                    <>
                                        Dashboard&apos;a Git
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </>
                                )}
                            </Button>

                            <Link href="/menu/seoul-kitchen" target="_blank" className="block">
                                <Button variant="outline" className="w-full gap-2">
                                    Menüyü Görüntüle
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Panel Features */}
                <Card className="mb-8 border-2 border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-2xl">🎛️ Admin Panel Özellikleri</CardTitle>
                        <CardDescription>Demo hesaplarla tüm bu özellikleri deneyebilirsiniz</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <ChartBarIcon className="w-8 h-8 text-blue-600" />
                                <h4 className="font-semibold">Detaylı Analitik</h4>
                                <p className="text-sm text-gray-600">Görüntülenme, popüler ürünler, trend analizi</p>
                            </div>
                            <div className="space-y-2">
                                <ShoppingBagIcon className="w-8 h-8 text-teal-600" />
                                <h4 className="font-semibold">Ürün Yönetimi</h4>
                                <p className="text-sm text-gray-600">Fotoğraf, fiyat, varyant yönetimi</p>
                            </div>
                            <div className="space-y-2">
                                <FolderIcon className="w-8 h-8 text-amber-600" />
                                <h4 className="font-semibold">Kategori Sistemi</h4>
                                <p className="text-sm text-gray-600">Sürükle-bırak sıralama, kolay düzenleme</p>
                            </div>
                            <div className="space-y-2">
                                <BoltIcon className="w-8 h-8 text-yellow-600" />
                                <h4 className="font-semibold">Anında Güncelleme</h4>
                                <p className="text-sm text-gray-600">QR kod hiç değişmez, değişiklikler anında</p>
                            </div>
                            <div className="space-y-2">
                                <PaintBrushIcon className="w-8 h-8 text-pink-600" />
                                <h4 className="font-semibold">Özelleştirme</h4>
                                <p className="text-sm text-gray-600">Renk, logo, açıklama ayarları</p>
                            </div>
                            <div className="space-y-2">
                                <VideoCameraIcon className="w-8 h-8 text-red-600" />
                                <h4 className="font-semibold">Tanıtım Videosu</h4>
                                <p className="text-sm text-gray-600">Restoranınızı tanıtan video ekleyin</p>
                            </div>
                            <div className="space-y-2">
                                <QrCodeIcon className="w-8 h-8 text-indigo-600" />
                                <h4 className="font-semibold">QR Kod Yönetimi</h4>
                                <p className="text-sm text-gray-600">İndirin, yazdırın, masa numaraları</p>
                            </div>
                            <div className="space-y-2">
                                <WifiIcon className="w-8 h-8 text-cyan-600" />
                                <h4 className="font-semibold">WiFi Bilgisi</h4>
                                <p className="text-sm text-gray-600">Menüde WiFi şifresi gösterimi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Back to Home */}
                <div className="text-center">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            ← Ana Sayfaya Dön
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
