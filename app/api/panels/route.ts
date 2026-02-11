import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import Panel from '@/lib/models/Panel';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    await getMongoClient();

    const panels = await Panel.find({ isActive: true })
      .select('documentId name genes category')
      .sort({ name: 1 })
      .lean();

    return withCors(request, NextResponse.json({ success: true, data: panels }));
  } catch (error) {
    console.error('Error fetching panels:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch panels' }, { status: 500 }));
  }
}
