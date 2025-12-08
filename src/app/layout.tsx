import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QR Menü - Modern Dijital Menü Çözümü",
  description: "Restoranlar için modern, hızlı ve şık QR menü sistemi. Asla tekrar menü bastırmayın!",
  keywords: ["qr menü", "dijital menü", "restoran", "cafe", "menü sistemi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
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
