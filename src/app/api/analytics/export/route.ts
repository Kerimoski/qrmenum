import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.restaurantId) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: session.user.restaurantId },
      select: { name: true },
    });

    const views = await prisma.menuView.findMany({
      where: { restaurantId: session.user.restaurantId },
      orderBy: { viewedAt: "desc" },
    });

    // CSV formatında veri oluştur
    const csvRows = [
      ["Tarih", "Saat", "Dil", "Cihaz"].join(","),
      ...views.map((view) => [
        view.viewedAt.toLocaleDateString("tr-TR"),
        view.viewedAt.toLocaleTimeString("tr-TR"),
        view.language || "-",
        view.userAgent?.includes("Mobile") ? "Mobil" : "Masaüstü",
      ].join(",")),
    ];

    const csvContent = csvRows.join("\n");
    const fileName = `${restaurant?.name || "menu"}-analytics-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

