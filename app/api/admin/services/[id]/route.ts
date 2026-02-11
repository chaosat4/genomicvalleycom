import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { serviceSchema } from '@/lib/validation/schemas';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { isValidObjectId } from '@/lib/api/object-id';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

// GET /api/admin/services/[id] - Get a single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid service id', code: 'INVALID_ID' }, { status: 400 }));
    }
    
    await getMongoClient();

    const service = await Service.findById(id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('mainContent.servicesList.kitRef');

    if (!service) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      ));
    }

    return withCors(request, NextResponse.json({
      success: true,
      data: service,
    }));
  } catch (error) {
    console.error('Error fetching service:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    ));
  }
}

// PUT /api/admin/services/[id] - Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-services:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid service id', code: 'INVALID_ID' }, { status: 400 }));
    }
    const parsed = serviceSchema.partial().safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    
    await getMongoClient();

    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      ));
    }

    // Check if documentId is being changed and if new one already exists
    if (body.documentId && body.documentId !== existingService.documentId) {
      const duplicateService = await Service.findOne({ 
        documentId: body.documentId,
        _id: { $ne: id }
      });
      if (duplicateService) {
        return withCors(request, NextResponse.json(
          { success: false, error: 'Service with this document ID already exists' },
          { status: 409 }
        ));
      }
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { ...body, version: existingService.version + 1 },
      { new: true, runValidators: true }
    );

    return withCors(request, NextResponse.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully',
    }));
  } catch (error) {
    console.error('Error updating service:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    ));
  }
}

// PATCH /api/admin/services/[id] - Partial update (e.g., status, stock status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-services:${ip}`, { windowMs: 60_000, max: 40 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid service id', code: 'INVALID_ID' }, { status: 400 }));
    }
    const parsed = serviceSchema.pick({ status: true, stockStatus: true, order: true }).partial().safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    
    await getMongoClient();

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!service) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      ));
    }

    return withCors(request, NextResponse.json({
      success: true,
      data: service,
      message: 'Service updated successfully',
    }));
  } catch (error) {
    console.error('Error patching service:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    ));
  }
}

// DELETE /api/admin/services/[id] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-services:${ip}`, { windowMs: 60_000, max: 20 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid service id', code: 'INVALID_ID' }, { status: 400 }));
    }
    
    await getMongoClient();

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      ));
    }

    return withCors(request, NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    }));
  } catch (error) {
    console.error('Error deleting service:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    ));
  }
}
