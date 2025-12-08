import nodemailer from 'nodemailer';

// Email transporter oluştur
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email gönderme fonksiyonu
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'QR Menü'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log('Email gönderildi:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return { success: false, error };
  }
}

// Yeni restoran hoşgeldin emaili
export async function sendWelcomeEmail(data: {
  restaurantName: string;
  ownerName: string;
  email: string;
  password: string;
  loginUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .credentials-box {
          background: white;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Hoş Geldiniz!</h1>
        <p>QR Menü Sisteminiz Hazır</p>
      </div>
      
      <div class="content">
        <p>Merhaba <strong>${data.ownerName}</strong>,</p>
        
        <p>
          <strong>${data.restaurantName}</strong> restoranınız için QR Menü sisteminiz başarıyla oluşturuldu! 
          Artık menünüzü dijital ortamda yönetebilir, müşterilerinize modern bir deneyim sunabilirsiniz.
        </p>

        <div class="credentials-box">
          <h3>🔐 Giriş Bilgileriniz</h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Şifre:</strong> <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${data.password}</code></p>
          <p><strong>Giriş URL:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a></p>
        </div>

        <div class="warning">
          <strong>⚠️ Önemli Güvenlik Uyarısı:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Bu email'i güvenli bir yerde saklayın</li>
            <li>İlk girişinizde mutlaka şifrenizi değiştirin</li>
            <li>Şifrenizi kimseyle paylaşmayın</li>
          </ul>
        </div>

        <center>
          <a href="${data.loginUrl}" class="button">
            Hemen Giriş Yap →
          </a>
        </center>

        <h3>📋 İlk Adımlar</h3>
        <ol>
          <li><strong>Giriş Yapın:</strong> Yukarıdaki butona tıklayarak panele giriş yapın</li>
          <li><strong>Kategori Ekleyin:</strong> Menü kategorilerinizi oluşturun (Başlangıçlar, Ana Yemekler, vb.)</li>
          <li><strong>Ürün Ekleyin:</strong> Lezzetli ürünlerinizi ekleyin, fotoğraflarını yükleyin</li>
          <li><strong>QR Kod İndirin:</strong> QR kodunuzu indirin ve masalarınıza yerleştirin</li>
          <li><strong>Test Edin:</strong> QR kodu okutarak menünüzü test edin</li>
        </ol>

        <h3>✨ Neler Yapabilirsiniz?</h3>
        <ul>
          <li>✅ Sınırsız ürün ekleyin</li>
          <li>✅ Fiyatları anında güncelleyin</li>
          <li>✅ Ürün görselleri yükleyin</li>
          <li>✅ Kategorileri düzenleyin</li>
          <li>✅ Görüntülenme istatistiklerini görün</li>
          <li>✅ Menünüzü tek tıkla pasif/aktif yapın</li>
        </ul>

        <p>
          Sorularınız veya yardıma ihtiyacınız olursa bizimle iletişime geçmekten çekinmeyin.
        </p>

        <p>
          Başarılar dileriz! 🚀<br>
          <strong>QR Menü Ekibi</strong>
        </p>
      </div>

      <div class="footer">
        <p>Bu email ${data.email} adresine gönderilmiştir.</p>
        <p>QR Menü - Modern Dijital Menü Çözümü</p>
        <p>&copy; ${new Date().getFullYear()} QR Menü. Tüm hakları saklıdır.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Hoş Geldiniz ${data.ownerName}!

${data.restaurantName} restoranınız için QR Menü sisteminiz hazır.

Giriş Bilgileriniz:
Email: ${data.email}
Şifre: ${data.password}
Giriş URL: ${data.loginUrl}

ÖNEMLİ: İlk girişinizde mutlaka şifrenizi değiştirin.

QR Menü Ekibi
  `;

  return sendEmail({
    to: data.email,
    subject: `🎉 ${data.restaurantName} - QR Menü Sisteminiz Hazır!`,
    html,
    text,
  });
}

// Şifre sıfırlama emaili
export async function sendPasswordResetEmail(data: {
  name: string;
  email: string;
  newPassword: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .password-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔑 Şifre Sıfırlama</h1>
      </div>
      <div class="content">
        <p>Merhaba <strong>${data.name}</strong>,</p>
        <p>Şifreniz yönetici tarafından sıfırlandı. Yeni şifreniz:</p>
        <div class="password-box">
          <h2 style="margin: 0; color: #667eea;">${data.newPassword}</h2>
        </div>
        <p><strong>⚠️ Güvenlik için ilk girişinizde şifrenizi değiştirin!</strong></p>
        <p>QR Menü Ekibi</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} QR Menü</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.email,
    subject: '🔑 QR Menü - Şifre Sıfırlama',
    html,
    text: `Merhaba ${data.name}, yeni şifreniz: ${data.newPassword}`,
  });
}

