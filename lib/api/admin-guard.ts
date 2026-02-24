import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from './cors';

export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return withCors(
      request,
      NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    );
  }
  if ((session.user as any).role !== 'admin') {
    return withCors(
      request,
      NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    );
  }
  return null; // access granted
}
