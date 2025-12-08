import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H',
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
    return '';
  }
}

async function main() {
  console.log('🌱 Demo restoranlar oluşturuluyor...\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 🇹🇷 TÜRK RESTORAN
  console.log('🇹🇷 Türk Restoranı oluşturuluyor...');

  const turkishOwner = await prisma.user.upsert({
    where: { email: 'demo-turk@qrmenu.com' },
    update: {},
    create: {
      email: 'demo-turk@qrmenu.com',
      password: await hash('demo123', 10),
      name: 'Demo Türk',
      role: 'RESTAURANT_OWNER',
      isActive: true,
    },
  });

  const turkishQR = await generateQRCode(`${baseUrl}/menu/lezzet-duragi`);

  const turkishRestaurant = await prisma.restaurant.upsert({
    where: { slug: 'lezzet-duragi' },
    update: {
      subscriptionPlan: 'MONTHLY',
      subscriptionStatus: 'ACTIVE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: true,
      lastPaymentDate: new Date(),
      isPendingPayment: false,
      socialMedia: {
        facebook: 'Lezzet-Durağı',
        instagram: 'Lezzet-Durağı',
      },
      videoUrl: null,
    },
    create: {
      name: 'Lezzet Durağı',
      slug: 'lezzet-duragi',
      subdomain: 'lezzet-duragi',
      description: 'Geleneksel Türk mutfağının modern yorumu',
      qrCode: turkishQR,
      wifiPassword: 'lezzet2024',
      ownerId: turkishOwner.id,
      isActive: true,
      socialMedia: {
        facebook: 'Lezzet-Durağı',
        instagram: 'Lezzet-Durağı',
      },
      videoUrl: null,
      // Abonelik bilgileri
      subscriptionPlan: 'MONTHLY',
      subscriptionStatus: 'ACTIVE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: true,
    },
  });

  // Türk kategorileri
  const turkishCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Başlangıçlar', order: 1, restaurantId: turkishRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'Ana Yemekler', order: 2, restaurantId: turkishRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'Tatlılar', order: 3, restaurantId: turkishRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'İçecekler', order: 4, restaurantId: turkishRestaurant.id },
    }),
  ]);

  // Türk ürünleri
  const turkishProducts = [
    {
      name: 'Mercimek Çorbası',
      description: 'Geleneksel Türk usulü kırmızı mercimek çorbası',
      price: 45,
      image: '/demo-images/mercimek-corbasi.png',
      categoryId: turkishCategories[0].id,
      order: 1,
    },
    {
      name: 'İskender Kebap',
      description: 'Yoğurt ve tereyağı ile servis edilen enfes İskender',
      price: 180,
      image: '/demo-images/iskender-kebap.png',
      categoryId: turkishCategories[1].id,
      order: 1,
    },
    {
      name: 'Adana Kebap',
      description: 'Özel baharatlarla hazırlanmış acılı kebap',
      price: 165,
      image: '/demo-images/adana-kebap.png',
      categoryId: turkishCategories[1].id,
      order: 2,
    },
    {
      name: 'Patlıcan Musakka',
      description: 'Kıymalı ve beşamelli enfes patlıcan musakka',
      price: 135,
      image: '/demo-images/patlican-musakka.png',
      categoryId: turkishCategories[1].id,
      order: 3,
    },
    {
      name: 'Baklava',
      description: 'Antep fıstıklı, ince açılmış geleneksel baklava',
      price: 85,
      image: '/demo-images/baklava.png',
      categoryId: turkishCategories[2].id,
      order: 1,
    },
    {
      name: 'Künefe',
      description: 'Sıcak servis edilen peynirli künefe',
      price: 95,
      image: '/demo-images/kunefe.png',
      categoryId: turkishCategories[2].id,
      order: 2,
    },
    {
      name: 'Ayran',
      description: 'Geleneksel Türk yoğurt içeceği',
      price: 20,
      image: '/demo-images/Ayran.png',
      categoryId: turkishCategories[3].id,
      order: 1,
    },
    {
      name: 'Türk Kahvesi',
      description: 'Türk lokumu ile servis edilen geleneksel kahve',
      price: 35,
      image: '/demo-images/türkkahvesi.png',
      categoryId: turkishCategories[3].id,
      order: 2,
    },
  ];

  for (const product of turkishProducts) {
    await prisma.product.create({
      data: {
        ...product,
        restaurantId: turkishRestaurant.id,
        isActive: true,
      },
    });
  }

  console.log(`✅ ${turkishProducts.length} Türk ürünü eklendi\n`);

  // 🇰🇷 KORE RESTORAN
  console.log('🇰🇷 Kore Restoranı oluşturuluyor...');

  const koreanOwner = await prisma.user.upsert({
    where: { email: 'demo-kore@qrmenu.com' },
    update: {},
    create: {
      email: 'demo-kore@qrmenu.com',
      password: await hash('demo123', 10),
      name: 'Demo Kore',
      role: 'RESTAURANT_OWNER',
      isActive: true,
    },
  });

  const koreanQR = await generateQRCode(`${baseUrl}/menu/seoul-kitchen`);

  const koreanRestaurant = await prisma.restaurant.upsert({
    where: { slug: 'seoul-kitchen' },
    update: {
      subscriptionPlan: 'MONTHLY',
      subscriptionStatus: 'ACTIVE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: true,
      lastPaymentDate: new Date(),
      isPendingPayment: false,
      socialMedia: {
        facebook: 'Seoul-Kitchen',
        instagram: 'Seoul-Kitchen',
      },
      videoUrl: null,
    },
    create: {
      name: 'Seoul Kitchen',
      slug: 'seoul-kitchen',
      subdomain: 'seoul-kitchen',
      description: 'Authentic Korean cuisine with a modern twist',
      qrCode: koreanQR,
      wifiPassword: 'seoul2024',
      ownerId: koreanOwner.id,
      isActive: true,
      socialMedia: {
        facebook: 'Seoul-Kitchen',
        instagram: 'Seoul-Kitchen',
      },
      videoUrl: null,
      // Abonelik bilgileri
      subscriptionPlan: 'MONTHLY',
      subscriptionStatus: 'ACTIVE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      autoRenew: true,
    },
  });

  // Kore kategorileri
  const koreanCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Starters', order: 1, restaurantId: koreanRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'Main Dishes', order: 2, restaurantId: koreanRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'Desserts', order: 3, restaurantId: koreanRestaurant.id },
    }),
    prisma.category.create({
      data: { name: 'Beverages', order: 4, restaurantId: koreanRestaurant.id },
    }),
  ]);

  // Kore ürünleri
  const koreanProducts = [
    {
      name: 'Kimchi',
      description: 'Traditional fermented Korean cabbage',
      price: 35,
      image: '/demo-images/kimchi.png',
      categoryId: koreanCategories[0].id,
      order: 1,
    },
    {
      name: 'Bulgogi',
      description: 'Marinated grilled beef with vegetables',
      price: 185,
      image: '/demo-images/Bulgogi (marinated beef).png',
      categoryId: koreanCategories[1].id,
      order: 1,
    },
    {
      name: 'Bibimbap',
      description: 'Mixed rice with vegetables and egg in stone bowl',
      price: 145,
      image: '/demo-images/Bibimbap (stone bowl rice).png',
      categoryId: koreanCategories[1].id,
      order: 2,
    },
    {
      name: 'Tteokbokki',
      description: 'Spicy Korean rice cakes',
      price: 95,
      image: '/demo-images/Tteokbokki (spicy rice cakes).png',
      categoryId: koreanCategories[1].id,
      order: 3,
    },
    {
      name: 'Korean Fried Chicken',
      description: 'Crispy chicken with sweet & spicy glaze',
      price: 165,
      image: '/demo-images/Korean Fried Chicken.png',
      categoryId: koreanCategories[1].id,
      order: 4,
    },
    {
      name: 'Mochi Ice Cream',
      description: 'Soft rice cakes with ice cream filling',
      price: 75,
      image: '/demo-images/Mochi Ice Cream.png',
      categoryId: koreanCategories[2].id,
      order: 1,
    },
    {
      name: 'Korean Tea',
      description: 'Traditional Korean tea selection',
      price: 45,
      image: '/demo-images/Korean Tea.png',
      categoryId: koreanCategories[3].id,
      order: 1,
    },
    {
      name: 'Soju',
      description: 'Korean distilled spirit',
      price: 85,
      image: '/demo-images/Soju.png',
      categoryId: koreanCategories[3].id,
      order: 2,
    },
  ];

  for (const product of koreanProducts) {
    await prisma.product.create({
      data: {
        ...product,
        restaurantId: koreanRestaurant.id,
        isActive: true,
      },
    });
  }

  console.log(`✅ ${koreanProducts.length} Kore ürünü eklendi\n`);

  // Demo ödeme geçmişleri ekle
  console.log('💰 Demo ödeme geçmişi oluşturuluyor...');
  
  // Türk restoranı - 2 aylık ödeme (toplam 1500₺)
  await prisma.subscriptionHistory.createMany({
    data: [
      {
        restaurantId: turkishRestaurant.id,
        plan: 'MONTHLY',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        endDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        amount: 750,
        isPaid: true,
        paidAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        notes: 'İlk ay ödemesi',
      },
      {
        restaurantId: turkishRestaurant.id,
        plan: 'MONTHLY',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date(),
        amount: 750,
        isPaid: true,
        paidAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        notes: 'İkinci ay ödemesi',
      },
    ],
  });

  // Kore restoranı - 1 yıllık ödeme (3000₺)
  await prisma.subscriptionHistory.create({
    data: {
      restaurantId: koreanRestaurant.id,
      plan: 'YEARLY',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      amount: 3000,
      isPaid: true,
      paidAt: new Date(),
      notes: 'Yıllık paket ödemesi',
    },
  });

  console.log('✅ Demo ödemeler eklendi (Türk: 1500₺, Kore: 3000₺, Toplam: 4500₺)\n');

  console.log('🎉 Demo restoranlar hazır!\n');
  console.log('📍 URLs:');
  console.log(`   🇹🇷 Türk: ${baseUrl}/menu/lezzet-duragi`);
  console.log(`   🇰🇷 Kore: ${baseUrl}/menu/seoul-kitchen\n`);
  console.log('📧 Login:');
  console.log('   Türk: demo-turk@qrmenu.com / demo123');
  console.log('   Kore: demo-kore@qrmenu.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
