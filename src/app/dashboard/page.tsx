import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/utils/subscription-check";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UtensilsCrossed, QrCode, FolderTree, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/dashboard/product-image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.restaurantId) {
    redirect("/login");
  }

  // Abonelik kontrolü (impersonation modunda değilse)
  if (!session.user.isImpersonating) {
    await checkSubscription(session.user.restaurantId);
  }

  // Gerçek veriler
  const [restaurant, products, categories, views] = await Promise.all([
    prisma.restaurant.findUnique({
      where: { id: session.user.restaurantId },
    }),
    prisma.product.findMany({
      where: { restaurantId: session.user.restaurantId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.category.count({
      where: { restaurantId: session.user.restaurantId },
    }),
    prisma.menuView.findMany({
      where: { restaurantId: session.user.restaurantId },
      orderBy: { viewedAt: "desc" },
    }),
  ]);

  const activeProducts = await prisma.product.count({
    where: {
      restaurantId: session.user.restaurantId,
      isActive: true,
    },
  });

  // Tarih hesaplamaları
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // View hesaplamaları
  const todayViews = views.filter(v => v.viewedAt >= todayStart).length;
  const yesterdayViews = views.filter(v => v.viewedAt >= yesterdayStart && v.viewedAt < todayStart).length;
  const weekViews = views.filter(v => v.viewedAt >= sevenDaysAgo).length;

  // Trend hesaplama
  const viewChange = yesterdayViews > 0
    ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100)
    : todayViews > 0 ? 100 : 0;

  // Günlük veriler
  const dailyViews = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const count = views.filter(v => v.viewedAt >= dayStart && v.viewedAt <= dayEnd).length;

    return {
      day: dayStart.toLocaleDateString("tr-TR", { weekday: "short" }),
      count,
    };
  });

  const maxViews = Math.max(...dailyViews.map(d => d.count), 1);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{views.length}</div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {todayViews > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {todayViews} bugün
                </Badge>
              )}
              {viewChange !== 0 && (
                <Badge className={`text-xs ${viewChange > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                  {viewChange > 0 ? <ArrowUpRight className="w-3 h-3 mr-1 inline" /> : <ArrowDownRight className="w-3 h-3 mr-1 inline" />}
                  {viewChange > 0 ? '+' : ''}{viewChange}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Ürünler</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {categories} kategori
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Kod</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurant?.qrCode ? "Hazır" : "Yok"}</div>
            <p className="text-xs text-muted-foreground">
              {restaurant?.qrCode ? "İndirebilirsiniz" : "Oluşturulacak"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories}</div>
            <p className="text-xs text-muted-foreground">
              Menü kategorisi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>En çok kullanılan işlemler</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link href="/dashboard/products">
            <Button className="w-full" size="lg">
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              Yeni Ürün Ekle
            </Button>
          </Link>
          <Link href="/dashboard/qr-code">
            <Button variant="outline" className="w-full" size="lg">
              <QrCode className="mr-2 h-5 w-5" />
              QR Kod İndir
            </Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button variant="outline" className="w-full" size="lg">
              <FolderTree className="mr-2 h-5 w-5" />
              Kategori Ekle
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="outline" className="w-full" size="lg">
              Raporları Gör
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Eklenen Ürünler</CardTitle>
            <CardDescription>En son eklediğiniz ürünler</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz ürün eklenmemiş
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        src={(product as any).image}
                        alt={product.name}
                        size="md"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">₺{Number(product.price).toFixed(2)}</div>
                      </div>
                    </div>
                    <Link href="/dashboard/products">
                      <Button variant="ghost" size="sm">Düzenle</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son 7 Gün</CardTitle>
            <CardDescription>Haftalık görüntülenme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {dailyViews.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    {day.count}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer"
                    style={{
                      height: `${(day.count / maxViews) * 100}%`,
                      minHeight: day.count > 0 ? "24px" : "0"
                    }}
                    title={`${day.day}: ${day.count} görüntülenme`}
                  />
                  <div className="text-xs text-gray-600 font-medium">{day.day}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Preview Banner */}
      {restaurant && (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Menünüzü Görüntüleyin</h3>
                <p className="text-gray-100">Müşterilerinizin gördüğü gibi görün</p>
              </div>
              <Link href={`/menu/${restaurant.slug}`} target="_blank">
                <Button variant="secondary" size="lg">
                  Menüyü Aç
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
