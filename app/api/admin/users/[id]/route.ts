import { NextRequest, NextResponse } from 'next/server';
import { dbPromise } from '@/lib/mongodb';
import { handleOptions, withCors } from '@/lib/api/cors';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'unauthenticated', session: null };
  if ((session.user as any).role !== 'admin') return { error: 'forbidden', session: null };
  return { error: null, session };
}

// PATCH /api/admin/users/[id]
// Body: { role?: 'admin' | 'patient' | 'doctor', banned?: boolean }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAdmin();
  if (error === 'unauthenticated')
    return withCors(request, NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }));
  if (error === 'forbidden')
    return withCors(request, NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }));

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Invalid user id' },
        { status: 400 }
      ));
    }

    const body = await request.json();
    const allowedRoles = ['admin', 'patient', 'doctor'];
    const update: Record<string, any> = {};

    if ('role' in body) {
      if (!allowedRoles.includes(body.role)) {
        return withCors(request, NextResponse.json(
          { success: false, error: 'Invalid role. Must be admin, patient, or doctor.' },
          { status: 400 }
        ));
      }
      update.role = body.role;
    }

    if ('banned' in body) {
      if (typeof body.banned !== 'boolean') {
        return withCors(request, NextResponse.json(
          { success: false, error: 'banned must be a boolean' },
          { status: 400 }
        ));
      }
      update.banned = body.banned;
    }

    if (Object.keys(update).length === 0) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      ));
    }

    // Prevent admin from banning/demoting themselves
    const adminId = (session!.user as any).id;
    if (id === adminId && ('role' in update || 'banned' in update)) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'You cannot modify your own role or ban status' },
        { status: 400 }
      ));
    }

    update.updatedAt = new Date();

    const db  = await dbPromise;
    const col = db.collection('users');

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      ));
    }

    return withCors(request, NextResponse.json({
      success: true,
      data: { ...result, _id: result._id.toString() },
      message: 'User updated successfully',
    }));
  } catch (err) {
    console.error('Error updating user:', err);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    ));
  }
}
