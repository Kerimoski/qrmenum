import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { hash } from "bcryptjs";
import { generateQRCode } from "@/lib/qr/generator";

const getMenuUrl = (slug: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/menu/${slug}`;
};

// Liste - restoranları getir
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const restaurants = await prisma.restaurant.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        _count: {
          select: {
            products: true,
            categories: true,
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Restoran listesi hatası:", error);
    return NextResponse.json(
      { error: "Restoranlar getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni restoran oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const { restaurantName, ownerEmail, ownerName, subscriptionPlan, autoRenew } = body;

    if (!restaurantName || !ownerEmail || !ownerName || !subscriptionPlan) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Abonelik tarihlerini hesapla
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    
    // Aylık ise 1 ay, Yıllık ise 12 ay ekle
    if (subscriptionPlan === "MONTHLY") {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else if (subscriptionPlan === "YEARLY") {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 12);
    } else {
      // ENTERPRISE için de varsayılan 12 ay
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 12);
    }

    // Paket fiyatını hesapla
    let packageAmount = 0;
    if (subscriptionPlan === "MONTHLY") {
      packageAmount = 750;
    } else if (subscriptionPlan === "YEARLY") {
      packageAmount = 3000;
    }
    // ENTERPRISE özel fiyat, 0 olarak kalır

    // Rastgele güvenli şifre oluştur
    const generatePassword = (length: number = 12): string => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const password = generatePassword();

    const email = ownerEmail;
    const name = ownerName;

    // Email kontrolü
    let user = await prisma.user.findUnique({
      where: { email },
      include: { restaurant: true }
    });

    if (user) {
      // Kullanıcı var, restoranı var mı?
      if (user.restaurant) {
        return NextResponse.json(
          { error: "Bu email adresi zaten kullanımda ve bir restoranı var" },
          { status: 409 }
        );
      }

      // Kullanıcı var ama restoranı yok (Yetim kullanıcı)
      // Kullanıcıyı güncelle ve devam et
      const hashedPassword = await hash(password, 12);
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          name: name + " Sahibi",
          role: "RESTAURANT_OWNER",
          isActive: true,
        },
        include: { restaurant: true } // Type matching için
      });

      console.log('♻️ Mevcut (yetim) kullanıcı güncellendi:', email);
    } else {
      // Yeni kullanıcı oluştur
      const hashedPassword = await hash(password, 12);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name + " Sahibi",
          role: "RESTAURANT_OWNER",
          isActive: true,
        },
        include: { restaurant: true } // Type matching için
      });
      console.log('✨ Yeni kullanıcı oluşturuldu:', email);
    }

    // Slug oluştur
    const slug = restaurantName
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-*|-*$/g, '');

    const subdomain = slug;

    // Restoran oluştur
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        slug,
        subdomain,
        ownerId: user.id,
        isActive: true,
        subscriptionPlan,
        subscriptionStatus: "ACTIVE",
        subscriptionStartDate,
        subscriptionEndDate,
        autoRenew: autoRenew || false,
      },
    });

    // QR kod oluştur  
    const menuUrl = getMenuUrl(slug);
    let qrCodeData = "";
    try {
      qrCodeData = await generateQRCode(menuUrl);
    } catch (qrError) {
      console.error("QR kod oluşturma hatası:", qrError);
      // QR kod oluşturulamazsa boş bırak, sonra oluşturulabilir
    }

    // QR kodu kaydet
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { qrCode: qrCodeData },
    });

    // Abonelik geçmişine kaydet
    const monthCount = subscriptionPlan === "MONTHLY" ? "1" : subscriptionPlan === "YEARLY" ? "12" : "12";
    await prisma.subscriptionHistory.create({
      data: {
        restaurantId: restaurant.id,
        plan: subscriptionPlan,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        amount: packageAmount,
        notes: `İlk abonelik - ${monthCount} ay${autoRenew ? " (Otomatik yenileme aktif)" : ""}`,
      },
    });

    // Email GÖNDERİLMİYOR - Super-admin manuel olarak paylaşacak
    console.log('✅ Restoran oluşturuldu:', restaurant.name);
    console.log('📧 Email:', user.email);
    console.log('🔑 Şifre:', password);

    return NextResponse.json({
      restaurant,
      user,
      credentials: {
        email: user.email,
        password, // Plain password - sadece ilk oluşturmada
        menuUrl: getMenuUrl(slug),
      },
      message: 'Restoran başarıyla oluşturuldu'
    }, { status: 201 });
  } catch (error) {
    console.error("Restoran oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Restoran oluşturulamadı" },
      { status: 500 }
    );
  }
}
