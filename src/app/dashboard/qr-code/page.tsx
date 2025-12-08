import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { QRCodeClient } from "@/components/dashboard/qr-code-client";

export default async function QRCodePage() {
  const session = await auth();

  if (!session?.user?.restaurantId) {
    redirect("/login");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.user.restaurantId },
  });

  if (!restaurant || !restaurant.qrCode) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Kod Şablonları</h1>
        <p className="text-gray-600">
          Profesyonel QR kod tasarımları ile masalarınızı kişiselleştirin
        </p>
      </div>

      <QRCodeClient
        restaurantName={restaurant.name}
        qrCode={restaurant.qrCode}
        slug={restaurant.slug}
        wifiPassword={restaurant.wifiPassword || undefined}
        instagram={(restaurant.socialMedia as any)?.instagram || undefined}
      />
    </div>
  );
}
