import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const checkout = await prisma.checkout.findUnique({
      where: {
        id: parseInt(resolvedParams.id),
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            razorpay_link: true,
          },
        },
      },
    });

    if (!checkout) {
      return NextResponse.json(
        { message: 'Checkout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { status } = body;

    const checkout = await prisma.checkout.update({
      where: {
        id: parseInt(resolvedParams.id),
      },
      data: {
        status,
      },
    });

    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 