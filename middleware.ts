import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect paths based on user role
    if (path.startsWith('/admin') && !token?.isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (path.startsWith('/doctor') && !token?.isDoctor) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (path.startsWith('/patient') && !token?.isPatient) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these paths with authentication
export const config = {
  matcher: ['/admin/:path*', '/doctor/:path*', '/patient/:path*'],
};