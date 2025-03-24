import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, queryType, subject, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !queryType || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        organization,
        queryType,
        subject,
        message,
      },
    });

    // Update email template
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

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 