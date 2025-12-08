import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import fs from 'fs/promises';
import path from 'path';

// Restoran silme - CASCADE DELETE
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Restoran ve ilişkili verileri getir
        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
            include: {
                products: {
                    select: { image: true }
                },
                owner: true,
            },
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restoran bulunamadı' }, { status: 404 });
        }

        console.log('🗑️ Restoran siliniyor:', restaurant.name);

        // 1. Dosyaları sil (filesystem)
        const filesToDelete: string[] = [];

        // Restaurant logo
        if (restaurant.logo) {
            filesToDelete.push(restaurant.logo);
        }

        // Product images
        restaurant.products.forEach(product => {
            if (product.image) {
                filesToDelete.push(product.image);
            }
        });

        // Dosyaları sil (hata olsa bile devam et)
        for (const filePath of filesToDelete) {
            try {
                const fullPath = path.join(process.cwd(), 'public', filePath);
                await fs.unlink(fullPath);
                console.log('✅ Dosya silindi:', filePath);
            } catch (error) {
                console.warn('⚠️ Dosya silinemedi:', filePath, error);
                // Devam et, dosya silme hatası işlemi durdurmasın
            }
        }

        // 2. Database'den sil (Cascade delete)
        // User silindiğinde, Prisma şemasındaki 'onDelete: Cascade' sayesinde
        // Restaurant ve ona bağlı tüm veriler (Category, Product, vb.) otomatik silinecek.

        await prisma.user.delete({
            where: { id: restaurant.ownerId },
        });

        console.log('✅ Kullanıcı silindi, cascade ile restoran da silindi:', restaurant.name);

        return NextResponse.json({
            success: true,
            message: `${restaurant.name} restoranı ve tüm ilişkili veriler başarıyla silindi`,
        });
    } catch (error) {
        console.error('❌ Restoran silme hatası:', error);
        return NextResponse.json(
            { error: 'Restoran silinemedi' },
            { status: 500 }
        );
    }
}
