import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Aboneyi sil
    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Abone başarıyla silindi",
    });
  } catch (error) {
    console.error("Newsletter delete error:", error);
    return NextResponse.json(
      { error: "Abone silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

