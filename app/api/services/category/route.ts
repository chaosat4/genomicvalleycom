import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const services = await prisma.service.findMany({
      where: category ? {
        category: category
      } : undefined,
      select: {
        id: true,
        name: true,
        overview: true,
        price: true,
        category: true,
        _count: {
          select: {
            whyChoose: true,
            diseasesSupported: true,
            process: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 