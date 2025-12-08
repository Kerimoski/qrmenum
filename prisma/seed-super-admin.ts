
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SUPER_ADMIN_EMAIL || "erdurunabdulkerim@gmail.com";
    // Fallback if env is not loaded in this script context, usually better to ensure env is loaded or passed
    // But hardcoding the user's provided values as verification step
    const hardcodedEmail = "erdurunabdulkerim@gmail.com";
    const password = process.env.SUPER_ADMIN_PASSWORD || "5443079413Kk.";
    const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

    console.log(`Seeding Super Admin: ${hardcodedEmail}`);

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email: hardcodedEmail },
        update: {
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            name,
            isActive: true,
        },
        create: {
            email: hardcodedEmail,
            password: hashedPassword,
            name,
            role: Role.SUPER_ADMIN,
            isActive: true,
        },
    });

    console.log(`Super Admin upserted: ${user.email} (ID: ${user.id})`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
