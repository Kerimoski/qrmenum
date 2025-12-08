"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VideoUpload } from "@/components/dashboard/video-upload";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    wifiPassword: "",
    instagram: "",
    facebook: "",
    phone: "",
    showLanguageOption: true,
  });

  // Restoran bilgilerini yükle
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const res = await fetch("/api/restaurant/settings");
        const data = await res.json();

        if (data.restaurant) {
          setRestaurant(data.restaurant);
          setFormData({
            name: data.restaurant.name || "",
            description: data.restaurant.description || "",
            wifiPassword: data.restaurant.wifiPassword || "",
            instagram: data.restaurant.socialMedia?.instagram || "",
            facebook: data.restaurant.socialMedia?.facebook || "",
            phone: "",
            showLanguageOption: data.restaurant.showLanguageOption ?? true,
          });
        }
      } catch (error) {
        console.error("Yükleme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.restaurantId) {
      loadRestaurant();
    }
  }, [session]);

  // Kaydet
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/restaurant/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Ayarlar kaydedildi!");
      }
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
        <p className="text-gray-600">
          Restoran bilgilerinizi düzenleyin
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Temel Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
            <CardDescription>
              Restoranınızın genel bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Restoran Adı *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Lezzet Durağı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Açıklama
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Restoranınız hakkında kısa açıklama..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                WiFi Şifresi
              </label>
              <Input
                value={formData.wifiPassword}
                onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                placeholder="Müşterilere gösterilecek WiFi şifresi"
              />
              <p className="text-xs text-gray-500 mt-1">
                Menüde WiFi kartında gösterilir
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Menü Görünümü */}
        <Card>
          <CardHeader>
            <CardTitle>Menü Görünümü</CardTitle>
            <CardDescription>
              Menünüzün müşterilere nasıl görüneceğini özelleştirin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-language" className="flex flex-col gap-1">
                <span>Dil Seçeneğini Göster</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Wifi şifresi olmadığında dil seçim ekranını göster
                </span>
              </Label>
              <Switch
                id="show-language"
                checked={formData.showLanguageOption}
                onCheckedChange={(checked) => setFormData({ ...formData, showLanguageOption: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tanıtım Videosu */}
        <Card>
          <CardHeader>
            <CardTitle>Tanıtım Videosu</CardTitle>
            <CardDescription>
              Menünüzde gösterilecek tanıtım videosu (Maksimum 500MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoUpload currentVideoUrl={restaurant?.videoUrl} />
          </CardContent>
        </Card>

        {/* Sosyal Medya */}
        <Card>
          <CardHeader>
            <CardTitle>Sosyal Medya</CardTitle>
            <CardDescription>
              Hesap adlarınızı girin (@ işareti olmadan)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Instagram
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">@</span>
                <Input
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="kullaniciadi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Facebook
              </label>
              <Input
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="sayfaadi"
              />
            </div>
          </CardContent>
        </Card>

        {/* URL Bilgisi */}
        {restaurant && (
          <Card>
            <CardHeader>
              <CardTitle>Menü URL</CardTitle>
              <CardDescription>
                Müşterileriniz bu adresten menünüze ulaşır
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="font-mono text-sm text-blue-600 break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/menu/{restaurant.slug}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kaydet Butonu */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

