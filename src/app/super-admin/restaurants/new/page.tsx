"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Check, Copy, Mail, Key, Link as LinkIcon, PartyPopper, Calendar, Badge } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CreatedCredentials {
  email: string;
  password: string;
  menuUrl: string;
  restaurantName: string;
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Password editing states (for success screen)
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    ownerEmail: "",
    subscriptionPlan: "MONTHLY",
    autoRenew: true,
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/super-admin/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      // Başarılı - credentials göster
      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        menuUrl: data.credentials.menuUrl,
        restaurantName: data.restaurant.name,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Success Screen
  if (createdCredentials) {
    // ... (imports)

    // ... (inside component)
    const handleUpdatePassword = async () => {
      if (!newPassword || newPassword.trim().length < 6) {
        toast.error("Şifre en az 6 karakter olmalıdır");
        return;
      }

      setIsUpdatingPassword(true);
      try {
        const response = await fetch("/api/super-admin/users/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: createdCredentials.email,
            newPassword: newPassword.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Şifre güncellenemedi");
        }

        // Credentials'ı güncelle
        setCreatedCredentials({
          ...createdCredentials,
          password: newPassword.trim(),
        });
        setIsEditingPassword(false);
        toast.success("Şifre başarıyla güncellendi!");
      } catch (err) {
        toast.error("Şifre güncellenirken hata oluştu");
      } finally {
        setIsUpdatingPassword(false);
      }
    };

    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Restoran Başarıyla Oluşturuldu!</h1>
          <p className="text-gray-600">
            {createdCredentials.restaurantName} için giriş bilgileri aşağıdadır
          </p>
        </div>

        <Card className="border-2 border-gray-900">
          <CardHeader className="border-b bg-gray-900 text-white">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Giriş Bilgileri
            </CardTitle>
            <CardDescription className="text-gray-300">
              Bu bilgileri restoran sahibi ile paylaşın. Şifre bir daha gösterilmeyecek!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4" />
                Email (Kullanıcı Adı)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 p-3 rounded-lg font-mono text-sm border-2 border-gray-200">
                  {createdCredentials.email}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                  className="border-2"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Key className="w-4 h-4" />
                Şifre
              </label>

              {!isEditingPassword ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-900 text-white p-4 rounded-lg font-mono text-lg font-bold border-2 border-gray-900">
                      {createdCredentials.password}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                      className="border-2"
                    >
                      {copiedField === 'password' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingPassword(true);
                      setNewPassword(createdCredentials.password);
                    }}
                    className="text-xs"
                  >
                    Şifreyi Değiştir
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Yeni şifre girin"
                      className="flex-1 border-2"
                      disabled={isUpdatingPassword}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="bg-gray-900 hover:bg-gray-800"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Güncelleniyor...
                        </>
                      ) : (
                        "Kaydet"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setNewPassword(createdCredentials.password);
                      }}
                      disabled={isUpdatingPassword}
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu URL */}
            <div>
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4" />
                Menü Linki
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 p-3 rounded-lg font-mono text-xs border-2 border-gray-200 break-all">
                  {createdCredentials.menuUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(createdCredentials.menuUrl, 'url')}
                  className="border-2"
                >
                  {copiedField === 'url' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-gray-100 border-2 border-gray-300 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                ⚠️ Önemli Uyarı
              </p>
              <p className="text-sm text-gray-700">
                Bu şifre bir daha gösterilmeyecek. Restoran sahibine vermeden önce mutlaka kopyalayın!
                İlerleyen zamanlarda &quot;Yeni Şifre Oluştur&quot; özelliğini kullanabilirsiniz.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Link href="/super-admin/restaurants" className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800">
                  Restoran Listesine Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form Screen
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/super-admin/restaurants">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Restoran Ekle</h1>
          <p className="text-gray-600">
            Restoran ve kullanıcı bilgilerini girin
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Restoran Bilgileri</CardTitle>
          <CardDescription>
            Yeni restoran oluşturun. Otomatik olarak bir &quot;demo123&quot; şifresiyle kullanıcı hesabı oluşturulacak.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restoran Adı */}
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium mb-2">
                Restoran Adı *
              </label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Örn: Lezzet Durağı"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                URL slug otomatik oluşturulacak (örn: lezzet-duragi)
              </p>
            </div>

            {/* Sahip Adı */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium mb-2">
                İşletme Sahibi Adı *
              </label>
              <Input
                id="ownerName"
                type="text"
                placeholder="Örn: Ahmet Yılmaz"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium mb-2">
                Email Adresi *
              </label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="ornek@restoran.com"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Bu email kullanıcı adı olarak kullanılacak
              </p>
            </div>

            {/* Abonelik Paketi */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Abonelik Paketi</h3>
              </div>

              <div>
                <Label htmlFor="subscriptionPlan">Paket Seç *</Label>
                <Select
                  value={formData.subscriptionPlan}
                  onValueChange={(value) => {
                    setFormData({ 
                      ...formData, 
                      subscriptionPlan: value,
                      autoRenew: false
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">
                      <div className="flex items-center justify-between w-full">
                        <span>Aylık</span>
                        <span className="ml-4 text-gray-600">750₺/ay</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="YEARLY">
                      <div className="flex items-center justify-between w-full">
                        <span>Yıllık</span>
                        <span className="ml-4 text-gray-600">3.000₺/yıl</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ENTERPRISE">
                      <div className="flex items-center justify-between w-full">
                        <span>Kurumsal</span>
                        <span className="ml-4 text-purple-600">Çoklu Şube</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Otomatik Yenileme */}
              {(formData.subscriptionPlan === "MONTHLY" || formData.subscriptionPlan === "YEARLY") && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoRenew" className="text-sm cursor-pointer flex-1">
                    <span className="font-semibold text-gray-900">Otomatik Yenileme</span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {formData.subscriptionPlan === "MONTHLY" ? "Her ay otomatik olarak yenilensin" : "Her yıl otomatik olarak yenilensin"}
                    </p>
                  </label>
                </div>
              )}

              {/* Paket Özellikleri */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="font-semibold mb-2 text-purple-800 flex items-center justify-between">
                  <span>
                    {formData.subscriptionPlan === "MONTHLY" && "Aylık Paket - 750₺/ay"}
                    {formData.subscriptionPlan === "YEARLY" && "Yıllık Paket - 3.000₺/yıl"}
                    {formData.subscriptionPlan === "ENTERPRISE" && "Kurumsal Paket"}
                  </span>
                  {formData.autoRenew && (
                    <Badge className="bg-green-100 text-green-800">Oto Yenileme</Badge>
                  )}
                </div>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>✓ Sınırsız Ürün</li>
                  <li>✓ Özelleştirilmiş QR Kod Şablonları</li>
                  <li>✓ Çoklu Dil Desteği (5 dil)</li>
                  <li>✓ Video Tanıtım</li>
                  <li>✓ Gelişmiş Analitik</li>
                  <li>✓ Kategori Yönetimi</li>
                  <li>✓ Sosyal Medya Entegrasyonu</li>
                  <li>✓ Özelleştirilebilir Tema</li>
                  {formData.subscriptionPlan === "ENTERPRISE" && (
                    <li className="text-purple-600 font-semibold">✓ Çoklu Şube Yönetimi</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="font-semibold mb-2 text-blue-800">
                Otomatik Oluşturulacaklar:
              </div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Kullanıcı hesabı (email + rastgele güvenli şifre)</li>
                <li>✓ Restoran profili (slug + subdomain)</li>
                <li>✓ QR kod (menü linki ile)</li>
                <li>✓ Giriş bilgileri (sonraki ekranda gösterilecek)</li>
              </ul>
              <p className="text-xs text-orange-700 mt-2 font-medium">
                ⚠️ Bilgileri manuel paylaşacaksınız
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Link href="/super-admin/restaurants" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                  İptal
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Restoran Oluştur"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
