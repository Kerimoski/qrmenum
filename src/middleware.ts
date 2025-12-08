import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes
  const publicRoutes = ["/", "/login", "/menu", "/subscription-expired", "/about", "/contact", "/legal"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Redirect logged-in users from login page
  if (isLoggedIn && pathname === "/login") {
    const role = req.auth?.user?.role;
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/super-admin", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard and super-admin routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  if (isLoggedIn) {
    const role = req.auth?.user?.role;
    const isImpersonating = req.auth?.user?.isImpersonating;

    // Eğer impersonate modundaysa, super admin bile dashboard'a erişebilir
    if (pathname.startsWith("/super-admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Eğer impersonate modunda değilse ve süper admin ise, dashboard'a giremez
    if (pathname.startsWith("/dashboard") && role === "SUPER_ADMIN" && !isImpersonating) {
      return NextResponse.redirect(new URL("/super-admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

