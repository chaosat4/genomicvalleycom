import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { serviceSchema } from '@/lib/validation/schemas';
import { escapeRegex } from '@/lib/api/safe-regex';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { handleOptions, withCors } from '@/lib/api/cors';
import { parseEnumParam, parsePositiveInt } from '@/lib/api/query';
import { requireAdmin } from '@/lib/api/admin-guard';

const allowedCategories = ['diagnostic', 'research'] as const;
const allowedStatuses = ['published', 'draft', 'archived'] as const;
const allowedStockStatuses = ['in_stock', 'out_of_stock', 'limited'] as const;

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const page         = parsePositiveInt(searchParams.get('page'), 1, 1, 10_000);
    const limit        = parsePositiveInt(searchParams.get('limit'), 20, 1, 100);
    const categoryRaw  = searchParams.get('category');
    const statusRaw    = searchParams.get('status');
    const stockStatusRaw = searchParams.get('stockStatus');
    const search       = searchParams.get('search');
    const skip         = (page - 1) * limit;

    const category    = parseEnumParam(categoryRaw, allowedCategories);
    const status      = parseEnumParam(statusRaw, allowedStatuses);
    const stockStatus = parseEnumParam(stockStatusRaw, allowedStockStatuses);

    if (categoryRaw && !category)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid category filter' }, { status: 400 }));
    if (statusRaw && !status)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid status filter' }, { status: 400 }));
    if (stockStatusRaw && !stockStatus)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid stockStatus filter' }, { status: 400 }));

    const filter: any = {};
    if (category)   filter.categoryName = category;
    if (status)     filter.status = status;
    if (stockStatus) filter.stockStatus = stockStatus;
    if (search?.trim()) {
      const safe = escapeRegex(search.trim().slice(0, 120));
      filter.$or = [
        { 'mainContent.contentTitle': { $regex: safe, $options: 'i' } },
        { documentId: { $regex: safe, $options: 'i' } },
      ];
    }

    await connectDB();
    const [services, total] = await Promise.all([
      Service.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit)
        .populate('createdBy', 'name email').populate('lastModifiedBy', 'name email').lean(),
      Service.countDocuments(filter),
    ]);

    return withCors(request, NextResponse.json({
      success: true, data: services,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 }));
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-services:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = serviceSchema.safeParse(await request.json());
    if (!parsed.success)
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));

    await connectDB();
    const existing = await Service.findOne({ documentId: parsed.data.documentId });
    if (existing)
      return withCors(request, NextResponse.json({ success: false, error: 'Service with this document ID already exists' }, { status: 409 }));

    const service = await new Service(parsed.data).save();
    return withCors(request, NextResponse.json({ success: true, data: service, message: 'Service created successfully' }, { status: 201 }));
  } catch (error) {
    console.error('Error creating service:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 }));
  }
}
