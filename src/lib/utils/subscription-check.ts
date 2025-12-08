import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function checkSubscription(restaurantId: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      subscriptionStatus: true,
      subscriptionEndDate: true,
      isActive: true,
    },
  });

  if (!restaurant) {
    return;
  }

  const now = new Date();
  const isExpired = restaurant.subscriptionStatus === "EXPIRED" || 
                   restaurant.subscriptionEndDate < now;

  if (isExpired) {
    // Abonelik süresi dolmuşsa durumu güncelle ve pasife al
    if (restaurant.subscriptionStatus !== "EXPIRED" || restaurant.isActive) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { 
          subscriptionStatus: "EXPIRED",
          isActive: false, // Otomatik pasife al
        },
      });
    }
    redirect("/subscription-expired");
  }
}

