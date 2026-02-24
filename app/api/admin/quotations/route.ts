import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Quotation from '@/lib/models/Quotation';
import { handleOptions, withCors } from '@/lib/api/cors';
import { parsePositiveInt, parseEnumParam } from '@/lib/api/query';
import { escapeRegex } from '@/lib/api/safe-regex';
import { requireAdmin } from '@/lib/api/admin-guard';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const page   = parsePositiveInt(searchParams.get('page'),  1,  1, 10_000);
    const limit  = parsePositiveInt(searchParams.get('limit'), 20, 1, 100);
    const search = searchParams.get('search');
    const status = parseEnumParam(searchParams.get('status'), ['generated', 'sent', 'expired']);
    const skip   = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (search && search.trim()) {
      const safe = escapeRegex(search.trim().slice(0, 120));
      filter.$or = [
        { quotationNumber:    { $regex: safe, $options: 'i' } },
        { 'userInfo.name':   { $regex: safe, $options: 'i' } },
        { 'userInfo.email':  { $regex: safe, $options: 'i' } },
        { 'serviceInfo.title': { $regex: safe, $options: 'i' } },
      ];
    }

    await connectDB();

    const [quotations, total] = await Promise.all([
      Quotation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('quotationNumber userInfo serviceInfo pricing status createdAt expiresAt pdfUrl pdfFilename')
        .lean(),
      Quotation.countDocuments(filter),
    ]);

    return withCors(request, NextResponse.json({
      success: true,
      data:    quotations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to fetch quotations' },
      { status: 500 }
    ));
  }
}
