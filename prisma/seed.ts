import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * ⚠️ UYARI: Bu seed dosyası SADECE Super Admin oluşturur.
 * Demo veriler EKLEMEZ. Sistem temiz başlar.
 * 
 * Demo veriler eklemek için 'seed-demo.ts' dosyasını kullanın.
 */

async function main() {
  console.log("🔐 Sadece Super Admin oluşturuluyor...");

  // .env'den Super Admin bilgilerini al
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@qrmenu.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "admin123";
  const adminName = process.env.SUPER_ADMIN_NAME || "Super Admin";

  // Super Admin kullanıcısı oluştur
  const hashedAdminPassword = await hash(adminPassword, 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      name: adminName,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      name: adminName,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Super Admin oluşturuldu:", superAdmin.email);
  console.log("📧 Email:", adminEmail);
  console.log("🔑 Şifre:", adminPassword);
  console.log("\n🎉 Sistem temiz ve hazır!");
  console.log("ℹ️  Demo veriler eklemek için: npm run db:seed:demo\n");
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
