import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

// Yeni ürün varyantı oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const { productId, name, nameEn, price, isActive } = body;

    if (!productId || !name || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik (ürün, isim, fiyat)" },
        { status: 400 }
      );
    }

    // Ürün kontrolü (sadece kendi restoranının ürününe izin ver)
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Son sıra numarasını bul
    const lastVariant = await prisma.productVariant.findFirst({
      where: {
        productId,
      },
      orderBy: { order: "desc" },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name,
        nameEn,
        price: parseFloat(price),
        isActive: isActive ?? true,
        order: (lastVariant?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({ variant });
  } catch (error) {
    console.error("Varyant oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Varyant oluşturulamadı" },
      { status: 500 }
    );
  }
}


