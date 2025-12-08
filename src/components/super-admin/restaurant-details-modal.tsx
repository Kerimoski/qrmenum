"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, Mail, Calendar, Clock, Eye, UtensilsCrossed,
  FolderTree, Activity, Shield, Copy, Check, Key, Loader2, Trash2, AlertTriangle, LogIn
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RestaurantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
    description: string | null;
    isActive: boolean;
    wifiPassword: string | null;
    createdAt: Date;
    updatedAt: Date;
    owner: {
      id: string;
      name: string;
      email: string;
      isActive: boolean;
      lastLoginAt: Date | null;
    };
    _count: {
      products: number;
      categories: number;
      views: number;
    };
    socialMedia?: any;
    workingHours?: any;
  };
}

import { confirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export function RestaurantDetailsModal({
  isOpen,
  onClose,
  restaurant,
}: RestaurantDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  
  const { data: session, update } = useSession();
  const router = useRouter();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success("Kopyalandı");
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.trim().length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

    const isConfirmed = await confirm({
      title: "Şifre Güncelleme",
      description: `${restaurant.owner.name} kullanıcısının şifresini güncellemek istediğinizden emin misiniz?`,
      confirmText: "Güncelle",
    });

    if (!isConfirmed) return;

    setIsUpdatingPassword(true);
    try {
      const response = await fetch("/api/super-admin/users/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: restaurant.owner.email,
          newPassword: newPassword.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Şifre güncellenemedi");
      }

      // Başarılı - yeni şifreyi göster
      setGeneratedPassword(newPassword.trim());
      setIsEditingPassword(false);
      setNewPassword("");
      toast.success("Şifre başarıyla güncellendi!");
    } catch (err) {
      toast.error("Şifre güncellenirken hata oluştu");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImpersonate = async () => {
    const isConfirmed = await confirm({
      title: "Restorana Giriş Yap",
      description: `${restaurant.name} restoranının yönetim paneline süper admin olarak giriş yapmak istediğinizden emin misiniz?`,
      confirmText: "Giriş Yap",
    });

    if (!isConfirmed) return;

    setIsImpersonating(true);
    try {
      const response = await fetch("/api/super-admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: restaurant.id }),
      });

      if (!response.ok) {
        throw new Error("Giriş yapılamadı");
      }

      const data = await response.json();

      // Session'ı güncelle
      await update({
        isImpersonating: true,
        originalUserId: session?.user?.id,
        originalUserName: session?.user?.name,
        impersonatedUserId: data.impersonation.impersonatedUserId,
        restaurantId: data.impersonation.restaurantId,
      });

      toast.success(`${restaurant.name} paneline giriş yapıldı!`);
      
      // Dashboard'a yönlendir
      router.push("/dashboard");
      onClose();
    } catch (err) {
      toast.error("Giriş yapılırken hata oluştu");
    } finally {
      setIsImpersonating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            {restaurant.name} - Detaylı Bilgiler
          </DialogTitle>
          <DialogDescription>
            Restoran ve sahip bilgileri
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Restoran Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Restoran Bilgileri
            </h3>
            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-sm text-gray-600">Restoran Adı</label>
                <p className="font-medium">{restaurant.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Durum</label>
                <div className="mt-1">
                  {restaurant.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Pasif</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Slug</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{restaurant.slug}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(restaurant.slug, 'slug')}
                  >
                    {copiedField === 'slug' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Subdomain</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{restaurant.subdomain}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(restaurant.subdomain, 'subdomain')}
                  >
                    {copiedField === 'subdomain' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Menü URL</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">/menu/{restaurant.slug}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurant.slug}`, 'url')}
                  >
                    {copiedField === 'url' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">WiFi Şifresi</label>
                <p className="font-medium">{restaurant.wifiPassword || '-'}</p>
              </div>
              {restaurant.description && (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Açıklama</label>
                  <p className="font-medium">{restaurant.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sahip Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Restoran Sahibi
            </h3>
            <div className="grid md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div>
                <label className="text-sm text-gray-600">Ad Soyad</label>
                <p className="font-medium">{restaurant.owner.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Kullanıcı Durumu</label>
                <div className="mt-1">
                  {restaurant.owner.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Pasif</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{restaurant.owner.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(restaurant.owner.email, 'email')}
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Son Giriş
                </label>
                <p className="font-medium text-sm">
                  {restaurant.owner.lastLoginAt
                    ? new Date(restaurant.owner.lastLoginAt).toLocaleString('tr-TR')
                    : 'Hiç giriş yapmadı'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                  <Key className="w-3 h-3" />
                  Şifre Yönetimi
                </label>

                {!isEditingPassword && !generatedPassword ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-sm text-gray-700">
                        🔒 Şifre güvenli şekilde saklanıyor. Yeni şifre oluşturmak için aşağıdaki butonu kullanın.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingPassword(true)}
                      className="border-2"
                    >
                      Yeni Şifre Oluştur
                    </Button>
                  </div>
                ) : isEditingPassword ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Yeni şifre girin (min 6 karakter)"
                        className="border-2"
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
                          setNewPassword("");
                        }}
                        disabled={isUpdatingPassword}
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Yeni Oluşturulan Şifre */}
          {generatedPassword && (
            <div className="bg-gray-900 border-2 border-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <Key className="w-5 h-5" />
                Yeni Şifre Oluşturuldu!
              </h3>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <label className="text-sm text-gray-600 mb-2 block">
                  Bu şifreyi müşteriye verebilirsiniz:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 p-3 rounded font-bold text-lg text-gray-900 border-2 border-gray-300">
                    {generatedPassword}
                  </code>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => copyToClipboard(generatedPassword, 'generated-password')}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    {copiedField === 'generated-password' ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Kopyala
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠️ Bu şifre bir daha gösterilmeyecek. Müşteriye vermeden önce kopyalayın!
                </p>
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGeneratedPassword(null);
                    setIsEditingPassword(true);
                  }}
                  className="text-xs"
                >
                  Farklı Şifre Oluştur
                </Button>
              </div>
            </div>
          )}

          {/* İstatistikler */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              İstatistikler
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600">{restaurant._count.products}</div>
                <div className="text-sm text-gray-600">Ürün</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FolderTree className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold text-green-600">{restaurant._count.categories}</div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600">{restaurant._count.views.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Görüntülenme</div>
              </div>
            </div>
          </div>

          {/* Tarih Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tarihler
            </h3>
            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-sm text-gray-600">Oluşturulma</label>
                <p className="font-medium">
                  {new Date(restaurant.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Son Güncelleme</label>
                <p className="font-medium">
                  {new Date(restaurant.updatedAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleImpersonate}
                disabled={isImpersonating || !restaurant.isActive}
              >
                {isImpersonating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Restorana Git
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`/menu/${restaurant.slug}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Menüyü Görüntüle
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(restaurant.owner.email, 'email-action')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email&apos;i Kopyala
              </Button>
            </div>
            {!restaurant.isActive && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Pasif restorana giriş yapılamaz
              </p>
            )}
          </div>

          {/* Kapatma Butonu */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Kapat</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

