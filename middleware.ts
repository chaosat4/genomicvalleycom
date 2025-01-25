import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Allow API routes to handle their own auth
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    try {
      const userResponse = await fetch(`${req.nextUrl.origin}/api/me`, {
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      });

      if (!userResponse.ok) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
      }

      const userData = await userResponse.json();
      if (!userData.is_admin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};