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
    subject: 'Quotation for your service',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendQuotationEmailInternal(email: string, fileUrl: string, customerDetails: { name: string; email: string; phone: string; institution?: string }) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: `New Quotation Request from ${customerDetails.name}`,
    html: `
      <div style="background-color: #f0f4f8; padding: 50px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://genomicvalley.in/nav_logo.png" alt="Genomic Valley Logo" height="50" />
          </div>
          <h2 style="color: #333; text-align: center;">New Quotation Request</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Customer Details:</h3>
            <p><strong>Name:</strong> ${customerDetails.name}</p>
            <p><strong>Email:</strong> ${customerDetails.email}</p>
            <p><strong>Phone:</strong> ${customerDetails.phone}</p>
            ${customerDetails.institution ? `<p><strong>Institution:</strong> ${customerDetails.institution}</p>` : ''}
          </div>
          <p style="text-align: center;">
            <a href="${fileUrl}" style="display: inline-block; background-color: #8200db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              View Quotation
            </a>
          </p>
          <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
            <p>This is an automated notification from the quotation system.</p>
          </footer>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}