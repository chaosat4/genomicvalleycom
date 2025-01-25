import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Add more detailed debug logging
    console.log('Full Session Object:', JSON.stringify(session, null, 2));
    console.log('Session User:', session?.user);
    console.log('User Email:', session?.user?.email);
    console.log('Is Admin:', session?.user?.isAdmin);

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
      whyChoose,
      whoCanBenefit,
      diseasesSupported,
      process,
      faqs,
      category
    } = body;

    const service = await prisma.service.create({
      data: {
        name,
        overview,
        commitment,
        contact,
        price: parseFloat(price),
        category,
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

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
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