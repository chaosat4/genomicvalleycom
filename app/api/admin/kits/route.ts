import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Kit from '@/lib/models/Kit';
import { kitSchema } from '@/lib/validation/schemas';
import { escapeRegex } from '@/lib/api/safe-regex';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { parseBooleanParam, parsePositiveInt } from '@/lib/api/query';
import { requireAdmin } from '@/lib/api/admin-guard';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const page     = parsePositiveInt(searchParams.get('page'), 1, 1, 10_000);
    const limit    = parsePositiveInt(searchParams.get('limit'), 50, 1, 100);
    const category = searchParams.get('category');
    const search   = searchParams.get('search');
    const isActiveRaw = searchParams.get('isActive');
    const skip     = (page - 1) * limit;

    const filter: any = {};
    if (category) filter.category = category;

    const isActive = parseBooleanParam(isActiveRaw);
    if (isActiveRaw !== null && isActive === undefined)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid isActive filter' }, { status: 400 }));
    if (isActive !== undefined) filter.isActive = isActive;

    if (search?.trim()) {
      const safe = escapeRegex(search.trim().slice(0, 120));
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { code: { $regex: safe, $options: 'i' } },
      ];
    }

    await connectDB();
    const [kits, total] = await Promise.all([
      Kit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Kit.countDocuments(filter),
    ]);

    return withCors(request, NextResponse.json({
      success: true, data: kits,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (error) {
    console.error('Error fetching kits:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch kits' }, { status: 500 }));
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-kits:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = kitSchema.safeParse(await request.json());
    if (!parsed.success)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));

    await connectDB();
    const existing = await Kit.findOne({ code: parsed.data.code });
    if (existing)
      return withCors(request, NextResponse.json({ success: false, error: 'Kit with this code already exists' }, { status: 409 }));

    const kit = await new Kit(parsed.data).save();
    return withCors(request, NextResponse.json({ success: true, data: kit, message: 'Kit created successfully' }, { status: 201 }));
  } catch (error) {
    console.error('Error creating kit:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to create kit' }, { status: 500 }));
  }
}
