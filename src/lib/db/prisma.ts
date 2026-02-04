import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Supabase için bağlantı URL'ine pgbouncer parametresi ekle
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || '';
  const separator = url.includes('?') ? '&' : '?';
  // Connection limit'i artırdık (özellikle super admin sayfası için)
  return `${url}${separator}pgbouncer=true&connection_limit=20`;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
