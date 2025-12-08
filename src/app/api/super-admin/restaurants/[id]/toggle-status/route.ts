import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id } = await params;

    // Restoranı bul
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restoran bulunamadı" }, { status: 404 });
    }

    // Durumu değiştir
    const updated = await prisma.restaurant.update({
      where: { id },
      data: { isActive: !restaurant.isActive },
      include: {
        owner: {
          select: { name: true, email: true, isActive: true },
        },
        _count: {
          select: {
            products: true,
            categories: true,
            views: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      restaurant: updated,
      message: updated.isActive ? "Restoran aktif edildi" : "Restoran pasif edildi"
    });
  } catch (error) {
    console.error("Restoran durumu değiştirme hatası:", error);
    return NextResponse.json(
      { error: "Durum değiştirilemedi" },
      { status: 500 }
    );
  }
}

