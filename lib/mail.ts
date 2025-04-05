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

export async function sendCheckoutConfirmationEmail(checkout: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: 'Someone has checked out a service',
    html: `
      <h2>Someone has checked out a service</h2>
      <p>${checkout.name},</p>
      <p>${checkout.service.name} has been checked out by ${checkout.email}.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li>Service: ${checkout.service.name}</li>
        <li>Address: ${checkout.address}</li>
        <li>Phone: ${checkout.phone}</li>
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);
} 

export async function sendQuotationEmailCustomer(email: string, fileUrl: string, htmlContent: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    cc: process.env.CONTACT_EMAIL,
    subject: 'Quotation for your service',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}
