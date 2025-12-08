import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';

// Kullanıcının şifresini güncelle (email ile)
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, newPassword } = await req.json();

        if (!email || !newPassword) {
            return NextResponse.json({ error: 'Email ve yeni şifre gerekli' }, { status: 400 });
        }

        if (newPassword.trim().length < 6) {
            return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 });
        }

        // Kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Şifreyi hashle ve güncelle
        const hashedPassword = await hash(newPassword.trim(), 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        console.log('✅ Şifre güncellendi:', user.email);

        return NextResponse.json({
            success: true,
            message: 'Şifre başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Şifre güncelleme hatası:', error);
        return NextResponse.json({ error: 'Şifre güncellenemedi' }, { status: 500 });
    }
}
