import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { isDemoUser } from "@/lib/demo-check";

// Kategorileri listele
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const categories = await prisma.category.findMany({
      where: {
        restaurantId: session.user.restaurantId,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Kategori listesi hatası:", error);
    return NextResponse.json(
      { error: "Kategoriler getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni kategori oluştur
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

    const { name, nameEn } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Kategori adı zorunludur" },
        { status: 400 }
      );
    }

    // Son sıra numarasını bul
    const lastCategory = await prisma.category.findFirst({
      where: { restaurantId: session.user.restaurantId },
      orderBy: { order: "desc" },
    });

    const category = await prisma.category.create({
      data: {
        name,
        nameEn,
        restaurantId: session.user.restaurantId,
        order: (lastCategory?.order ?? 0) + 1,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Kategori oluşturulamadı" },
      { status: 500 }
    );
  }
}

