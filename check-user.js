const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = 'deneme3@gmail.com';
    console.log(`Checking user with email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { restaurant: true }
    });

    if (user) {
        console.log('User found:', user.id);
        console.log('Has restaurant:', !!user.restaurant);
        if (user.restaurant) {
            console.log('Restaurant:', user.restaurant.name);
        } else {
            console.log('WARNING: User exists but has no restaurant (Orphan User)');
        }
    } else {
        console.log('User not found');
    }
}

checkUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
