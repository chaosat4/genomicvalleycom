import { NextRequest, NextResponse } from 'next/server';
import { sendCallRequestEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await sendCallRequestEmail(phone);

    return NextResponse.json({ 
      message: 'Call request received successfully' 
    });
  } catch (error) {
    console.error('Call request error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 