import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      );
    }

    const { action, ...data } = await request.json();

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restoran bulunamadı" },
        { status: 404 }
      );
    }

    if (action === "extend") {
      // Hızlı uzatma - Mevcut tarihe ekler
      const { months, newEndDate, amount } = data;

      const updated = await prisma.restaurant.update({
        where: { id: params.id },
        data: {
          subscriptionEndDate: new Date(newEndDate),
          subscriptionStatus: "ACTIVE",
          isPendingPayment: true, // Ödeme bekleniyor
        },
      });

      // Geçmişe kaydet
      await prisma.subscriptionHistory.create({
        data: {
          restaurantId: params.id,
          plan: updated.subscriptionPlan,
          startDate: updated.subscriptionStartDate,
          endDate: new Date(newEndDate),
          amount: parseFloat(amount) || 0,
          notes: `${months} ay uzatıldı - Mevcut bitiş tarihine eklendi (Süper Admin)`,
          isPaid: false,
        },
      });

      return NextResponse.json({ success: true, restaurant: updated });
    }

    if (action === "markPaid") {
      // Ödeme alındı olarak işaretle
      const updated = await prisma.restaurant.update({
        where: { id: params.id },
        data: {
          isPendingPayment: false,
          lastPaymentDate: new Date(),
        },
      });

      // En son bekleyen ödemeyi güncelle
      const lastHistory = await prisma.subscriptionHistory.findFirst({
        where: {
          restaurantId: params.id,
          isPaid: false,
        },
        orderBy: { createdAt: "desc" },
      });

      if (lastHistory) {
        await prisma.subscriptionHistory.update({
          where: { id: lastHistory.id },
          data: {
            isPaid: true,
            paidAt: new Date(),
          },
        });
      }

      return NextResponse.json({ success: true, restaurant: updated });
    }

    if (action === "update") {
      // Manuel güncelleme
      const { plan, startDate, endDate, amount, notes } = data;

      const updated = await prisma.restaurant.update({
        where: { id: params.id },
        data: {
          subscriptionPlan: plan,
          subscriptionStartDate: new Date(startDate),
          subscriptionEndDate: new Date(endDate),
          subscriptionStatus: "ACTIVE",
          isPendingPayment: true,
        },
      });

      // Geçmişe kaydet
      await prisma.subscriptionHistory.create({
        data: {
          restaurantId: params.id,
          plan,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          amount: parseFloat(amount),
          notes: notes || "Manuel güncellendi (Süper Admin)",
          isPaid: false,
        },
      });

      return NextResponse.json({ success: true, restaurant: updated });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

