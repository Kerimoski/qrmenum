import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true, // VPS/Production için IP ve domain güvenliği
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 [AUTH] authorize denemesi:", credentials.email);

        // Kullanıcıyı veritabanından bul (Case-insensitive)
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: (credentials.email as string).toLowerCase(),
              mode: 'insensitive'
            },
          },
          include: {
            restaurant: true,
          },
        });

        if (!user) {
          console.warn("❌ [AUTH] Kullanıcı bulunamadı:", credentials.email);
          return null;
        }

        if (!user.isActive) {
          console.warn("❌ [AUTH] Kullanıcı pasif:", credentials.email);
          return null;
        }

        console.log("✅ [AUTH] Kullanıcı bulundu, şifre kontrol ediliyor...");

        // Şifre kontrolü
        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          console.warn("❌ [AUTH] Hatalı şifre:", credentials.email);
          return null;
        }

        // Son giriş zamanını güncelle
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        console.log("✅ [AUTH] Giriş başarılı:", user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId: user.restaurant?.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.restaurantId = user.restaurantId;
      }

      // Update token when session is updated (for impersonation)
      if (trigger === "update" && session) {
        token.isImpersonating = session.isImpersonating;
        token.originalUserId = session.originalUserId;
        token.originalUserName = session.originalUserName;

        if (session.isImpersonating) {
          // When impersonating, override user info
          token.id = session.impersonatedUserId;
          token.restaurantId = session.restaurantId;
        } else {
          // When exiting impersonation, restore original user
          if (token.originalUserId) {
            token.id = token.originalUserId;
            token.restaurantId = session.restaurantId;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.restaurantId = token.restaurantId as string;
        session.user.isImpersonating = token.isImpersonating as boolean | undefined;
        session.user.originalUserId = token.originalUserId as string;
        session.user.originalUserName = token.originalUserName as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // baseUrl'in sonundaki slash'ı temizle
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      // Göreli URL'ler için (/dashboard gibi)
      if (url.startsWith("/")) return `${normalizedBase}${url}`;

      // Eğer url zaten tam bir URL ise ve origin eşleşiyorsa izin ver
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(normalizedBase);
        if (urlObj.origin === baseObj.origin) return url;
      } catch (e) { }

      // Aksi takdirde login veya base URL'e dön
      return normalizedBase;
    },
  },
});
