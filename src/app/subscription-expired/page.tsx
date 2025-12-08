import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SubscriptionExpiredPage() {
  const session = await auth();

  if (!session?.user?.restaurantId) {
    redirect("/login");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.user.restaurantId },
    select: {
      name: true,
      subscriptionEndDate: true,
    },
  });

  if (!restaurant) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-red-300 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Erişim Sonlandırıldı
            </h1>
            <p className="text-gray-600">
              Abonelik süreniz sona ermiştir
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Restoran</label>
                <p className="font-semibold text-lg">{restaurant.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Bitiş Tarihi</label>
                <p className="font-medium text-red-600">
                  {restaurant.subscriptionEndDate.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Ne Yapmalısınız?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">1.</span>
                <span>Sistem yöneticinizle iletişime geçin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">2.</span>
                <span>Aboneliğinizi yenileyin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">3.</span>
                <span>Tüm hizmetlerinize tekrar erişim sağlayın</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              Yardım için bize ulaşın:
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <a href="mailto:destek@qrmenu.com">
                  <Mail className="w-4 h-4 mr-2" />
                  destek@qrmenu.com
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="tel:+905001234567">
                  <Phone className="w-4 h-4 mr-2" />
                  0500 123 45 67
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-gray-500 mb-3">
              Menünüz müşterileriniz tarafından görüntülenmeye devam edecektir.
              Ancak düzenleme ve yönetim özellikleri geçici olarak devre dışıdır.
            </p>
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Çıkış Yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

