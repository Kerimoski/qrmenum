import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "erdurunabdulkerim@gmail.com";
    const password = "5443079413Kk.";
    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            isActive: true,
            role: "SUPER_ADMIN"
        }
    });

    console.log(`✅ ${email} için şifre başarıyla güncellendi!`);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
