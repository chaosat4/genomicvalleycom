import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    // Check if session exists first
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user email exists and is an allowed admin
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string
      },
      select: {
        is_admin: true
      }
    });

    if (!user?.is_admin) {
      return NextResponse.json(
        { message: 'Not authorized - Admin access required' },
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

    // Update service and create new related records
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
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    // Check if session exists first
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user email exists and is an allowed admin
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string
      },
      select: {
        is_admin: true
      }
    });

    if (!user?.is_admin) {
      return NextResponse.json(
        { message: 'Not authorized - Admin access required' },
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

    // Then delete the service
    await prisma.service.delete({
      where: {
        id: parseInt(resolvedParams.id),
      },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 