import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { isDemoUser } from "@/lib/demo-check";

// Kategori güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Kategori bu restorana ait mi kontrol et
    const category = await prisma.category.findFirst({
      where: {
        id,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, nameEn },
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kategori güncellenemedi" },
      { status: 500 }
    );
  }
}

// Kategori sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Kategori bu restorana ait mi kontrol et
    const category = await prisma.category.findFirst({
      where: {
        id,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return NextResponse.json(
      { error: "Kategori silinemedi" },
      { status: 500 }
    );
  }
}

