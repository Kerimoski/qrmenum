import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { isDemoUser } from "@/lib/demo-check";

// Restoran ayarlarını getir
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.restaurantId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: session.user.restaurantId },
    });

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("Restoran bilgisi hatası:", error);
    return NextResponse.json(
      { error: "Bilgiler getirilemedi" },
      { status: 500 }
    );
  }
}

// Restoran ayarlarını güncelle
export async function PATCH(req: NextRequest) {
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

    // Request body'den verileri al
    const { name, description, wifiPassword, instagram, facebook, showLanguageOption } = await req.json();

    const restaurant = await prisma.restaurant.update({
      where: { id: session.user.restaurantId },
      data: {
        name,
        description,
        wifiPassword,
        showLanguageOption,
        socialMedia: {
          instagram,
          facebook,
        },
      },
    });

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("Restoran güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Güncellenemedi" },
      { status: 500 }
    );
  }
}

