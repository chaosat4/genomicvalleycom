import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Panel from '@/lib/models/Panel';
import { panelSchema } from '@/lib/validation/schemas';
import { escapeRegex } from '@/lib/api/safe-regex';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { parsePositiveInt } from '@/lib/api/query';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInt(searchParams.get('page'), 1, 1, 10_000);
    const limit = parsePositiveInt(searchParams.get('limit'), 50, 1, 100);
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search && search.trim()) {
      const safe = escapeRegex(search.trim().slice(0, 120));
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { documentId: { $regex: safe, $options: 'i' } },
      ];
    }

    await getMongoClient();
    const [panels, total] = await Promise.all([
      Panel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Panel.countDocuments(filter),
    ]);

    return withCors(request, NextResponse.json({ success: true, data: panels, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }));
  } catch (error) {
    console.error('Error fetching panels:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch panels' }, { status: 500 }));
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-panels:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = panelSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    await getMongoClient();

    const existingPanel = await Panel.findOne({ documentId: body.documentId });
    if (existingPanel) {
      return withCors(request, NextResponse.json({ success: false, error: 'Panel with this document ID already exists' }, { status: 409 }));
    }

    const panel = new Panel(body);
    await panel.save();

    return withCors(request, NextResponse.json({ success: true, data: panel, message: 'Panel created successfully' }, { status: 201 }));
  } catch (error) {
    console.error('Error creating panel:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to create panel' }, { status: 500 }));
  }
}
