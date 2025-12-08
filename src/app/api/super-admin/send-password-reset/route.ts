import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';
import { sendPasswordResetEmail } from '@/lib/email/mailer';

// Rastgele güvenli şifre oluştur
function generateSecurePassword(length: number = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Yeni şifre oluştur
    const newPassword = generateSecurePassword(12);
    const hashedPassword = await hash(newPassword, 12);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Email gönder (opsiyonel - SMTP ayarları yoksa hata vermez)
    let emailSent = false;
    try {
      await sendPasswordResetEmail({
        name: user.name || 'Kullanıcı',
        email: user.email,
        newPassword,
      });
      console.log('✅ Şifre sıfırlama emaili gönderildi:', user.email);
      emailSent = true;
    } catch (emailError) {
      console.error('⚠️ Email gönderilemedi:', emailError);
      // Email hatası olsa bile işleme devam et
    }

    return NextResponse.json({ 
      success: true, 
      message: emailSent ? 'Yeni şifre oluşturuldu ve email ile gönderildi' : 'Yeni şifre oluşturuldu (email gönderilemedi)',
      newPassword, // Düz metin şifreyi döndür (sadece bu API için güvenli)
      emailSent
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

