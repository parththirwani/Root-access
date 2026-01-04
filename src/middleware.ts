import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on admin pages (not API routes)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public access to login and signup pages
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return NextResponse.next();
  }

  // Check for auth token presence (but don't verify it here)
  // Verification will happen in the API routes
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Let the request through - API routes will verify the token
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};