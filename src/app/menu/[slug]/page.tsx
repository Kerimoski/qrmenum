
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/menu/language-context";
import { MenuContent } from "@/components/menu/menu-content";

export const revalidate = 60; // 60 saniye önbellekle

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Restoranı ve menüyü veritabanından çek (Cache eklendi)
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
            categories: {
                where: { products: { some: { isActive: true } } },
                orderBy: { order: "asc" },
            },
            products: {
                where: { isActive: true },
                include: {
                    category: true,
                    variants: {
                        where: { isActive: true },
                        orderBy: { order: "asc" },
                    },
                },
                orderBy: { order: "asc" },
            },
        },
    });

    if (!restaurant) {
        notFound();
    }

    // Restoran pasif mi veya abonelik süresi dolmuş mu kontrol et
    const now = new Date();
    const isSubscriptionExpired = restaurant.subscriptionStatus === "EXPIRED" ||
        restaurant.subscriptionEndDate < now;

    if (!restaurant.isActive || isSubscriptionExpired) {
        // Eğer pasif veya süresi dolmuşsa, kısıtlı sayfaya yönlendir
        return (await import("@/app/menu-restricted/page")).default();
    }

    // Görüntülenme kaydı oluştur (Non-blocking)
    if (restaurant) {
        // Hem MenuView kaydı oluştur hem de Restaurant tablosundaki sayacı artır
        prisma.$transaction([
            prisma.menuView.create({
                data: {
                    restaurantId: restaurant.id,
                    userAgent: "Web",
                    language: "tr",
                },
            }),
            prisma.restaurant.update({
                where: { id: restaurant.id },
                data: { viewCount: { increment: 1 } }
            })
        ]).catch(() => { });
    }

    // Veriyi serileştir (Decimal problemini çözmek için)
    const serializedRestaurant = JSON.parse(JSON.stringify(restaurant));

    return (
        <LanguageProvider>
            <MenuContent restaurant={serializedRestaurant} />
        </LanguageProvider>
    );
}
