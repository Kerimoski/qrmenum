# QR Menü - Multi-tenant SaaS Projesi

Modern restoranlar için dijital QR menü çözümü. **Asla tekrar menü bastırmayın!**

## 🚀 Özellikler

### ✨ Ana Özellikler
- **Anında Güncelleme**: Fiyat değiştirin, müşteriler anında görsün
- **Modern Tasarım**: Siyah-beyaz minimalist arayüz
- **Mobil Öncelikli**: %95 mobil kullanım için optimize
- **Çoklu Dil**: TR, EN, DE, FR, AR desteği
- **Detaylı Analitik**: Kim, ne zaman, neye baktı?
- **QR Kod Yönetimi**: Masa numaralı QR kodlar

### 🏗 Mimari Yapı
1. **Landing Page**: Pazarlama ve tanıtım
2. **Süper Admin**: Restoran yönetimi
3. **Restoran Paneli**: Menü ve ürün yönetimi
4. **Müşteri Menü**: Public menü görünümü

## 🛠 Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **UI**: Shadcn/ui
- **Veritabanı**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Clerk
- **QR Kod**: qrcode

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın

`.env.local` dosyasını düzenleyin:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Veritabanını Hazırlayın

```bash
# Prisma client oluştur
npm run db:generate

# Veritabanını senkronize et
npm run db:push

# (Opsiyonel) Prisma Studio'yu aç
npm run db:studio
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
qr-menu/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── dashboard/               # Restoran paneli
│   │   ├── super-admin/             # Süper admin paneli
│   │   └── menu/[slug]/             # Müşteri menü
│   ├── components/
│   │   ├── ui/                      # Shadcn/ui bileşenleri
│   │   ├── landing/                 # Landing bileşenleri
│   │   ├── admin/                   # Admin bileşenleri
│   │   └── menu/                    # Menü bileşenleri
│   └── lib/
│       ├── db/                      # Prisma client
│       └── utils.ts                 # Yardımcı fonksiyonlar
├── prisma/
│   └── schema.prisma                # Veritabanı şeması
└── public/                          # Statik dosyalar
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Ana**: Siyah (#000000) ve Beyaz (#FFFFFF)
- **Vurgu**: Gri tonları (#F3F4F6)

### Tipografi
- **Font**: Inter
- **Stil**: Modern, temiz, okunabilir

## 🗄 Veritabanı Şeması

### Ana Tablolar
- `User`: Kullanıcılar (restoran sahipleri, admin)
- `Restaurant`: Restoranlar
- `Category`: Menü kategorileri
- `Product`: Ürünler
- `MenuView`: Görüntülenme istatistikleri

### İlişkiler
- User → Restaurant (1:1)
- Restaurant → Category (1:N)
- Restaurant → Product (1:N)
- Category → Product (1:N)

## 📋 Yapılacaklar Listesi

### MVP (4 Hafta) ✅
- [x] Proje altyapısı kurulumu
- [x] Veritabanı tasarımı
- [x] Landing page
- [x] Dashboard layout
- [x] Müşteri menü görünümü
- [x] QR kod oluşturma

### V1.0 (8 Hafta)
- [ ] Authentication entegrasyonu
- [ ] CRUD işlemleri (Restoran, Ürün, Kategori)
- [ ] Fotoğraf yükleme
- [ ] Tema özelleştirme
- [ ] Çoklu dil desteği
- [ ] Detaylı analitik
- [ ] Email bildirimleri

### V2.0 (Post-Launch)
- [ ] Online sipariş
- [ ] Ödeme sistemi
- [ ] Müşteri yorumları
- [ ] Allergen bilgileri
- [ ] WhatsApp entegrasyonu

## 🚀 Deployment

### Vercel (Önerilen)

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Vercel dashboard'da tüm `.env.local` değişkenlerini ekleyin.

### Database
- Vercel Postgres
- Supabase
- Railway

## 📊 Başarı Metrikleri

### Teknik
- ⚡ Sayfa yüklenme < 1s
- 📱 Lighthouse score > 90
- 🔒 99.9% uptime

### İş
- 🎯 İlk 3 ayda 50 restoran
- 👥 500 görüntülenme/hafta per restoran
- ⭐ 4.5/5 memnuniyet

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'feat: add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altındadır.

## 📞 İletişim

Sorularınız için: info@qrmenu.com

---

**QR Menü** - Modern restoranlar için dijital çözüm 🚀

