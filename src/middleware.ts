import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to login and signup pages
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return NextResponse.next();
  }

  // Check for auth token on all other admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('auth-token', '', { maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};