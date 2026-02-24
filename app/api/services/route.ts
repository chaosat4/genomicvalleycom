import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { handleOptions, withCors } from '@/lib/api/cors';
import { parseEnumParam } from '@/lib/api/query';

const allowedCategories = ['diagnostic', 'research'] as const;

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

// GET /api/services - List published services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryRaw = searchParams.get('category');
    const category = parseEnumParam(categoryRaw, allowedCategories);
    if (categoryRaw && !category) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid category filter' }, { status: 400 }));
    }
    
    await connectDB();

    const filter: any = { status: 'published' };
    if (category) filter.categoryName = category;

    const services = await Service.find(filter)
      .select('documentId categoryName order stockStatus mainContent.contentTitle mainContent.leftBox')
      .sort({ order: 1 })
      .lean();

    return withCors(request, NextResponse.json({ success: true, data: services }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 }));
  }
}
