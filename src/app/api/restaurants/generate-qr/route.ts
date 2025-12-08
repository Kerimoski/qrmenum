import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateQRCode, getMenuUrl } from "@/lib/qr/generator";

export async function POST(req: NextRequest) {
  try {
    const { restaurantId } = await req.json();

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID gerekli" },
        { status: 400 }
      );
    }

    // Restoranı bul
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restoran bulunamadı" },
        { status: 404 }
      );
    }

    // QR kod oluştur
    const menuUrl = getMenuUrl(restaurant.slug);
    const qrCodeData = await generateQRCode(menuUrl);

    // Veritabanına kaydet
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { qrCode: qrCodeData },
    });

    return NextResponse.json({
      success: true,
      qrCode: updatedRestaurant.qrCode,
      menuUrl,
    });
  } catch (error) {
    console.error("QR kod oluşturma hatası:", error);
    return NextResponse.json(
      { error: "QR kod oluşturulamadı" },
      { status: 500 }
    );
  }
}

