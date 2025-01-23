import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const service = await prisma.service.findUnique({
      where: {
        id: parseInt(resolvedParams.id),
      },
      include: {
        whyChoose: true,
        whoCanBenefit: true,
        diseasesSupported: true,
        process: true,
        faqs: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 