import { NextRequest, NextResponse } from 'next/server';
import { sendCallRequestEmail } from '@/lib/mail';
import { callRequestSchema } from '@/lib/validation/schemas';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`request-call:${ip}`, { windowMs: 60_000, max: 8 });
    if (!rl.allowed) {
      const res = NextResponse.json(
        { success: false, error: 'Too many requests', code: 'RATE_LIMITED' },
        { status: 429 }
      );
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = callRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withCors(
        request,
        NextResponse.json(
          { success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues },
          { status: 400 }
        )
      );
    }

    await sendCallRequestEmail(parsed.data.phone);

    return withCors(
      request,
      NextResponse.json(
        {
          success: true,
          message: 'Call request received successfully',
        },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error('Call request error:', error);
    return withCors(
      request,
      NextResponse.json(
        { success: false, error: 'Failed to process request' },
        { status: 500 }
      )
    );
  }
}
