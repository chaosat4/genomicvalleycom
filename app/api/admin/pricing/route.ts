import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PriceConfiguration from '@/lib/models/PriceConfiguration';
import { pricingSchema } from '@/lib/validation/schemas';
import { handleOptions, withCors } from '@/lib/api/cors';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { requireAdmin } from '@/lib/api/admin-guard';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    await connectDB();
    
    let config = await PriceConfiguration.findOne({ isActive: true })
      .populate('libraryPreparation.kitRef')
      .lean();
    
    if (!config) {
      // Create default configuration if none exists
      config = await PriceConfiguration.create({
        version: '1.0.0',
        isActive: true,
        extraction: 0,
        sampleQC: 0,
        libraryQC: 0,
        serviceCost: 0,
        logistics: 0,
        libraryPreparation: [],
        sequencingPerGb: { illumina: 0, mgi: 0, nanopore: 0, pacbio: 0, hic: 0 },
        genomeAssemblyPerSample: { illumina: 0, mgi: 0, nanopore: 0, pacbio: 0, hic: 0 },
        dataAnalysis: { standard: 0, interpretation: 0 },
        profitPercentage: 0,
        gstPercentage: 18,
        bulkDiscount: { categories: [] },
        additionalDiscount: 0,
      });
    }

    return withCors(request, NextResponse.json({ success: true, data: config }));
  } catch (error) {
    console.error('Error fetching price configuration:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to fetch price configuration' }, { status: 500 }));
  }
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`admin-pricing:${ip}`, { windowMs: 60_000, max: 20 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = pricingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const body = parsed.data;
    await connectDB();

    // Find existing active config or create new one
    let config = await PriceConfiguration.findOne({ isActive: true });
    
    if (config) {
      // Update existing
      config = await PriceConfiguration.findByIdAndUpdate(
        config._id,
        { ...body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('libraryPreparation.kitRef');
    } else {
      // Create new
      config = await PriceConfiguration.create({ ...body, isActive: true });
    }

    return withCors(request, NextResponse.json({ success: true, data: config, message: 'Price configuration updated successfully' }));
  } catch (error) {
    console.error('Error updating price configuration:', error);
    return withCors(request, NextResponse.json({ success: false, error: 'Failed to update price configuration' }, { status: 500 }));
  }
}
