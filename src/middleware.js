import { NextResponse } from 'next/server';

// This is a proxy configuration for Next.js 16+
export function middleware(request) {
  const response = NextResponse.next();
  
  // Add performance headers
  const pathname = request.nextUrl.pathname;
  
  // Cache static assets aggressively
  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Cache API responses with revalidation
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
  }
  
  // Enable back/forward cache for pages (not in dev mode)
  if (process.env.NODE_ENV === 'production') {
    // Allow pages to be cached for bfcache
    if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
