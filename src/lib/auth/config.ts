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
        console.log("🔑 [AUTH SERVER] Authorize denemesi başladı:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.warn("⚠️ [AUTH SERVER] Eksik bilgi: email veya şifre yok");
          return null;
        }

        try {
          // Kullanıcıyı veritabanından bul
          const user = await prisma.user.findUnique({
            where: {
              email: (credentials.email as string).trim(),
            },
            include: {
              restaurant: true,
            },
          });

          if (!user) {
            console.warn("❌ [AUTH SERVER] Kullanıcı bulunamadı:", credentials.email);
            return null;
          }

          if (!user.isActive) {
            console.warn("🚫 [AUTH SERVER] Kullanıcı hesabı pasif:", credentials.email);
            return null;
          }

          // Şifre kontrolü
          const isPasswordValid = await compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            console.warn("❌ [AUTH SERVER] Şifre hatalı:", credentials.email);
            return null;
          }

          // Son giriş zamanını güncelle
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          console.log("✅ [AUTH SERVER] Authorize başarılı! Rol:", user.role);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurantId: user.restaurant?.id,
          };
        } catch (error) {
          console.error("💥 [AUTH SERVER] Kritik hata:", error);
          throw error;
        }
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
      // Göreli URL'lere izin ver
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Aynı origin'deki URL'lere izin ver
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        if (urlObj.origin === baseObj.origin) return url;
      } catch (e) {
        // Geçersiz URL durumunda baseUrl'e dön
      }

      return baseUrl;
    },
  },
});

