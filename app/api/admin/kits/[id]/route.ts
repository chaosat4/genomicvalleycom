import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Kit from '@/lib/models/Kit';
import { kitSchema } from '@/lib/validation/schemas';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { isValidObjectId } from '@/lib/api/object-id';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-kits:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid kit id', code: 'INVALID_ID' }, { status: 400 }));
    }
    await getMongoClient();
    
    const kit = await Kit.findById(id);
    if (!kit) {
      return withCors(request, NextResponse.json({ success: false, error: 'Kit not found' }, { status: 404 }));
    }
    
    return withCors(request, NextResponse.json({ success: true, data: kit }));
  } catch (error) {
    console.error('Error fetching kit:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch kit' }, { status: 500 }));
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-kits:${ip}`, { windowMs: 60_000, max: 20 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid kit id', code: 'INVALID_ID' }, { status: 400 }));
    }
    const parsed = kitSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    await getMongoClient();
    
    const kit = await Kit.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!kit) {
      return withCors(request, NextResponse.json({ success: false, error: 'Kit not found' }, { status: 404 }));
    }
    
    return withCors(request, NextResponse.json({ success: true, data: kit, message: 'Kit updated successfully' }));
  } catch (error) {
    console.error('Error updating kit:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to update kit' }, { status: 500 }));
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid kit id', code: 'INVALID_ID' }, { status: 400 }));
    }
    await getMongoClient();
    
    const kit = await Kit.findByIdAndDelete(id);
    if (!kit) {
      return withCors(request, NextResponse.json({ success: false, error: 'Kit not found' }, { status: 404 }));
    }
    
    return withCors(request, NextResponse.json({ success: true, message: 'Kit deleted successfully' }));
  } catch (error) {
    console.error('Error deleting kit:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to delete kit' }, { status: 500 }));
  }
}
