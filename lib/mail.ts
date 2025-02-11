import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendCallRequestEmail(phone: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: '[URGENT]New Call Request',
    html: `
      <h2>New Call Request Received</h2>
      <p>Someone has requested a call back.</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p>Please contact them as soon as possible.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
} 