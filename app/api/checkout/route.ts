import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, serviceId } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !serviceId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create checkout record
    const checkout = await prisma.checkout.create({
      data: {
        name,
        email,
        phone,
        address,
        serviceId: parseInt(serviceId),
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(checkout, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const checkouts = await prisma.checkout.findMany({
      where: email ? { email } : undefined,
      include: {
        service: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(checkouts);
  } catch (error) {
    console.error('Failed to fetch checkouts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 