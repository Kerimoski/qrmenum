import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Crown, CheckCircle2, AlertCircle, Info, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user?.restaurantId) {
    redirect("/login");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.user.restaurantId },
    select: {
      name: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionStartDate: true,
      subscriptionEndDate: true,
      subscriptionHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!restaurant) {
    redirect("/dashboard");
  }

  const now = new Date();
  const daysLeft = Math.ceil(
    (restaurant.subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "MONTHLY":
        return <Badge className="bg-blue-100 text-blue-800">Aylık - 750₺/ay</Badge>;
      case "YEARLY":
        return <Badge className="bg-green-100 text-green-800">Yıllık - 3.000₺/yıl</Badge>;
      case "ENTERPRISE":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1 inline" />
            Kurumsal
          </Badge>
        );
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Crown className="w-8 h-8 text-purple-600" />
          Paketim
        </h1>
        <p className="text-gray-600">Abonelik bilgileriniz ve paket detayları</p>
      </div>

      {/* İletişim Butonları */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">İletişim ve Destek</h3>
              <p className="text-sm text-gray-600">
                Paket yükseltme, soru veya sorun için bize ulaşın
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="tel:05443079413" target="_blank">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Ara
                </Button>
              </Link>
              <Link href="https://wa.me/905443079413" target="_blank">
                <Button className="bg-[#25D366] hover:bg-[#22c55e]">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mevcut Paket - Büyük Kart */}
      <Card className={`${daysLeft <= 7 ? "border-orange-300 bg-orange-50/30" : "border-green-300 bg-green-50/30"} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-2xl">Mevcut Paketiniz</span>
            </div>
            {restaurant.subscriptionStatus === "ACTIVE" ? (
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Aktif</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">Süresi Dolmuş</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed">
            {getPlanBadge(restaurant.subscriptionPlan)}
            <div className="mt-4">
              <div className={`text-6xl font-bold ${daysLeft < 0 ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-green-600"}`}>
                {daysLeft < 0 ? "0" : daysLeft}
              </div>
              <div className="text-xl text-gray-600 mt-2">
                {daysLeft < 0 ? "Süresi dolmuş" : "gün kaldı"}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                Başlangıç Tarihi
              </label>
              <p className="font-medium">
                {restaurant.subscriptionStartDate.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                Bitiş Tarihi
              </label>
              <p className="font-medium">
                {restaurant.subscriptionEndDate.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <AlertCircle className="w-3 h-3" />
                Kalan Süre
              </label>
              <p className={`font-semibold text-lg ${daysLeft < 0 ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-green-600"}`}>
                {daysLeft < 0 ? "Süresi dolmuş" : `${daysLeft} gün`}
              </p>
            </div>
          </div>

          {daysLeft <= 7 && daysLeft >= 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-orange-800 mb-1">
                    Paketinizin Süresi Dolmak Üzere
                  </div>
                  <p className="text-sm text-gray-700">
                    Hizmetlerinizin kesintisiz devam etmesi için lütfen yöneticinizle iletişime geçin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paket Özellikleri */}
      <Card>
        <CardHeader>
          <CardTitle>Paket Özellikleri</CardTitle>
          <CardDescription>Mevcut paketinizde sunulan özellikler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Sınırsız Ürün</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">QR Kod Yönetimi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Çoklu Dil Desteği (5 dil)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Video Tanıtım</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Gelişmiş Analitik</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Kategori Yönetimi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Sosyal Medya Entegrasyonu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm">Özelleştirilebilir Tema</span>
            </div>
            {restaurant.subscriptionPlan === "ENTERPRISE" && (
              <div className="flex items-center gap-2 md:col-span-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Çoklu Şube Yönetimi</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Geçmiş */}
      {restaurant.subscriptionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>İşlem Geçmişi</CardTitle>
            <CardDescription>Abonelik işlemleri ve ödemeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {restaurant.subscriptionHistory.map((history) => (
                <div key={history.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {getPlanBadge(history.plan)}
                      {Number(history.amount) > 0 && (
                        <span className="font-semibold">
                          {Number(history.amount).toLocaleString("tr-TR")}₺
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {history.startDate.toLocaleDateString("tr-TR")} -{" "}
                      {history.endDate.toLocaleDateString("tr-TR")}
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
          </CardContent>
        </Card>
      )}

      {/* Bilgi */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 mb-1">Paket Yenileme</div>
              <p className="text-sm text-gray-700">
                Paketinizi yenilemek veya yükseltmek için lütfen sistem yöneticinizle iletişime geçin.
                Kurumsal paket için özel fiyat teklifi alabilirsiniz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

