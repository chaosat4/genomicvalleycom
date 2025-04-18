import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

interface JWTPayload {
  sub: string;
  email: string;
  is_admin: boolean;
  type: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyJWT<JWTPayload>(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          is_admin: true,
          image: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (verifyError: unknown) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token', details: verifyError instanceof Error ? verifyError.message : 'Unknown error' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('ME endpoint error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
} 