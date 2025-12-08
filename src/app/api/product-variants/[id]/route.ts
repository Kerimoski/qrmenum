import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

// Varyant güncelle
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

    const { name, nameEn, price, isActive } = await req.json();

    // Varyant ve ürün kontrolü
    const variant = await prisma.productVariant.findFirst({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!variant || variant.product.restaurantId !== session.user.restaurantId) {
      return NextResponse.json(
        { error: "Varyant bulunamadı" },
        { status: 404 }
      );
    }

    const updated = await prisma.productVariant.update({
      where: { id },
      data: {
        name,
        nameEn,
        price: price ? parseFloat(price) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ variant: updated });
  } catch (error) {
    console.error("Varyant güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Varyant güncellenemedi" },
      { status: 500 }
    );
  }
}

// Varyant sil
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

    // Varyant ve ürün kontrolü
    const variant = await prisma.productVariant.findFirst({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!variant || variant.product.restaurantId !== session.user.restaurantId) {
      return NextResponse.json(
        { error: "Varyant bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Varyant silme hatası:", error);
    return NextResponse.json(
      { error: "Varyant silinemedi" },
      { status: 500 }
    );
  }
}


