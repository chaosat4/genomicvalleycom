import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
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