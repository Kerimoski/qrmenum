import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { isDemoUser } from "@/lib/demo-check";

// Ürün güncelle
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

    const { name, nameEn, description, descriptionEn, price, categoryId, isActive, image } = await req.json();

    // Ürün kontrolü
    const product = await prisma.product.findFirst({
      where: {
        id,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        price: price ? parseFloat(price) : undefined,
        image,
        categoryId,
        isActive,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}

// Ürün sil
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

    // Ürün kontrolü
    const product = await prisma.product.findFirst({
      where: {
        id,
        restaurantId: session.user.restaurantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json(
      { error: "Ürün silinemedi" },
      { status: 500 }
    );
  }
}

