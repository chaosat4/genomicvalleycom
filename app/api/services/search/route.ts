import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const services = await prisma.service.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            overview: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            diseasesSupported: {
              some: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        overview: true,
        price: true,
        category: true,
        diseasesSupported: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 