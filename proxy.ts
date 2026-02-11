import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  } catch (error) {
    console.error('Proxy error:', error);
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
  ]
};
