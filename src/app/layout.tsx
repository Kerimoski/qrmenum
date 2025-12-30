import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qrmenurestoranim.com"),
  title: {
    default: "QR Menü - Dijital Menü Sistemi | QR Menüm",
    template: "%s | QR Menü"
  },
  description: "Türkiye'nin en modern QR menü sistemi. Restoran, kafe ve oteller için temassız, hızlı ve şık dijital menü çözümleri. Hemen ücretsiz deneyin!",
  keywords: [
    "qr menü",
    "dijital menü",
    "qr kod menü",
    "temassız menü",
    "online menü",
    "restoran menü sistemi",
    "kafe qr menü",
    "ücretsiz qr menü",
    "qr menü oluşturma",
    "dijital yemek listesi",
    "qr menü fiyatları",
    "modern qr menü",
    "temassız sipariş sistemi"
  ],
  authors: [{ name: "QR Menü Ekibi" }],
  creator: "QR Menü",
  publisher: "QR Menü",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.qrmenurestoranim.com",
    title: "QR Menü - Restoranınızı Dijitalleştirin",
    description: "Modern, hızlı ve şık QR menü deneyimi. Müşterileriniz telefonlarıyla menünüze anında ulaşsın.",
    siteName: "QR Menü",
    images: [
      {
        url: "/og-image.png", // Henüz yok ama plana dahil edilebilir
        width: 1200,
        height: 630,
        alt: "QR Menü Dijital Sistem"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Menü - Dijital Menü Sistemi",
    description: "Restoranınızı dijitalleştirin. Modern QR menü çözümleri.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "gqI1oAptosk3Vj0olsh8KX3q1SELmns5ChD3JZaUSSg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0H7BWK3J13"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0H7BWK3J13');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster />
          <ConfirmDialog />
        </SessionProvider>
      </body>
    </html>
  );
}
