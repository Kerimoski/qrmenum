import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { isDemoUser } from "@/lib/demo-check";

// Ürünleri listele
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      where: {
        restaurantId: session.user.restaurantId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        // Ürün varyantlarını da getir
        variants: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: [
        { categoryId: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Ürün listesi hatası:", error);
    return NextResponse.json(
      { error: "Ürünler getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni ürün oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    if (isDemoUser(session.user.email)) {
      return NextResponse.json(
        { error: "Demo modunda bu işlem yapılamaz." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, nameEn, description, descriptionEn, price, categoryId, isActive, image } = body;

    if (!name || price === undefined || price === null || !categoryId) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik (isim, fiyat, kategori)" },
        { status: 400 }
      );
    }

    // Kategori kontrolü
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    // Son sıra numarasını bul
    const lastProduct = await prisma.product.findFirst({
      where: {
        restaurantId: session.user.restaurantId,
        categoryId,
      },
      orderBy: { order: "desc" },
    });

    const product = await prisma.product.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        price: parseFloat(price),
        image,
        categoryId,
        restaurantId: session.user.restaurantId,
        isActive: isActive ?? true,
        order: (lastProduct?.order ?? 0) + 1,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Ürün oluşturulamadı" },
      { status: 500 }
    );
  }
}

