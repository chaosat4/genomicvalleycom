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

    const body = await request.json();

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
      where: { id: parseInt(resolvedParams.id) },
      data: {
        name: body.name,
        overview: body.overview,
        commitment: body.commitment,
        contact: body.contact,
        price: body.price,
        category: body.category,
        razorpay_link: body.razorpay_link,
        whyChoose: {
          create: body.whyChoose
        },
        whoCanBenefit: {
          create: body.whoCanBenefit
        },
        diseasesSupported: {
          create: body.diseasesSupported
        },
        process: {
          create: body.process
        },
        faqs: {
          create: body.faqs
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
      where: { id: parseInt(resolvedParams.id) },
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