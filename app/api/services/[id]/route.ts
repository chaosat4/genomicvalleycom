import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

interface JWTPayload {
  sub: string;
  email: string;
  is_admin: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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

    const service = await prisma.service.findUnique({
      where: { id: parseInt(resolvedParams.id) },
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
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyJWT<JWTPayload>(token);

    if (!payload.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      overview,
      commitment,
      contact,
      price,
      category,
      razorpay_link,
      whyChoose,
      whoCanBenefit,
      diseasesSupported,
      process,
      faqs,
    } = body;

    // Delete existing related records
    await prisma.$transaction([
      prisma.whyChoose.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.whoCanBenefit.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.diseaseSupported.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.process.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.fAQ.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
    ]);

    const updatedService = await prisma.service.update({
      where: {
        id: parseInt(resolvedParams.id),
      },
      data: {
        name,
        overview,
        commitment,
        contact,
        price,
        category,
        razorpay_link,
        whyChoose: {
          create: whyChoose
        },
        whoCanBenefit: {
          create: whoCanBenefit
        },
        diseasesSupported: {
          create: diseasesSupported
        },
        process: {
          create: process
        },
        faqs: {
          create: faqs
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

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyJWT<JWTPayload>(token);

    if (!payload.is_admin) {
      return NextResponse.json(
        { error: 'Not authorized - Admin access required' },
        { status: 403 }
      );
    }

    // Delete related records first
    await prisma.$transaction([
      prisma.whyChoose.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.whoCanBenefit.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.diseaseSupported.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.process.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
      prisma.fAQ.deleteMany({
        where: { serviceId: parseInt(resolvedParams.id) }
      }),
    ]);

    await prisma.service.delete({
      where: {
        id: parseInt(resolvedParams.id),
      },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 