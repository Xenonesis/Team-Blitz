import { NextResponse } from 'next/server';

// Simple in-memory rate limiting (use Redis in production for multiple instances)
const rateLimitMap = new Map();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  '/api/auth/login': { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  '/api/auth/register': { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  '/api/': { requests: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes for other APIs
};

function getRateLimitKey(ip, pathname) {
  return `${ip}:${pathname}`;
}

function isRateLimited(ip, pathname) {
  // Find matching rate limit config
  let config = null;
  for (const [path, cfg] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path)) {
      config = cfg;
      break;
    }
  }

  if (!config) return false;

  const key = getRateLimitKey(ip, pathname);
  const now = Date.now();
  const windowStart = now - config.window;

  // Get or create rate limit data
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }

  const requests = rateLimitMap.get(key);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitMap.set(key, validRequests);

  // Check if rate limit exceeded
  if (validRequests.length >= config.requests) {
    return true;
  }

  // Add current request
  validRequests.push(now);
  rateLimitMap.set(key, validRequests);

  return false;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(ip, pathname)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Block access to sensitive files in production
  // NODE_ENV=production
  if (true) {
    const blockedPaths = [
      '/.env',
      '/.env.local',
      '/.env.production',
      '/package.json',
      '/package-lock.json',
      '/.git',
    ];

    if (blockedPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};