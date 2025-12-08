import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Calendar, Receipt } from "lucide-react";
import Link from "next/link";
import { SubscriptionManager } from "@/components/super-admin/subscription-manager";

export default async function RestaurantManagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      owner: true,
      subscriptionHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          products: true,
          categories: true,
          views: true,
        },
      },
    },
  });

  if (!restaurant) {
    redirect("/super-admin/restaurant-management");
  }

  // Decimal to number conversion for Client Component
  const restaurantData = {
    ...restaurant,
    subscriptionHistory: (restaurant as any).subscriptionHistory?.map((history: any) => ({
      ...history,
      amount: Number(history.amount)
    })) || []
  } as any;

  const now = new Date();
  const daysLeft = Math.ceil(
    (new Date((restaurant as any).subscriptionEndDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getPlanBadge = (plan: any) => {
    switch (plan) {
      case "MONTHLY":
        return <Badge className="bg-blue-100 text-blue-800">Aylık - 750₺/ay</Badge>;
      case "YEARLY":
        return <Badge className="bg-green-100 text-green-800">Yıllık - 3.000₺/yıl</Badge>;
      case "ENTERPRISE":
        return <Badge className="bg-purple-100 text-purple-800">Kurumsal - Özel Fiyat</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  const rest = restaurant as any;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/super-admin/restaurant-management">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{rest.name}</h1>
          <p className="text-gray-600">Abonelik ve paket yönetimi</p>
        </div>
        {getPlanBadge(rest.subscriptionPlan)}
      </div>

      {/* Mevcut Durum */}
      <Card className={daysLeft < 0 ? "border-red-300 bg-red-50" : daysLeft <= 7 ? "border-orange-300 bg-orange-50" : ""}>
        <CardHeader>
          <CardTitle>Mevcut Abonelik Durumu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-600">Paket</label>
              <p className="font-semibold text-lg">
                {rest.subscriptionPlan === "MONTHLY" ? "Aylık" : rest.subscriptionPlan === "YEARLY" ? "Yıllık" : "Kurumsal"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Durum</label>
              <div className="mt-1">
                {rest.subscriptionStatus === "ACTIVE" ? (
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                ) : rest.subscriptionStatus === "EXPIRED" ? (
                  <Badge className="bg-red-100 text-red-800">Süresi Dolmuş</Badge>
                ) : (
                  <Badge variant="secondary">İptal</Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Kalan Gün</label>
              <p className={`font-semibold text-lg ${daysLeft < 0 ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-green-600"}`}>
                {daysLeft < 0 ? "Süresi dolmuş" : `${daysLeft} gün`}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <label className="text-sm text-gray-600">Başlangıç Tarihi</label>
              <p className="font-medium">
                {new Date(rest.subscriptionStartDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Bitiş Tarihi</label>
              <p className="font-medium">
                {new Date(rest.subscriptionEndDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abonelik İşlemleri */}
      <SubscriptionManager restaurant={restaurantData} />

      {/* Restoran Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Restoran Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-600">Sahip</label>
              <p className="font-medium">{rest.owner?.name}</p>
              <p className="text-sm text-gray-500">{rest.owner?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Ürün Sayısı</label>
              <p className="font-semibold text-lg">{rest._count?.products || 0}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Kategori Sayısı</label>
              <p className="font-semibold text-lg">{rest._count?.categories || 0}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Toplam Görüntülenme</label>
              <p className="font-semibold text-lg">{(rest._count?.views || 0).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Paket</label>
              <p className="font-semibold text-sm">
                {rest.subscriptionPlan === "MONTHLY" ? "Aylık" : rest.subscriptionPlan === "YEARLY" ? "Yıllık" : "Kurumsal"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Oluşturulma</label>
              <p className="font-medium text-sm">
                {new Date(rest.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abonelik Geçmişi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Abonelik Geçmişi
          </CardTitle>
          <CardDescription>Son işlemler ve ödemeler</CardDescription>
        </CardHeader>
        <CardContent>
          {restaurantData.subscriptionHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz işlem kaydı yok
            </div>
          ) : (
            <div className="space-y-3">
              {restaurantData.subscriptionHistory.map((history: any) => (
                <div key={history.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {history.plan === "MONTHLY" && (
                        <Badge className="bg-blue-100 text-blue-800">Aylık</Badge>
                      )}
                      {history.plan === "YEARLY" && (
                        <Badge className="bg-green-100 text-green-800">Yıllık</Badge>
                      )}
                      {history.plan === "ENTERPRISE" && (
                        <Badge className="bg-purple-100 text-purple-800">Kurumsal</Badge>
                      )}
                      <span className="font-semibold">
                        {Number(history.amount).toLocaleString("tr-TR")}₺
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {history.startDate.toLocaleDateString("tr-TR")} - {history.endDate.toLocaleDateString("tr-TR")}
                    </div>
                    {history.notes && (
                      <div className="text-sm text-gray-500 mt-1">{history.notes}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {history.createdAt.toLocaleDateString("tr-TR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

