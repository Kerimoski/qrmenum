import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Calendar, Users, Download, Globe, Smartphone, Clock } from "lucide-react";
import Link from "next/link";
import { checkSubscription } from "@/lib/utils/subscription-check";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.restaurantId) {
    redirect("/login");
  }

  // Abonelik kontrolü
  if (!session.user.isImpersonating) {
    await checkSubscription(session.user.restaurantId);
  }

  // Görüntülenme verileri
  const views = await prisma.menuView.findMany({
    where: {
      restaurantId: session.user.restaurantId,
    },
    orderBy: {
      viewedAt: "desc",
    },
  });

  // Ürün ve kategori sayıları
  const [products, categories] = await Promise.all([
    prisma.product.count({
      where: { restaurantId: session.user.restaurantId },
    }),
    prisma.category.count({
      where: { restaurantId: session.user.restaurantId },
    }),
  ]);

  // Son 7 gün
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const last7Days = views.filter(v => v.viewedAt >= sevenDaysAgo);

  // Günlere göre grupla
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

  // En yüksek görüntülenme
  const maxViews = Math.max(...dailyViews.map(d => d.count), 1);

  // Bu ay
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const thisMonthViews = views.filter(v => v.viewedAt >= thisMonth).length;

  // Dil istatistikleri
  const languageStats = views.reduce((acc, view) => {
    const lang = view.language || "tr";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cihaz istatistikleri
  const deviceStats = {
    mobile: views.filter(v => v.userAgent?.includes("Mobile")).length,
    desktop: views.filter(v => !v.userAgent?.includes("Mobile")).length,
  };

  // Saatlik yoğunluk (son 7 gün)
  const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
    const count = last7Days.filter(v => {
      const viewHour = v.viewedAt.getHours();
      return viewHour === hour;
    }).length;
    return { hour, count };
  });

  const maxHourlyViews = Math.max(...hourlyStats.map(h => h.count), 1);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gelişmiş Analitik</h1>
        <p className="text-gray-600">
            Menünüzün performansını detaylı görüntüleyin
        </p>
        </div>
        <Link href="/api/analytics/export">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Excel&apos;e Aktar
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{views.length}</div>
            <p className="text-xs text-muted-foreground">
              Tüm zamanlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{thisMonthViews}</div>
            <p className="text-xs text-muted-foreground">
              Görüntülenme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 7 Gün</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{last7Days.length}</div>
            <p className="text-xs text-muted-foreground">
              Görüntülenme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İçerik</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products}</div>
            <p className="text-xs text-muted-foreground">
              {categories} kategori
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Günlük Grafik */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Son 7 Gün Trendi</CardTitle>
          <CardDescription>Günlük görüntülenme grafiği</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyViews.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  {day.count}
                </div>
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${(day.count / maxViews) * 100}%`, minHeight: day.count > 0 ? "20px" : "0" }}
                  title={`${day.day}: ${day.count} görüntülenme`}
                />
                <div className="text-xs text-gray-600 font-medium">{day.day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saatlik Yoğunluk */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Saatlik Yoğunluk Haritası
          </CardTitle>
          <CardDescription>Son 7 günün saatlik dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-1">
            {hourlyStats.map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-xs font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition">
                  {stat.count}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all hover:from-purple-700 hover:to-purple-500 cursor-pointer"
                  style={{ height: `${(stat.count / maxHourlyViews) * 100}%`, minHeight: stat.count > 0 ? "10px" : "0" }}
                  title={`${stat.hour}:00 - ${stat.count} görüntülenme`}
                />
                <div className="text-xs text-gray-600">{stat.hour}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            En yoğun saat: {hourlyStats.reduce((max, stat) => stat.count > max.count ? stat : max).hour}:00
          </div>
        </CardContent>
      </Card>

      {/* Dil ve Cihaz İstatistikleri */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Dil Dağılımı
            </CardTitle>
            <CardDescription>Hangi diller kullanılıyor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(languageStats)
                .sort(([,a], [,b]) => b - a)
                .map(([lang, count]) => {
                  const percentage = ((count / views.length) * 100).toFixed(1);
                  const langNames: Record<string, string> = {
                    tr: "Türkçe",
                    en: "English",
                    de: "Deutsch",
                    fr: "Français",
                    ar: "العربية",
                  };
                  return (
                    <div key={lang}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{langNames[lang] || lang}</span>
                        <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Cihaz Dağılımı
            </CardTitle>
            <CardDescription>Mobil vs Masaüstü</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Mobil</span>
                  <span className="text-sm text-gray-600">
                    {deviceStats.mobile} ({((deviceStats.mobile / views.length) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${(deviceStats.mobile / views.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Masaüstü</span>
                  <span className="text-sm text-gray-600">
                    {deviceStats.desktop} ({((deviceStats.desktop / views.length) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${(deviceStats.desktop / views.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((deviceStats.mobile / views.length) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Mobil Kullanım Oranı</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Son Görüntülenmeler */}
      <Card>
        <CardHeader>
          <CardTitle>Son Görüntülenmeler</CardTitle>
          <CardDescription>En son menüye bakanlar</CardDescription>
        </CardHeader>
        <CardContent>
          {views.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz görüntülenme yok
            </div>
          ) : (
            <div className="space-y-3">
              {views.slice(0, 10).map((view, i) => (
                <div key={view.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-gray-400">#{i + 1}</div>
                    <div>
                      <div className="text-sm font-medium">
                        {view.viewedAt.toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {view.language && (
                        <div className="text-xs text-gray-600">Dil: {view.language}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {view.userAgent?.includes("Mobile") ? "📱 Mobil" : "💻 Masaüstü"}
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

