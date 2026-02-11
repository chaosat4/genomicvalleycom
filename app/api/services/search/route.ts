import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { escapeRegex } from '@/lib/api/safe-regex';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return withCors(request, NextResponse.json({ success: true, data: [] }));
    }

    if (query.length > 120) {
      return withCors(request, NextResponse.json({ success: false, error: 'Query is too long' }, { status: 400 }));
    }

    await getMongoClient();

    const safe = escapeRegex(query);
    const services = await Service.find({
      $and: [
        { status: 'published' },
        {
          $or: [
            { 'mainContent.contentTitle': { $regex: safe, $options: 'i' } },
            { 'mainContent.contentDescription': { $regex: safe, $options: 'i' } },
            { documentId: { $regex: safe, $options: 'i' } },
          ],
        },
      ],
    })
    .select('documentId categoryName mainContent.contentTitle mainContent.leftBox')
    .limit(5)
    .lean();

    return withCors(request, NextResponse.json({ success: true, data: services }));
  } catch (error) {
    console.error('Search error:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
