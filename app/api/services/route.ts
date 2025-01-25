import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

interface JWTPayload {
  sub: string;
  email: string;
  is_admin: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT<JWTPayload>(token);
    if (!payload.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    if (!body.name || !body.overview || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: body.name,
        overview: body.overview,
        commitment: body.commitment || '',
        contact: body.contact || '',
        price: parseFloat(body.price) || 0,
        category: body.category,
        razorpay_link: body.razorpay_link || '',
        whyChoose: {
          create: body.whyChoose || []
        },
        whoCanBenefit: {
          create: body.whoCanBenefit || []
        },
        diseasesSupported: {
          create: body.diseasesSupported || []
        },
        process: {
          create: body.process || []
        },
        faqs: {
          create: body.faqs || []
        }
      },
      include: {
        whyChoose: true,
        whoCanBenefit: true,
        diseasesSupported: true,
        process: true,
        faqs: true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        overview: true,
        price: true,
        category: true,
        razorpay_link: true,
        createdAt: true,
        _count: {
          select: {
            whyChoose: true,
            whoCanBenefit: true,
            diseasesSupported: true,
            process: true,
            faqs: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 