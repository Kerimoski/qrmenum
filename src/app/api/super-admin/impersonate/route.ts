import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Sadece süper admin impersonate edebilir
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      );
    }

    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restoran ID gerekli" },
        { status: 400 }
      );
    }

    // Restoranı ve sahibini bul
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        owner: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restoran bulunamadı" },
        { status: 404 }
      );
    }

    if (!restaurant.owner) {
      return NextResponse.json(
        { error: "Restoran sahibi bulunamadı" },
        { status: 404 }
      );
    }

    // Impersonation bilgisini döndür - client tarafında session'a eklenecek
    return NextResponse.json({
      success: true,
      impersonation: {
        originalUserId: session.user.id,
        originalUserName: session.user.name,
        impersonatedUserId: restaurant.owner.id,
        impersonatedUserName: restaurant.owner.name,
        impersonatedUserEmail: restaurant.owner.email,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
    });
  } catch (error) {
    console.error("Impersonate error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Exit impersonation
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Oturum bulunamadı" },
        { status: 401 }
      );
    }

    // Impersonation'dan çık
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exit impersonate error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

