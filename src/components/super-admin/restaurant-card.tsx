"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Power, Info, Trash2 } from "lucide-react";
import Link from "next/link";
import { confirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
    description: string | null;
    isActive: boolean;
    qrCode: string | null;
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
  onStatusChange?: () => void;
  onViewDetails?: () => void;
  onDelete?: () => void;
}

export function RestaurantCard({ restaurant, onStatusChange, onViewDetails, onDelete }: RestaurantCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useState(restaurant.isActive);

  const handleToggleStatus = async () => {
    const isConfirmed = await confirm({
      title: "Durum Değişikliği",
      description: `${restaurant.name} restoranını ${isActive ? 'pasif' : 'aktif'} yapmak istediğinizden emin misiniz?`,
      confirmText: isActive ? "Pasif Yap" : "Aktif Yap",
      variant: isActive ? "destructive" : "default",
    });

    if (!isConfirmed) return;

    setIsToggling(true);
    try {
      const response = await fetch(`/api/super-admin/restaurants/${restaurant.id}/toggle-status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Durum değiştirilemedi");
      }

      const data = await response.json();
      setIsActive(data.restaurant.isActive);

      toast.success(data.message);

      // Callback
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error("Hata oluştu!");
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    // İlk onay
    const firstConfirm = await confirm({
      title: "Restoranı Sil",
      description: `${restaurant.name} restoranını silmek istediğinizden emin misiniz?`,
      confirmText: "Sil",
      variant: "destructive",
    });

    if (!firstConfirm) return;

    // İkinci onay (kritik uyarı)
    const secondConfirm = await confirm({
      title: "⚠️ KRİTİK UYARI: GERİ ALINAMAZ!",
      description: `Bu işlem GERİ ALINAMAZ!\n\nSilinecekler:\n• Tüm ürünler (${restaurant._count.products} adet)\n• Tüm kategoriler (${restaurant._count.categories} adet)\n• Tüm görseller ve QR kod\n• Kullanıcı hesabı (${restaurant.owner.email})\n\nDevam etmek istediğinizden EMİN MİSİNİZ?`,
      confirmText: "Evet, Hepsini Sil",
      cancelText: "Vazgeç",
      variant: "destructive",
    });

    if (!secondConfirm) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/super-admin/restaurants/${restaurant.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Restoran silinemedi");
      }

      const data = await response.json();
      toast.success(data.message);

      // Callback
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      toast.error(`Hata: ${error.message}`);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{restaurant.name}</h3>
              {isActive ? (
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
              ) : (
                <Badge variant="secondary">Pasif</Badge>
              )}
              {restaurant.qrCode && (
                <Badge variant="outline" className="bg-blue-50">QR Hazır</Badge>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Sahip:</span> {restaurant.owner.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {restaurant.owner.email}
              </div>
              <div>
                <span className="font-medium">URL:</span> /menu/{restaurant.slug}
              </div>
              <div>
                <span className="font-medium">Oluşturma:</span>{" "}
                {new Date(restaurant.createdAt).toLocaleDateString("tr-TR")}
              </div>
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-semibold text-blue-600">{restaurant._count.products}</span>
                <span className="text-gray-600 ml-1">Ürün</span>
              </div>
              <div>
                <span className="font-semibold text-green-600">{restaurant._count.categories}</span>
                <span className="text-gray-600 ml-1">Kategori</span>
              </div>
              <div>
                <span className="font-semibold text-purple-600">{restaurant._count.views}</span>
                <span className="text-gray-600 ml-1">Görüntülenme</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Koşullu Buton: Aktif → Menü Gör, Pasif → Sil */}
            {isActive ? (
              <Link href={`/menu/${restaurant.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Menüyü Gör
                </Button>
              </Link>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                {isDeleting ? "Siliniyor..." : "Restoranı Sil"}
              </Button>
            )}

            <Button
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              <Power className="mr-1 h-3 w-3" />
              {isToggling ? "İşleniyor..." : isActive ? "Pasif Yap" : "Aktif Yap"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewDetails}
            >
              <Info className="mr-1 h-3 w-3" />
              Bilgiler
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
