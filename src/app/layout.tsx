import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR Menü - Dijital Menü Sistemi | QR Menüm ile Restoranınızı Dijitalleştirin",
  description: "QR Menü sistemi ile restoranınızı dijitalleştirin. QR kod ile menü, dijital menü çözümleri, online menü oluşturma. Hızlı, modern ve kullanıcı dostu QR menüm platformu.",
  keywords: [
    "qr menü",
    "qr menüm",
    "dijital menü",
    "qr",
    "menü",
    "qr kod menü",
    "restoran menü sistemi",
    "dijital restoran menüsü",
    "online menü",
    "qr menü oluşturma",
    "restoran dijitalleşme",
    "temassız menü",
    "akıllı menü",
    "restoran qr kod",
  ],
  authors: [{ name: "QR Menü" }],
  creator: "QR Menü",
  publisher: "QR Menü",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://qrmenurestoranim.com",
    title: "QR Menü - Dijital Menü Sistemi",
    description: "Restoranınızı dijitalleştirin. Modern QR menü çözümleri ile müşterilerinize kusursuz bir deneyim sunun.",
    siteName: "QR Menü",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Menü - Dijital Menü Sistemi",
    description: "Restoranınızı dijitalleştirin. Modern QR menü çözümleri.",
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
