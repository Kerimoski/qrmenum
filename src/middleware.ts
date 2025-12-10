import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting map (in-memory - production için Redis kullanın)
const ratelimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit konfigürasyonu
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 dakika
  maxRequests: 100, // 1 dakikada max 100 istek
  apiMaxRequests: 50, // API için daha sıkı limit
};

function rateLimit(ip: string, isApi: boolean = false): boolean {
  const now = Date.now();
  const limit = isApi ? RATE_LIMIT.apiMaxRequests : RATE_LIMIT.maxRequests;
  
  const userData = ratelimitMap.get(ip);
  
  if (!userData || now > userData.resetTime) {
    ratelimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return true;
  }
  
  if (userData.count >= limit) {
    return false;
  }
  
  userData.count++;
  return true;
}

// Cleanup function - her 10 dakikada bir eski kayıtları temizle
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ratelimitMap.entries()) {
    if (now > data.resetTime) {
      ratelimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Rate limiting - IP address al
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";
  const isApi = request.nextUrl.pathname.startsWith("/api");
  
  if (!rateLimit(ip, isApi)) {
    return new NextResponse("Çok fazla istek. Lütfen daha sonra tekrar deneyin.", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  // Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://generativelanguage.googleapis.com",
      "media-src 'self' blob:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
