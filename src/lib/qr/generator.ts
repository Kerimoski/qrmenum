import QRCode from "qrcode";

/**
 * QR kod oluşturur ve base64 string olarak döner
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("QR kod oluşturma hatası:", error);
    throw new Error("QR kod oluşturulamadı");
  }
}

/**
 * Restoran için menü URL'i oluşturur
 */
export function getMenuUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/menu/${slug}`;
}

