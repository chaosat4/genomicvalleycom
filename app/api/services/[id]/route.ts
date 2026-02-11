import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await getMongoClient();

    const service = await Service.findOne({ 
      documentId: id,
      status: 'published'
    })
    .populate('mainContent.servicesList.kitRef', 'name code price')
    .lean();

    if (!service) {
      return withCors(request, NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 }));
    }

    return withCors(request, NextResponse.json({ success: true, data: service }));
  } catch (error) {
    console.error('Error fetching service:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 }));
  }
}
