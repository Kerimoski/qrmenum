"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 [DEBUG] Giriş butona tıklandı. Email:", email);
    setError("");
    setIsLoading(true);

    try {
      console.log("🔐 [DEBUG] signIn('credentials') çağrılıyor...");

      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      console.log("📊 [DEBUG] signIn sonucu dönüd:", result);

      if (result?.error) {
        console.error("❌ [DEBUG] Giriş hatası:", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Email veya şifre hatalı");
        } else {
          setError("Giriş başarısız: " + result.error);
        }
      } else if (result?.ok) {
        console.log("✅ [DEBUG] Giriş başarılı! Session kontrol ediliyor...");

        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Session fetch failed");

        const session = await response.json();
        console.log("👤 [DEBUG] Mevcut session:", session);

        if (session?.user?.role === "SUPER_ADMIN") {
          console.log("👑 [DEBUG] Super Admin - Yönlendiriliyor: /super-admin");
          window.location.href = "/super-admin";
        } else {
          console.log("🍽️ [DEBUG] Restaurant Owner - Yönlendiriliyor: /dashboard");
          window.location.href = "/dashboard";
        }
      } else {
        console.error("⚠️ [DEBUG] Beklenmeyen durum:", result);
        setError("Bilinmeyen bir hata oluştu.");
      }
    } catch (err: any) {
      console.error("💥 [DEBUG] Exception yakalandı:", err);
      setError("Bağlantı hatası veya sistemsel bir sorun oluştu.");
    } finally {
      console.log("🏁 [DEBUG] Login işlemi tamamlandı.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <QrCode className="w-10 h-10" />
            <span className="text-3xl font-bold">QR Menü</span>
          </Link>
          <p className="text-gray-600">Restoran yönetim paneli</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@restoran.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Şifre
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

