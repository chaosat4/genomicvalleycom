import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Panel from '@/lib/models/Panel';
import { panelSchema } from '@/lib/validation/schemas';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { isValidObjectId } from '@/lib/api/object-id';
import { requireAdmin } from '@/lib/api/admin-guard';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid panel id', code: 'INVALID_ID' }, { status: 400 }));
    }
    await connectDB();
    const panel = await Panel.findById(id);
    if (!panel) return withCors(request, NextResponse.json({ success: false, error: 'Panel not found' }, { status: 404 }));
    return withCors(request, NextResponse.json({ success: true, data: panel }));
  } catch (error) {
    console.error('Error fetching panel:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch panel' }, { status: 500 }));
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-panels:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid panel id', code: 'INVALID_ID' }, { status: 400 }));
    }
    const parsed = panelSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    await connectDB();
    const panel = await Panel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!panel) return withCors(request, NextResponse.json({ success: false, error: 'Panel not found' }, { status: 404 }));
    return withCors(request, NextResponse.json({ success: true, data: panel, message: 'Panel updated successfully' }));
  } catch (error) {
    console.error('Error updating panel:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to update panel' }, { status: 500 }));
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-panels:${ip}`, { windowMs: 60_000, max: 20 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid panel id', code: 'INVALID_ID' }, { status: 400 }));
    }
    await connectDB();
    const panel = await Panel.findByIdAndDelete(id);
    if (!panel) return withCors(request, NextResponse.json({ success: false, error: 'Panel not found' }, { status: 404 }));
    return withCors(request, NextResponse.json({ success: true, message: 'Panel deleted successfully' }));
  } catch (error) {
    console.error('Error deleting panel:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to delete panel' }, { status: 500 }));
  }
}
