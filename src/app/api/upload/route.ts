import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

// Next.js route config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '150mb',
    },
  },
};

// Dosya yükleme için maksimum boyut: 150MB
const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB in bytes

// İzin verilen dosya türleri
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(req: NextRequest) {
  try {
    // Kullanıcı kontrolü
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // FormData'dan dosyayı al
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir." },
        { status: 400 }
      );
    }

    // Dosya uzantısını al
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    
    // Benzersiz dosya adı oluştur
    const filename = `${randomUUID()}.${extension}`;
    
    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosyayı kaydet
    const uploadPath = join(process.cwd(), "public", "uploads", filename);
    await writeFile(uploadPath, buffer);

    // Public URL oluştur
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

