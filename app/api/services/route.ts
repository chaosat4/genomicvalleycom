import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { is_admin: true }
    });

    if (!user?.is_admin) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.overview || !body.category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { message: 'Failed to create service in database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow public access to services list
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
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 