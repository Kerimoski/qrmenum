import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, TrendingUp, Palette, Globe, Zap, UtensilsCrossed, Folder, PlayCircle, Wifi, Check, Crown, DollarSign, Mail, Calendar } from "lucide-react";
import { DevicePhoneMobileIcon, ChartBarIcon, ShoppingBagIcon, FolderIcon, CogIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { MobilePreview } from "@/components/landing/mobile-preview";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-8 h-8" />
            <h1 className="text-2xl font-bold">QR Menü</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-gray-600 transition">
              Özellikler
            </Link>
            <Link href="#pricing" className="text-sm hover:text-gray-600 transition">
              Fiyatlar
            </Link>
            <Link href="/contact" className="text-sm hover:text-gray-600 transition">
              İletişim
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/demo-login">
              <Button>Demo Dene</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Yeni Nesil Menü Deneyimi
            </div>

            <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight text-gray-900">
              Menünüzü
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Dijitalleştirin
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Yapay Zeka destekli modern, hızlı ve temassız QR menü sistemi ile müşteri deneyimini bir üst seviyeye taşıyın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
                  İletişime Geç
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-gray-50 transition-all duration-300">
                  Giriş Yap
                </Button>
              </Link>
            </div>

            {/* Mobil için Fiyatlar Butonu */}
            <div className="flex md:hidden justify-center mt-4">
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-gray-50 transition-all duration-300">
                  Fiyatlar
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-gray-100 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1 text-blue-600">50+</div>
                <div className="text-sm font-medium text-gray-500">Mutlu İşletme</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1 text-purple-600">10K+</div>
                <div className="text-sm font-medium text-gray-500">Günlük Okuma</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm">
                <div className="text-4xl font-bold mb-1 text-pink-600">%100</div>
                <div className="text-sm font-medium text-gray-500">Müşteri Memnuniyeti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Menus Section */}
      <section id="demo" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-medium mb-6">
              <DevicePhoneMobileIcon className="w-4 h-4" />
              Canlı Demo
            </div>
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              Örnek Menülerimizi İnceleyin
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Farklı mutfaklardan örnek menüler ile özelliklerimizi keşfedin
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Turkish Restaurant */}
            <div className="flex flex-col items-center">
              <MobilePreview
                menuUrl="/menu/lezzet-duragi"
                restaurantName="Lezzet Durağı"
                flag="🇹🇷"
              />
              <div className="mt-6 text-center space-y-3">
                <p className="text-gray-600">
                  Geleneksel lezzetler, modern sunum
                </p>
                <Link href="/menu/lezzet-duragi" target="_blank">
                  <Button size="lg" className="gap-2">
                    <DevicePhoneMobileIcon className="w-5 h-5" />
                    Demo&apos;yu Tam Ekranda Aç
                  </Button>
                </Link>
              </div>
            </div>

            {/* Korean Restaurant */}
            <div className="flex flex-col items-center">
              <MobilePreview
                menuUrl="/menu/seoul-kitchen"
                restaurantName="Seoul Kitchen"
                flag="🇰🇷"
              />
              <div className="mt-6 text-center space-y-3">
                <p className="text-gray-600">
                  Modern Korean fusion deneyimi
                </p>
                <Link href="/menu/seoul-kitchen" target="_blank">
                  <Button size="lg" className="gap-2">
                    <DevicePhoneMobileIcon className="w-5 h-5" />
                    Demo&apos;yu Tam Ekranda Aç
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-6 shadow-lg">
              Fiyatlandırma
            </div>
            <h3 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Size Uygun Paketi Seçin
            </h3>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tüm paketlerde <span className="font-semibold text-blue-600">sınırsız özellikler</span>. 
              Kullanıcı dostu arayüz ile restoran yönetimi artık çok kolay!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Aylık Paket */}
            <div className="relative">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30 backdrop-blur-sm overflow-hidden relative">
              {/* 7 Gün Deneme Ücretsiz - Modern Çapraz Ribbon */}
              <div className="absolute top-8 -left-12 w-64 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white text-sm font-black py-2.5 text-center transform -rotate-45 shadow-2xl z-20 tracking-wide">
                7 GÜN ÜCRETSİZ DENE
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">Aylık Paket</CardTitle>
                <div className="mt-6">
                  <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">750₺</span>
                  <span className="text-xl text-gray-600 font-medium">/ay</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">Uygun fiyat ile başlayın</p>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3 mb-8">
                  {[
                    "Sınırsız Ürün",
                    "Özelleştirilmiş QR Kod Şablonları",
                    "Sınırsız QR kod",
                    "Çoklu Dil Desteği (5 dil)",
                    "Video Tanıtım",
                    "Gelişmiş Analitik",
                    "Kategori Yönetimi",
                    "Sosyal Medya Entegrasyonu",
                    "Özelleştirilebilir Tema",
                    "Mobil Uyumlu Tasarım",
                    "7/24 Destek",
                    "Kullanıcı Dostu Arayüz",
                    "Avantajlı Restoran Yönetimi"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                    Hemen Başla
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </div>

            {/* Yıllık Paket - Popüler */}
            <div className="relative">
              {/* POPÜLER Badge - Kartın Dışında, Üstte */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-2.5 rounded-full text-base font-black shadow-2xl border-4 border-white animate-pulse">
                  ⭐ POPÜLER ⭐
                </div>
              </div>
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-4 border-green-400 hover:border-green-500 bg-white hover:bg-gradient-to-br hover:from-white hover:to-green-50/30 backdrop-blur-sm overflow-hidden relative scale-105">
              {/* 7 Gün Deneme Ücretsiz - Modern Çapraz Ribbon */}
              <div className="absolute top-8 -left-12 w-64 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white text-sm font-black py-2.5 text-center transform -rotate-45 shadow-2xl z-30 tracking-wide">
                7 GÜN ÜCRETSİZ DENE
              </div>
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-3xl opacity-10"></div>
              <CardHeader className="text-center pb-8 pt-8 relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold mb-2">Yıllık Paket</CardTitle>
                <div className="mt-6">
                  <span className="text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">3.000₺</span>
                  <span className="text-xl text-gray-600 font-medium">/yıl</span>
                </div>
                <div className="mt-4">
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-base px-4 py-2 font-bold">
                    250₺/ay - %67 İndirim 🎉
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-semibold">En avantajlı seçenek!</p>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3 mb-8">
                  {[
                    "Sınırsız Ürün",
                    "Özelleştirilmiş QR Kod Şablonları",
                    "Sınırsız QR kod",
                    "Çoklu Dil Desteği (5 dil)",
                    "Video Tanıtım",
                    "Gelişmiş Analitik",
                    "Kategori Yönetimi",
                    "Sosyal Medya Entegrasyonu",
                    "Özelleştirilebilir Tema",
                    "Mobil Uyumlu Tasarım",
                    "7/24 Destek",
                    "Kullanıcı Dostu Arayüz",
                    "Avantajlı Restoran Yönetimi"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg py-6" size="lg">
                    💚 Hemen Başla
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </div>

            {/* Kurumsal Paket */}
            <div className="relative">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-purple-300 hover:border-purple-500 bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-50/30 backdrop-blur-sm overflow-hidden relative">
              {/* 7 Gün Deneme Ücretsiz - Modern Çapraz Ribbon */}
              <div className="absolute top-8 -left-12 w-64 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white text-sm font-black py-2.5 text-center transform -rotate-45 shadow-2xl z-20 tracking-wide">
                7 GÜN ÜCRETSİZ DENE
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">Kurumsal Paket</CardTitle>
                <div className="mt-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Özel Fiyat</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">Büyük işletmeler için</p>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3 mb-8">
                  {[
                    "Sınırsız Ürün",
                    "Özelleştirilmiş QR Kod Şablonları",
                    "Sınırsız QR kod",
                    "Çoklu Dil Desteği (5 dil)",
                    "Video Tanıtım",
                    "Gelişmiş Analitik",
                    "Kategori Yönetimi",
                    "Sosyal Medya Entegrasyonu",
                    "Özelleştirilebilir Tema",
                    "Mobil Uyumlu Tasarım",
                    "7/24 Destek",
                    "Kullanıcı Dostu Arayüz",
                    "Avantajlı Restoran Yönetimi"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-4 border-t-2 border-purple-200 mt-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      👑 Çoklu Şube Yönetimi
                    </span>
                  </div>
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Teklif Al
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Ek Bilgi */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
              <p className="text-gray-700 mb-2">
                <strong>Tüm paketler</strong> aynı özelliklere sahiptir. Kurumsal pakette ek olarak birden fazla şube yönetimi bulunmaktadır.
              </p>
              <p className="text-sm text-gray-600">
                Sorularınız için <Link href="/contact" className="text-blue-600 hover:underline">bizimle iletişime geçin</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Modern Özellikler</h3>
            <p className="text-xl text-gray-600">Restoranınız için ihtiyacınız olan her şey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-blue-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Anında Güncelleme</CardTitle>
                <CardDescription className="text-base">
                  Fiyat değiştirin, anında yansısın. QR kod hiç değişmez.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-purple-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Mobil Öncelikli</CardTitle>
                <CardDescription className="text-base">
                  %95 mobil kullanım için optimize edilmiş tasarım.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-pink-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-pink-600" />
                </div>
                <CardTitle className="text-xl mb-2">Detaylı Analitik</CardTitle>
                <CardDescription className="text-base">
                  Menünüze kaç kişi baktı, hangi ürünler popüler?
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-orange-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-7 h-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl mb-2">Özelleştirilebilir</CardTitle>
                <CardDescription className="text-base">
                  Kendi markanıza uygun renkler ve tema seçenekleri.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-green-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">Çoklu Dil Desteği</CardTitle>
                <CardDescription className="text-base">
                  Turistik mekanlar için TR, EN, DE, FR, AR desteği.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-indigo-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="w-7 h-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl mb-2">QR Kod Yönetimi</CardTitle>
                <CardDescription className="text-base">
                  Masa numaralı QR kodlar, özel tasarım seçenekleri.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-teal-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UtensilsCrossed className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-xl mb-2">Ürün Yönetimi</CardTitle>
                <CardDescription className="text-base">
                  Fotoğraf, fiyat, açıklama, stok yönetimi tek yerden.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-amber-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Folder className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl mb-2">Kategori Sistemi</CardTitle>
                <CardDescription className="text-base">
                  Sürükle-bırak ile kolay sıralama ve düzenleme.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-red-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-7 h-7 text-red-600" />
                </div>
                <CardTitle className="text-xl mb-2">Tanıtım Videosu</CardTitle>
                <CardDescription className="text-base">
                  Restoranınızı tanıtan video menüde otomatik oynatılır.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-cyan-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-7 h-7 text-cyan-600" />
                </div>
                <CardTitle className="text-xl mb-2">WiFi Bilgisi</CardTitle>
                <CardDescription className="text-base">
                  Müşterilerinize WiFi şifresini menüden paylaşın.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-100 hover:border-violet-100 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">✨</span>
                </div>
                <CardTitle className="text-xl mb-2">AI Destekli İçerik</CardTitle>
                <CardDescription className="text-base">
                  Yapay zeka ile saniyeler içinde ürün açıklamaları ve çevirileri oluşturun.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Panel Previews */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Yönetim Paneli</h3>
            <p className="text-xl text-gray-600">Kolay kullanımlı ve güçlü admin paneli</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Dashboard Preview */}
            <div className="group">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <img
                  src="/demo-previews/dashboard.png"
                  alt="Dashboard Önizleme"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-600/90 text-white px-4 py-3 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span className="font-semibold">Dashboard Preview</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  Ana Dashboard
                </h4>
                <p className="text-sm text-gray-600">Detaylı analitik ve istatistikler</p>
              </div>
            </div>

            {/* Products Preview */}
            <div className="group">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <img
                  src="/demo-previews/products.png"
                  alt="Ürünler Önizleme"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-600 to-teal-600/90 text-white px-4 py-3 flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5" />
                  <span className="font-semibold">Products Preview</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-teal-600" />
                  Ürün Yönetimi
                </h4>
                <p className="text-sm text-gray-600">Ürünlerinizi kolayca yönetin</p>
              </div>
            </div>

            {/* Categories Preview */}
            <div className="group">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <img
                  src="/demo-previews/categories.png"
                  alt="Kategoriler Önizleme"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-600/90 text-white px-4 py-3 flex items-center gap-2">
                  <FolderIcon className="w-5 h-5" />
                  <span className="font-semibold">Categories Preview</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                  <FolderIcon className="w-5 h-5 text-amber-600" />
                  Kategori Sistemi
                </h4>
                <p className="text-sm text-gray-600">Sürükle-bırak ile düzenleme</p>
              </div>
            </div>

            {/* QR Templates Preview */}
            <div className="group">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <img
                  src="/demo-previews/qr-templates.png"
                  alt="QR Şablonları Önizleme"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-600/90 text-white px-4 py-3 flex items-center gap-2">
                  <QrCodeIcon className="w-5 h-5" />
                  <span className="font-semibold">QR Templates Preview</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                  <QrCodeIcon className="w-5 h-5 text-indigo-600" />
                  QR Şablonları
                </h4>
                <p className="text-sm text-gray-600">11 farklı tasarım seçeneği</p>
              </div>
            </div>

            {/* Settings Preview */}
            <div className="group">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <img
                  src="/demo-previews/settings.png"
                  alt="Ayarlar Önizleme"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-purple-600/90 text-white px-4 py-3 flex items-center gap-2">
                  <CogIcon className="w-5 h-5" />
                  <span className="font-semibold">Settings Preview</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                  <CogIcon className="w-5 h-5 text-purple-600" />
                  Ayarlar
                </h4>
                <p className="text-sm text-gray-600">Video, WiFi, QR kod ayarları</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Nasıl Çalışır?</h3>
            <p className="text-xl text-gray-600">3 basit adımda başlayın</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">Kayıt Olun</h4>
              <p className="text-gray-600">
                Ücretsiz hesap oluşturun, dakikalar içinde hazır olun.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">Menünüzü Oluşturun</h4>
              <p className="text-gray-600">
                Ürünlerinizi ekleyin, fotoğraf yükleyin, kategorilere ayırın.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2">QR&apos;ı Basın, Kullanın</h4>
              <p className="text-gray-600">
                QR kodunuzu indirin, masalarınıza koyun. Hepsi bu kadar!
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-12 md:p-16 text-center max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Hemen Başlamaya Hazır Mısınız?
            </h3>
            <p className="text-xl mb-8 text-gray-300">
              Bugün kaydolun, 5 dakika içinde menünüzü oluşturun.
            </p>
            <Link href="/demo-login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Demo Dene
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-6 h-6" />
                <span className="font-bold">QR Menü</span>
              </div>
              <p className="text-sm text-gray-600">
                Modern restoranlar için dijital menü çözümü.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#features">Özellikler</Link></li>

                <li><Link href="#">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">Hakkımızda</Link></li>
                <li><Link href="/contact">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/legal/privacy">Gizlilik</Link></li>
                <li><Link href="/legal/terms">Kullanım Koşulları</Link></li>
                <li><Link href="/legal/kvkk">KVKK</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 QR Menü. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}

