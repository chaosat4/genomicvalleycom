import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category || !['diagnostic', 'research'].includes(category)) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Valid category parameter is required (diagnostic or research)' },
        { status: 400 }
      ));
    }

    await getMongoClient();

    const services = await Service.find({ 
      categoryName: category,
      status: 'published'
    })
    .select('documentId categoryName order mainContent.contentTitle mainContent.leftBox')
    .sort({ order: 1 })
    .lean();

    return withCors(request, NextResponse.json({ success: true, data: services }));
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
