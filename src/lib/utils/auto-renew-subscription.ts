/**
 * Otomatik Abonelik Yenileme Mantığı
 * 
 * Bu fonksiyon:
 * 1. Oto yenileme açık olan restoranları kontrol eder
 * 2. Son ödeme alındıysa (isPendingPayment === false) yenileme yapar
 * 3. Son ödeme alınmadıysa (isPendingPayment === true) yenilemez ve uyarı verir
 * 
 * Çalıştırma: Günlük cron job veya scheduled task ile
 */

import { prisma } from "@/lib/db/prisma";

export async function processAutoRenewals() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Oto yenileme açık ve yarın süresi dolacak restoranları bul
    const restaurants = await prisma.restaurant.findMany({
      where: {
        autoRenew: true,
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: {
          lte: tomorrow, // Yarın veya öncesinde dolacaklar
          gte: now, // Henüz dolmamışlar
        },
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const results = {
      renewed: [] as string[],
      skipped: [] as string[],
      failed: [] as string[],
    };

    for (const restaurant of restaurants) {
      try {
        // Eğer bekleyen ödeme varsa, yenileme yapma
        if (restaurant.isPendingPayment) {
          results.skipped.push(restaurant.name);
          console.log(`⚠️  Yenileme atlandı: ${restaurant.name} - Bekleyen ödeme var`);
          
          // Oto yenilemeyi durdur ve pasife al
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
              autoRenew: false,
              subscriptionStatus: "EXPIRED",
              isActive: false,
            },
          });
          
          continue;
        }

        // Yenileme yap
        const newEndDate = new Date(restaurant.subscriptionEndDate);
        
        if (restaurant.subscriptionPlan === "MONTHLY") {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        } else if (restaurant.subscriptionPlan === "YEARLY") {
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        } else {
          // ENTERPRISE paket manuel yönetilir
          results.skipped.push(restaurant.name);
          continue;
        }

        // Restoranı güncelle
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            subscriptionEndDate: newEndDate,
            subscriptionStatus: "ACTIVE",
            isPendingPayment: true, // Yeni dönem için ödeme bekleniyor
          },
        });

        // Geçmişe kaydet
        const amount = restaurant.subscriptionPlan === "MONTHLY" ? 750 : 3000;
        await prisma.subscriptionHistory.create({
          data: {
            restaurantId: restaurant.id,
            plan: restaurant.subscriptionPlan,
            startDate: restaurant.subscriptionEndDate, // Eski bitiş = yeni başlangıç
            endDate: newEndDate,
            amount,
            notes: `Otomatik yenilendi - ${restaurant.subscriptionPlan === "MONTHLY" ? "Aylık" : "Yıllık"} paket`,
            isPaid: false, // Ödeme bekliyor
          },
        });

        results.renewed.push(restaurant.name);
        console.log(`✅ Yenilendi: ${restaurant.name} - Yeni bitiş: ${newEndDate.toLocaleDateString('tr-TR')}`);
        
      } catch (error) {
        results.failed.push(restaurant.name);
        console.error(`❌ Hata (${restaurant.name}):`, error);
      }
    }

    console.log("\n📊 Otomatik Yenileme Özeti:");
    console.log(`   ✅ Yenilenen: ${results.renewed.length}`);
    console.log(`   ⚠️  Atlanan: ${results.skipped.length}`);
    console.log(`   ❌ Hata: ${results.failed.length}`);

    return results;
  } catch (error) {
    console.error("Otomatik yenileme hatası:", error);
    throw error;
  }
}

/**
 * Süresi dolan restoranları pasife al
 */
export async function expireExpiredSubscriptions() {
  try {
    const now = new Date();

    const expiredRestaurants = await prisma.restaurant.updateMany({
      where: {
        subscriptionEndDate: {
          lt: now,
        },
        subscriptionStatus: "ACTIVE",
      },
      data: {
        subscriptionStatus: "EXPIRED",
        isActive: false,
        autoRenew: false, // Oto yenilemeyi kapat
      },
    });

    console.log(`⏰ ${expiredRestaurants.count} restoran pasife alındı (süre doldu)`);

    return expiredRestaurants.count;
  } catch (error) {
    console.error("Süre dolan restoranları pasife alma hatası:", error);
    throw error;
  }
}

