
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/menu/language-context";
import { MenuContent } from "@/components/menu/menu-content";

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Restoranı ve menüyü veritabanından çek
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

    // Görüntülenme kaydı oluştur
    await prisma.menuView.create({
        data: {
            restaurantId: restaurant.id,
            userAgent: "Web",
            language: "tr",
        },
    }).catch(() => { }); // Hata olursa sessizce devam et

    // Veriyi serileştir (Decimal problemini çözmek için)
    const serializedRestaurant = JSON.parse(JSON.stringify(restaurant));

    return (
        <LanguageProvider>
            <MenuContent restaurant={serializedRestaurant} />
        </LanguageProvider>
    );
}
