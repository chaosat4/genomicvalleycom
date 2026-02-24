import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Panel from '@/lib/models/Panel';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const panels = await Panel.find({ isActive: true })
      .select('documentId name geneCount category order')
      .sort({ category: 1, order: 1, name: 1 })
      .lean();

    // Group by category preserving order
    const grouped: Record<string, typeof panels> = { human: [], pro: [], ultra: [] };
    for (const panel of panels) {
      const cat = panel.category as string;
      if (grouped[cat]) grouped[cat].push(panel);
    }

    return withCors(request, NextResponse.json({ success: true, data: grouped }));
  } catch (error) {
    console.error('Error fetching panels:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch panels' }, { status: 500 }));
  }
}
