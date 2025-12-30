import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2
} from "lucide-react";
import Link from "next/link";

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RestaurantManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Tüm restoranları çek (abonelik bilgileri ile)
  const restaurants = await prisma.restaurant.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          products: true,
          categories: true,
          views: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // İstatistikler
  const now = new Date();
  const activeCount = restaurants.filter((r: any) => r.subscriptionStatus === "ACTIVE").length;
  const expiredCount = restaurants.filter((r: any) => r.subscriptionStatus === "EXPIRED").length;
  const expiringSoonCount = restaurants.filter((r: any) => {
    if (r.subscriptionStatus !== "ACTIVE") return false;
    const daysLeft = Math.ceil((r.subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft >= 0;
  }).length;

  // Demo restoranları hariç tut (slug'larına göre)
  const demoRestaurants = await prisma.restaurant.findMany({
    where: {
      slug: {
        in: ['lezzet-duragi', 'seoul-kitchen']
      }
    },
    select: {
      id: true
    }
  });

  const demoRestaurantIds = demoRestaurants.map(r => r.id);

  // Ödeme toplamları (isPaid=true olanlar, demo restoranlar hariç)
  const paymentStats = await prisma.subscriptionHistory.aggregate({
    where: {
      isPaid: true,
      restaurantId: {
        notIn: demoRestaurantIds
      }
    },
    _sum: {
      amount: true,
    },
  });

  const monthlyPayments = await prisma.subscriptionHistory.aggregate({
    where: {
      isPaid: true,
      plan: "MONTHLY",
      restaurantId: {
        notIn: demoRestaurantIds
      }
    },
    _sum: {
      amount: true,
    },
  });

  const yearlyPayments = await prisma.subscriptionHistory.aggregate({
    where: {
      isPaid: true,
      plan: "YEARLY",
      restaurantId: {
        notIn: demoRestaurantIds
      }
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue = Number(paymentStats._sum.amount || 0);
  const monthlyRevenue = Number(monthlyPayments._sum.amount || 0);
  const yearlyRevenue = Number(yearlyPayments._sum.amount || 0);

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "MONTHLY":
        return <Badge className="bg-blue-100 text-blue-800">Aylık</Badge>;
      case "YEARLY":
        return <Badge className="bg-green-100 text-green-800">Yıllık</Badge>;
      case "ENTERPRISE":
        return <Badge className="bg-purple-100 text-purple-800">Kurumsal</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-100 text-red-800">Süresi Dolmuş</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">İptal</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysLeft = (endDate: Date | null | undefined) => {
    if (!endDate) return { text: "Belirsiz", color: "text-gray-600" };
    const days = Math.ceil((new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Süresi dolmuş", color: "text-red-600" };
    if (days === 0) return { text: "Bugün", color: "text-red-600" };
    if (days <= 7) return { text: `${days} gün`, color: "text-orange-600" };
    if (days <= 30) return { text: `${days} gün`, color: "text-yellow-600" };
    return { text: `${days} gün`, color: "text-green-600" };
  };

  const getPlanPrice = (plan: string | null | undefined) => {
    if (!plan) return "-";
    switch (plan) {
      case "MONTHLY":
        return "750₺/ay";
      case "YEARLY":
        return "3.000₺/yıl";
      case "ENTERPRISE":
        return "Özel";
      default:
        return "-";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Restoran Yönetimi & Muhasebe</h1>
        <p className="text-gray-600">Abonelik ve gelir takibi</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Restoranlar</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              Toplam {restaurants.length} restoran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yakında Dolacak</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              7 gün içinde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Süresi Dolmuş</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">
              Yenilenmeli
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gelir İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aylık Paket Geliri</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monthlyRevenue.toLocaleString('tr-TR')}₺</div>
            <p className="text-xs text-muted-foreground">
              Alınan aylık ödemeler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yıllık Paket Geliri</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{yearlyRevenue.toLocaleString('tr-TR')}₺</div>
            <p className="text-xs text-muted-foreground">
              Alınan yıllık ödemeler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString('tr-TR')}₺</div>
            <p className="text-xs text-muted-foreground">
              Tüm alınan ödemeler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Restoranlar Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Tüm Restoranlar
          </CardTitle>
          <CardDescription>
            Abonelik durumu ve muhasebe bilgileri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Restoran</th>
                  <th className="text-left p-4 font-semibold">Sahip</th>
                  <th className="text-left p-4 font-semibold">Paket</th>
                  <th className="text-left p-4 font-semibold">Fiyat</th>
                  <th className="text-left p-4 font-semibold">Durum</th>
                  <th className="text-left p-4 font-semibold">Başlangıç</th>
                  <th className="text-left p-4 font-semibold">Bitiş</th>
                  <th className="text-left p-4 font-semibold">Kalan</th>
                  <th className="text-right p-4 font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant: any) => {
                  const daysLeft = getDaysLeft(restaurant.subscriptionEndDate);
                  return (
                    <tr key={restaurant.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Building2 className="w-3 h-3" />
                            {restaurant._count.products} ürün, {restaurant._count.categories} kategori
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">{restaurant.owner.name}</div>
                          <div className="text-gray-500">{restaurant.owner.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getPlanBadge(restaurant.subscriptionPlan)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{getPlanPrice(restaurant.subscriptionPlan)}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(restaurant.subscriptionStatus)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {restaurant.subscriptionStartDate
                            ? new Date(restaurant.subscriptionStartDate).toLocaleDateString('tr-TR')
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {restaurant.subscriptionEndDate
                            ? new Date(restaurant.subscriptionEndDate).toLocaleDateString('tr-TR')
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`text-sm font-semibold ${daysLeft.color}`}>
                          {daysLeft.text}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/super-admin/restaurant-management/${restaurant.id}`}>
                          <Button variant="outline" size="sm">
                            Yönet
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {restaurants.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Henüz restoran yok
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

