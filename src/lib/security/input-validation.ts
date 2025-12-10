/**
 * Input validation ve sanitization fonksiyonları
 * XSS ve SQL injection saldırılarına karşı koruma
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Türkiye formatı)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitize string - XSS koruması
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // HTML tags
    .replace(/javascript:/gi, "") // JavaScript protokolü
    .replace(/on\w+=/gi, "") // Event handlers
    .trim();
}

// Sanitize HTML - Sadece güvenli HTML'e izin ver
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>.*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .trim();
}

// SQL injection koruması (Prisma zaten koruyor ama ekstra önlem)
export function isSafeSqlInput(input: string): boolean {
  const dangerousPatterns = [
    /(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b)/i,
    /('|"|;|--|\*|\/\*|\*\/|xp_|sp_)/,
    /(\bEXEC\b|\bEXECUTE\b|\bUNION\b|\bSELECT\b)/i,
  ];
  
  return !dangerousPatterns.some((pattern) => pattern.test(input));
}

// File upload validation
export function isValidFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? allowedTypes.includes(ext) : false;
}

// File size validation (MB cinsinden)
export function isValidFileSize(sizeInBytes: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
}

// Slug validation (URL-safe)
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// Number validation with range
export function isValidNumber(
  value: number,
  min?: number,
  max?: number
): boolean {
  if (typeof value !== "number" || isNaN(value)) return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

// Strong password validation
export function isStrongPassword(password: string): boolean {
  // En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Color hex validation
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

// CUID validation (Prisma ID format)
export function isValidCuid(id: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(id);
}

// IP validation
export function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Rate limit key generation
export function generateRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

