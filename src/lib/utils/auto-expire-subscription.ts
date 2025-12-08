import { prisma } from "@/lib/db/prisma";

/**
 * Süresi dolan restoranları otomatik olarak pasife alır
 * Bu fonksiyon cron job veya middleware'de çalıştırılabilir
 */
export async function autoExpireSubscriptions() {
  const now = new Date();

  // Süresi dolmuş ama hala aktif olan restoranları bul
  const expiredRestaurants = await prisma.restaurant.findMany({
    where: {
      subscriptionEndDate: {
        lt: now,
      },
      subscriptionStatus: "ACTIVE",
    },
  });

  if (expiredRestaurants.length === 0) {
    return { updated: 0 };
  }

  // Toplu güncelleme yap
  await prisma.restaurant.updateMany({
    where: {
      id: {
        in: expiredRestaurants.map(r => r.id),
      },
    },
    data: {
      subscriptionStatus: "EXPIRED",
      isActive: false, // Pasife al
    },
  });

  console.log(`✅ ${expiredRestaurants.length} restoran otomatik olarak pasife alındı`);

  return { updated: expiredRestaurants.length };
}

/**
 * Otomatik yenileme yapılacak restoranları kontrol eder ve yeniler
 */
export async function autoRenewSubscriptions() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Yarın süresi dolacak ve otomatik yenileme aktif olan restoranları bul
  const restaurantsToRenew = await prisma.restaurant.findMany({
    where: {
      autoRenew: true,
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: "MONTHLY", // Sadece aylık paketler otomatik yenilenir
      subscriptionEndDate: {
        gte: now,
        lte: tomorrow,
      },
    },
  });

  if (restaurantsToRenew.length === 0) {
    return { renewed: 0 };
  }

  // Her restoranı yenile
  for (const restaurant of restaurantsToRenew) {
    const newEndDate = new Date(restaurant.subscriptionEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        subscriptionEndDate: newEndDate,
      },
    });

    // Geçmişe kaydet
    await prisma.subscriptionHistory.create({
      data: {
        restaurantId: restaurant.id,
        plan: restaurant.subscriptionPlan,
        startDate: restaurant.subscriptionEndDate,
        endDate: newEndDate,
        amount: 750, // Aylık paket fiyatı
        notes: "Otomatik yenileme",
      },
    });
  }

  console.log(`✅ ${restaurantsToRenew.length} restoran otomatik olarak yenilendi`);

  return { renewed: restaurantsToRenew.length };
}

