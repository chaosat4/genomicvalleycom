import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PriceConfiguration from '@/lib/models/PriceConfiguration';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const config = await PriceConfiguration.findOne({ isActive: true })
      .populate('libraryPreparation.kitRef', 'name code')
      .lean();

    if (!config) {
      return withCors(request, NextResponse.json({ success: false, error: 'Price configuration not found' }, { status: 404 }));
    }

    return withCors(request, NextResponse.json({ success: true, data: config }));
  } catch (error) {
    console.error('Error fetching price configuration:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch price configuration' }, { status: 500 }));
  }
}
