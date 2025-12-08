import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // Auth kontrolü
    const session = await auth();
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { subject, message, recipients } = await req.json();

    // Validasyon
    if (!subject || !message || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "Eksik bilgi" },
        { status: 400 }
      );
    }

    // SMTP kontrolü
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: "E-posta yapılandırması eksik" },
        { status: 500 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const secure = port === 465;

    // Transporter oluştur
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // HTML şablon (Shadcn/ui inspired)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #09090b;
      background-color: #fafafa;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: #ffffff;
      padding: 32px;
      border-bottom: 1px solid #e4e4e7;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #09090b;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .content {
      padding: 32px;
    }
    .message {
      font-size: 15px;
      line-height: 1.7;
      color: #18181b;
    }
    .footer {
      background: #fafafa;
      border-top: 1px solid #e4e4e7;
      padding: 32px;
      text-align: center;
    }
    .website-link {
      font-size: 20px;
      font-weight: 700;
      color: #09090b;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 20px;
    }
    .whatsapp-button {
      display: inline-block;
      margin: 20px 0;
      padding: 14px 32px;
      background: #25D366;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
      transition: all 0.2s ease;
    }
    .whatsapp-icon {
      display: inline-block;
      margin-right: 8px;
      font-size: 20px;
    }
    .footer-text {
      font-size: 13px;
      color: #71717a;
      margin: 8px 0;
      line-height: 1.5;
    }
    .divider {
      height: 1px;
      background: #e4e4e7;
      margin: 20px 0;
    }
    .copyright {
      font-size: 12px;
      color: #a1a1aa;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 10px;
      }
      .header,
      .content,
      .footer {
        padding: 24px 20px;
      }
      .whatsapp-button {
        padding: 12px 24px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo-text">QR Dijital Menü</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="message">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <a href="https://qrdijitalmenum.com" class="website-link">qrdijitalmenum.com</a>
      
      <a href="https://wa.me/905443079413" class="whatsapp-button">
        <span class="whatsapp-icon">💬</span>
        WhatsApp'tan Bize Ulaşın
      </a>
      
      <p class="footer-text">
        Bu mail <strong>QR Dijital Menü</strong> tanıtım listesi üzerinden gönderilmiştir.
      </p>
      <p class="footer-text">
        Bu tür mailleri almak istemiyorsanız, iletişim sayfamızdan bize ulaşabilirsiniz.
      </p>
      
      <div class="divider"></div>
      
      <p class="copyright">
        &copy; ${new Date().getFullYear()} QR Dijital Menü. Tüm hakları saklıdır.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Her alıcıya mail gönder
    const results = await Promise.allSettled(
      recipients.map((email: string) =>
        transporter.sendMail({
          from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
          to: email,
          subject: subject,
          html: htmlContent,
        })
      )
    );

    // Başarı/başarısızlık sayısı
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
      console.error(`${failed} mail gönderilemedi`);
    }

    return NextResponse.json({
      success: true,
      message: `${successful} mail başarıyla gönderildi${
        failed > 0 ? `, ${failed} mail gönderilemedi` : ""
      }`,
      sent: successful,
      failed: failed,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json(
      { error: "Mail gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

