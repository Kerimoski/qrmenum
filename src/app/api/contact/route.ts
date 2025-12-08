import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message, subscribeNewsletter } = body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Tüm alanların doldurulması zorunludur.' },
                { status: 400 }
            );
        }

        // Validate environment variables
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('Missing email credentials');
            return NextResponse.json(
                { error: 'Sunucu yapılandırma hatası: E-posta bilgileri eksik.' },
                { status: 500 }
            );
        }

        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587');
        // Force secure to false for port 587 (STARTTLS), true for 465
        const secure = port === 465 ? true : (process.env.SMTP_SECURE === 'true' && port !== 587);

        console.log('SMTP Config:', {
            host,
            port,
            secure,
            user: process.env.SMTP_USER,
            passLength: process.env.SMTP_PASS?.length
        });

        // Create transporter
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
            to: 'erdurunabdulkerim@gmail.com', // Destination email
            replyTo: email,
            subject: `📩 Yeni İletişim Mesajı: ${subject}`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; }
    .field { margin-bottom: 24px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 8px; display: block; }
    .value { font-size: 16px; color: #111827; font-weight: 500; }
    .message-box { background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin-top: 8px; }
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; }
    .highlight { color: #2563eb; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>QR Menü İletişim</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Gönderen</span>
        <div class="value">${name}</div>
      </div>
      
      <div class="field">
        <span class="label">E-posta Adresi</span>
        <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
      </div>

      ${phone ? `
      <div class="field">
        <span class="label">Telefon</span>
        <div class="value"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></div>
      </div>
      ` : ''}

      <div class="field">
        <span class="label">Konu</span>
        <div class="value">${subject}</div>
      </div>

      <div class="field">
        <span class="label">Mesaj İçeriği</span>
        <div class="message-box">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Bu mesaj <strong>QR Menü İletişim Formu</strong> üzerinden gönderilmiştir.</p>
      <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} QR Menü. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Tanıtım listesine kaydet (eğer onay verdiyse)
        if (subscribeNewsletter) {
            try {
                await prisma.newsletterSubscriber.upsert({
                    where: { email },
                    create: {
                        email,
                        name,
                        phone: phone || null,
                        message,
                        isActive: true,
                    },
                    update: {
                        name,
                        phone: phone || null,
                        message, // Son mesajı güncelle
                        isActive: true, // Tekrar aktif et
                    },
                });
            } catch (dbError) {
                console.error('Newsletter subscription error:', dbError);
                // Devam et, email gönderildi
            }
        }

        return NextResponse.json(
            { success: true, message: 'Mesajınız başarıyla gönderildi.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.' },
            { status: 500 }
        );
    }
}
