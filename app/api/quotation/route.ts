import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PriceConfiguration from '@/lib/models/PriceConfiguration';
import Quotation from '@/lib/models/Quotation';
import { quotationRequestSchema } from '@/lib/validation/schemas';
import { calculateQuotationPrice, generateBatchNumber, generateQuotationNumber } from '@/lib/services/quotation-service';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { handleOptions, withCors } from '@/lib/api/cors';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`quotation:${ip}`, { windowMs: 60_000, max: 15 });
    if (!rl.allowed) {
      const res = NextResponse.json(
        { success: false, error: 'Too many requests', code: 'RATE_LIMITED' },
        { status: 429 }
      );
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = quotationRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withCors(
        request,
        NextResponse.json(
          { success: false, error: 'Invalid request body', code: 'VALIDATION_ERROR', details: parsed.error.issues },
          { status: 400 }
        )
      );
    }
    const { serviceTitle, formData, userInfo } = parsed.data;


    await connectDB();

    // Get current price configuration
    const priceConfig = await PriceConfiguration.findOne({ isActive: true }).lean();
    if (!priceConfig) {
      return withCors(request, NextResponse.json(
        { success: false, error: 'Price configuration not found' },
        { status: 500 }
      ));
    }

    // Calculate price
    const pricing = calculateQuotationPrice(serviceTitle, formData, priceConfig);

    // Generate quotation number
    const quotationNumber = generateQuotationNumber();
    const batchNumber = generateBatchNumber(formData);

    // Create quotation record
    const quotation = new Quotation({
      quotationNumber,
      batchNumber,
      userInfo,
      serviceInfo: {
        title: serviceTitle,
        category: 'diagnostic',
      },
      formData,
      pricing,
      pdfUrl: '',
      pdfFilename: `${quotationNumber}.pdf`,
      status: 'generated',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      validityDays: 30,
    });

    await quotation.save();

    return withCors(request, NextResponse.json({
      success: true,
      data: {
        quotationId: quotation._id,
        quotationNumber,
        batchNumber,
        pricing,
      },
    }));
  } catch (error) {
    console.error('Error creating quotation:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to create quotation' },
      { status: 500 }
    ));
  }
}
