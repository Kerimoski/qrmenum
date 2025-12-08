import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.restaurantId) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("video") as File;

        if (!file) {
            return NextResponse.json({ error: "Video dosyası bulunamadı" }, { status: 400 });
        }

        // Dosya boyutu kontrolü
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Video dosyası 500MB'dan büyük olamaz" },
                { status: 400 }
            );
        }

        // Dosya tipi kontrolü
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Sadece MP4, WebM veya MOV formatı desteklenir" },
                { status: 400 }
            );
        }

        // Eski videoyu sil (varsa)
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: session.user.restaurantId },
            select: { videoUrl: true },
        });

        if (restaurant?.videoUrl) {
            const oldPath = join(process.cwd(), "public", restaurant.videoUrl);
            if (existsSync(oldPath)) {
                try {
                    await unlink(oldPath);
                } catch (error) {
                    console.error("Eski video silinirken hata:", error);
                }
            }
        }

        // Dosya adını oluştur
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = file.name.split('.').pop() || 'mp4';
        const fileName = `${session.user.restaurantId}-${Date.now()}.${fileExtension}`;
        const filePath = join(process.cwd(), "public", "uploads", "videos", fileName);

        // Dosyayı kaydet
        await writeFile(filePath, buffer);

        // Veritabanını güncelle
        const videoUrl = `/uploads/videos/${fileName}`;
        await prisma.restaurant.update({
            where: { id: session.user.restaurantId },
            data: { videoUrl },
        });

        return NextResponse.json({
            success: true,
            videoUrl,
            message: "Video başarıyla yüklendi",
        });
    } catch (error) {
        console.error("Video yükleme hatası:", error);
        return NextResponse.json(
            { error: "Video yüklenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.restaurantId) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: session.user.restaurantId },
            select: { videoUrl: true },
        });

        if (!restaurant?.videoUrl) {
            return NextResponse.json({ error: "Silinecek video bulunamadı" }, { status: 404 });
        }

        // Dosyayı sil
        const filePath = join(process.cwd(), "public", restaurant.videoUrl);
        if (existsSync(filePath)) {
            try {
                await unlink(filePath);
            } catch (error) {
                console.error("Video dosyası silinirken hata:", error);
            }
        }

        // Veritabanını güncelle
        await prisma.restaurant.update({
            where: { id: session.user.restaurantId },
            data: { videoUrl: null },
        });

        return NextResponse.json({
            success: true,
            message: "Video başarıyla silindi",
        });
    } catch (error) {
        console.error("Video silme hatası:", error);
        return NextResponse.json(
            { error: "Video silinirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
