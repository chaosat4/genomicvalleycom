import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/api/rate-limit';
import { handleOptions, withCors } from '@/lib/api/cors';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  organization: z.string().optional(),
  queryType: z.string().min(1),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(4000),
});

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`contact:${ip}`, { windowMs: 60_000, max: 8 });
    if (!rl.allowed) {
      const res = NextResponse.json({ success: false, error: 'Too many requests', code: 'RATE_LIMITED' }, { status: 429 });
      res.headers.set('Retry-After', String(rl.retryAfter));
      return withCors(request, res);
    }

    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return withCors(request, NextResponse.json({ success: false, error: 'Invalid payload', code: 'VALIDATION_ERROR', details: parsed.error.issues }, { status: 400 }));
    }
    const { name, email, phone, organization, queryType, subject, message } = parsed.data;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
        <p><strong>Query Type:</strong> ${queryType}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return withCors(request, NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    }, { status: 201 }));
  } catch (error) {
    console.error('Contact form error:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
