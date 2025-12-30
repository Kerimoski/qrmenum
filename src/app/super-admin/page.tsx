import { auth } from "@/lib/auth/config";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Eye, TrendingUp, UtensilsCrossed,
  FolderTree, Activity, Clock, BarChart3, ArrowUpRight,
  ArrowDownRight, Minus
} from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/dashboard/product-image";

export default async function SuperAdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Tarih hesaplamaları
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastMonthEnd = new Date(thisMonthStart);

  const last7Days = new Date(todayStart);
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date(todayStart);
  last30Days.setDate(last30Days.getDate() - 30);

  // Paralel data fetching
  const [
    // Restoran verileri
    totalRestaurants,
    activeRestaurants,
    restaurantsCreatedToday,
    restaurantsCreatedThisMonth,
    allRestaurants,

    // Kullanıcı verileri
    totalUsers,
    activeUsers,

    // Ürün ve kategori verileri
    totalProducts,
    activeProducts,
    totalCategories,

    // Görüntülenme verileri
    totalViews,
    todayViews,
    yesterdayViews,
    thisMonthViews,
    lastMonthViews,
    last7DaysViews,
    last30DaysViews,

    // Son eklenen veriler
    recentRestaurants,
    recentProducts,
  ] = await Promise.all([
    // Restoranlar
    prisma.restaurant.count(),
    prisma.restaurant.count({ where: { isActive: true } }),
    prisma.restaurant.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.restaurant.count({ where: { createdAt: { gte: thisMonthStart } } }),
    prisma.restaurant.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, isActive: true } },
        _count: {
          select: {
            products: true,
            categories: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
    }),

    // Kullanıcılar
    prisma.user.count({ where: { role: "RESTAURANT_OWNER" } }),
    prisma.user.count({ where: { role: "RESTAURANT_OWNER", isActive: true } }),

    // Ürün ve kategoriler
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),

    // Görüntülenmeler
    prisma.menuView.count(),
    prisma.menuView.count({ where: { viewedAt: { gte: todayStart } } }),
    prisma.menuView.count({ where: { viewedAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.menuView.count({ where: { viewedAt: { gte: thisMonthStart } } }),
    prisma.menuView.count({ where: { viewedAt: { gte: lastMonthStart, lt: lastMonthEnd } } }),
    prisma.menuView.count({ where: { viewedAt: { gte: last7Days } } }),
    prisma.menuView.count({ where: { viewedAt: { gte: last30Days } } }),

    // Son eklenenler
    prisma.restaurant.findMany({
      include: {
        owner: { select: { name: true } },
        _count: { select: { products: true, categories: true, views: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      include: {
        restaurant: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Hesaplamalar
  const monthlyGrowth = lastMonthViews > 0
    ? Math.round(((thisMonthViews - lastMonthViews) / lastMonthViews) * 100)
    : thisMonthViews > 0 ? 100 : 0;

  const dailyGrowth = yesterdayViews > 0
    ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
    : todayViews > 0 ? 100 : 0;

  const avgProductsPerRestaurant = totalRestaurants > 0
    ? Math.round(totalProducts / totalRestaurants)
    : 0;

  const avgViewsPerRestaurant = totalRestaurants > 0
    ? Math.round(totalViews / totalRestaurants)
    : 0;

  // En popüler restoranlar (Zaten veritabanından sıralı geliyor)
  const topRestaurants = allRestaurants.slice(0, 5);

  // Son 7 gün için günlük dağılım
  const dailyViewsData = await Promise.all(
    Array.from({ length: 7 }, async (_, i) => {
      const dayStart = new Date(todayStart);
      dayStart.setDate(dayStart.getDate() - (6 - i));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = await prisma.menuView.count({
        where: {
          viewedAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      return {
        day: dayStart.toLocaleDateString("tr-TR", { weekday: "short" }),
        count,
      };
    })
  );

  const maxDailyViews = Math.max(...dailyViewsData.map(d => d.count), 1);

  // Trend helper
  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Özeti</h1>
        <p className="text-gray-600">Tüm sistem istatistikleri ve analitikler</p>
      </div>

      {/* Ana İstatistik Kartları */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Restoran */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Restoran</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRestaurants}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {activeRestaurants} aktif
              </Badge>
              {restaurantsCreatedToday > 0 && (
                <Badge className="text-xs bg-green-100 text-green-800">
                  +{restaurantsCreatedToday} bugün
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kullanıcılar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restoran Sahipleri</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {activeUsers} aktif
              </Badge>
              <Badge variant="outline" className="text-xs">
                {totalUsers - activeUsers} pasif
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Görüntülenmeler */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              {getTrendIcon(dailyGrowth)}
              <span className={getTrendColor(dailyGrowth)}>
                {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth}% bugün
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Aylık Büyüme */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aylık Büyüme</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getTrendColor(monthlyGrowth)}`}>
              {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {thisMonthViews.toLocaleString()} görüntülenme bu ay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* İkincil İstatistikler */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeProducts} aktif • Ort. {avgProductsPerRestaurant} ürün/restoran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kategori</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tüm restoranlar genelinde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Görüntülenme</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViewsPerRestaurant}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Görüntülenme/restoran
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dönemsel Karşılaştırmalar */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bugün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Görüntülenme</span>
                <span className="text-lg font-bold">{todayViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Yeni Restoran</span>
                <span className="text-lg font-bold">{restaurantsCreatedToday}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Son 7 Gün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Görüntülenme</span>
                <span className="text-lg font-bold">{last7DaysViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Günlük Ort.</span>
                <span className="text-lg font-bold">{Math.round(last7DaysViews / 7)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Son 30 Gün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Görüntülenme</span>
                <span className="text-lg font-bold">{last30DaysViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Günlük Ort.</span>
                <span className="text-lg font-bold">{Math.round(last30DaysViews / 30)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hızlı İşlemler */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan işlemler</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <Link href="/super-admin/restaurants/new">
            <Button className="w-full" size="lg">
              <Building2 className="mr-2 h-5 w-5" />
              Yeni Restoran Ekle
            </Button>
          </Link>
          <Link href="/super-admin/restaurants">
            <Button variant="outline" className="w-full" size="lg">
              <Users className="mr-2 h-5 w-5" />
              Tüm Restoranlar
            </Button>
          </Link>
          <Link href="/super-admin/system-status">
            <Button variant="outline" className="w-full" size="lg">
              <Activity className="mr-2 h-5 w-5" />
              Sistem Durumu
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Grafikler ve Listeler */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Son 7 Gün Grafik */}
        <Card>
          <CardHeader>
            <CardTitle>Son 7 Gün Görüntülenme</CardTitle>
            <CardDescription>Günlük menü görüntülenme sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {dailyViewsData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-bold text-blue-600">
                    {day.count}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
                    style={{
                      height: `${(day.count / maxDailyViews) * 100}%`,
                      minHeight: day.count > 0 ? "30px" : "0"
                    }}
                    title={`${day.day}: ${day.count} görüntülenme`}
                  />
                  <div className="text-xs text-gray-600 font-medium">{day.day}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* En Popüler Restoranlar */}
        <Card>
          <CardHeader>
            <CardTitle>En Popüler Restoranlar</CardTitle>
            <CardDescription>Görüntülenmeye göre sıralama</CardDescription>
          </CardHeader>
          <CardContent>
            {topRestaurants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz veri yok
              </div>
            ) : (
              <div className="space-y-3">
                {topRestaurants.map((restaurant, i) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`text-lg font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                        #{i + 1}
                      </div>
                      <div>
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-xs text-gray-500">
                          {restaurant._count.products} ürün • {restaurant._count.categories} kategori
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{restaurant.viewCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">görüntülenme</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Son Aktiviteler */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Son Eklenen Restoranlar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Son Eklenen Restoranlar
            </CardTitle>
            <CardDescription>En yeni kayıtlar</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRestaurants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz restoran eklenmemiş
              </div>
            ) : (
              <div className="space-y-3">
                {recentRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                        {restaurant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-xs text-gray-500">{restaurant.owner?.name}</div>
                      </div>
                    </div>
                    <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                      {restaurant.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Son Eklenen Ürünler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Son Eklenen Ürünler
            </CardTitle>
            <CardDescription>Tüm sistemden son ürünler</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz ürün eklenmemiş
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ProductImage
                        src={(product as any).image}
                        alt={product.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.restaurant.name} • {product.category.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="font-bold text-blue-600">₺{Number(product.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
