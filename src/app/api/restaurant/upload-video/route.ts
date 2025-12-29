import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { supabaseAdmin } from "@/lib/supabase";

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

        // Eski videoyu sil (varsa) - Supabase'den
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: session.user.restaurantId },
            select: { videoUrl: true },
        });

        if (restaurant?.videoUrl && restaurant.videoUrl.includes('supabase.co')) {
            // URL'den dosya adını ayıkla
            const urlParts = restaurant.videoUrl.split('/');
            const oldFileName = urlParts[urlParts.length - 1];
            try {
                await supabaseAdmin.storage
                    .from('uploads')
                    .remove([`videos/${oldFileName}`]);
            } catch (error) {
                console.error("Eski video Supabase'den silinirken hata:", error);
            }
        }

        // Dosyayı buffer'a çevir
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = file.name.split('.').pop() || 'mp4';
        const fileName = `${session.user.restaurantId}-${Date.now()}.${fileExtension}`;

        // Supabase Storage'a yükle
        const { error: uploadError } = await supabaseAdmin.storage
            .from('uploads')
            .upload(`videos/${fileName}`, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase video yükleme hatası:", uploadError);
            return NextResponse.json({ error: "Video kaydedilirken bir hata oluştu" }, { status: 500 });
        }

        // Public URL oluştur
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('uploads')
            .getPublicUrl(`videos/${fileName}`);

        // Veritabanını güncelle
        await prisma.restaurant.update({
            where: { id: session.user.restaurantId },
            data: { videoUrl: publicUrl },
        });

        return NextResponse.json({
            success: true,
            videoUrl: publicUrl,
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

        // Dosyayı Supabase'den sil
        if (restaurant.videoUrl.includes('supabase.co')) {
            const urlParts = restaurant.videoUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const { error: deleteError } = await supabaseAdmin.storage
                .from('uploads')
                .remove([`videos/${fileName}`]);

            if (deleteError) {
                console.error("Video Supabase'den silinirken hata:", deleteError);
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
