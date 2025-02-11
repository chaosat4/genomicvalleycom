import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('Received request URL:', request.url); // Debug log
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    console.log('Category param:', category); // Debug log

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }

    const services = await prisma.service.findMany({
      where: { category },
      select: {
        id: true,
        name: true,
        overview: true,
        price: true,
        category: true,
        razorpay_link: true, // Added this to match the other endpoint
        createdAt: true,     // Added this to match the other endpoint
        _count: {
          select: {
            whyChoose: true,
            diseasesSupported: true,
            process: true,
            whoCanBenefit: true, // Added this to match the other endpoint
            faqs: true,          // Added this to match the other endpoint
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