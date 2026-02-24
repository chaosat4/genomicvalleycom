import { NextRequest, NextResponse } from 'next/server';
import { dbPromise } from '@/lib/mongodb';
import { escapeRegex } from '@/lib/api/safe-regex';
import { handleOptions, withCors } from '@/lib/api/cors';
import { parsePositiveInt, parseEnumParam } from '@/lib/api/query';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

const ROLES = ['admin', 'patient', 'doctor'] as const;
const SORT_FIELDS = ['createdAt', 'name', 'email', 'role'] as const;

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return 'unauthenticated';
  if ((session.user as any).role !== 'admin') return 'forbidden';
  return null;
}

// GET /api/admin/users
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard === 'unauthenticated')
    return withCors(request, NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }));
  if (guard === 'forbidden')
    return withCors(request, NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }));

  try {
    const { searchParams } = new URL(request.url);

    const page   = parsePositiveInt(searchParams.get('page'),  1,  1, 10_000);
    const limit  = parsePositiveInt(searchParams.get('limit'), 20, 1, 100);
    const skip   = (page - 1) * limit;
    const search = searchParams.get('search')?.trim() ?? '';
    const role   = parseEnumParam(searchParams.get('role'), ROLES);
    const banned = searchParams.get('banned');
    const sort   = parseEnumParam(searchParams.get('sort'), SORT_FIELDS) ?? 'createdAt';
    const order  = searchParams.get('order') === 'asc' ? 1 : -1;

    const filter: Record<string, any> = {};

    if (search) {
      const safe = escapeRegex(search.slice(0, 120));
      filter.$or = [
        { name:  { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (banned === 'true') {
      filter.banned = true;
    } else if (banned === 'false') {
      filter.banned = { $ne: true };
    }

    const db  = await dbPromise;
    const col = db.collection('users');

    const [users, total] = await Promise.all([
      col
        .find(filter, { projection: { password: 0 } })
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(filter),
    ]);

    const serialized = users.map(u => ({ ...u, _id: u._id.toString() }));

    return withCors(request, NextResponse.json({
      success: true,
      data: serialized,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    ));
  }
}
