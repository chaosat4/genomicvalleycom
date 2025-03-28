'use server';

import { uploadPDFToMinIO, getPresignedUrl, getPermanentLink } from '@/lib/minio';
import { sendQuotationEmailCustomer, sendQuotationEmailInternal } from '@/lib/mail';

export async function uploadQuotationPDF(filename: string, pdfBase64: string) {
  try {
    // Remove the data URI prefix to get just the base64 data
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // Upload to MinIO
    const uploadResult = await uploadPDFToMinIO(filename, pdfBuffer);

    const fileUrl = await getPresignedUrl(filename);

    return {
      success: true,
      filename,
      fileUrl,
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('Failed to upload PDF');
  }
}

export async function sendQuotationEmail(email: string, fileUrl: string, customerDetails: { name: string; email: string; phone: string; institution?: string }) {
  try {
    const htmlContent = `
      <div style="background-color: #f0f4f8; padding: 50px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://genomicvalley.in/nav_logo.png" alt="Genomic Valley Logo" height="50" />
          </div>
          <h2 style="color: #333; text-align: center;">Your Quotation is Ready</h2>
          <p style="color: #555; text-align: center;">Thank you for your interest in our services. We have prepared a detailed quotation for your requirements.</p>
          <p style="text-align: center;">
            <a href="${fileUrl}" style="display: inline-block; background-color: #8200db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Download Quotation
            </a>
          </p>
          <p style="color: #666; font-size: 14px; text-align: center;">
            Note: This quotation will be available for download for 7 days only.
          </p>
          <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
            <p>
              Need assistance? Contact us at
              <a href="mailto:info@genomicvalley.in" style="color: #8200db; text-decoration: none;">
                info@genomicvalley.in
              </a>
            </p>
          </footer>
        </div>
      </div>
    `;

    // Send email to customer
    await sendQuotationEmailCustomer(email, fileUrl, htmlContent);
    
    // Send email to internal team
    await sendQuotationEmailInternal(email, fileUrl, customerDetails);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending quotation email:', error);
    throw new Error('Failed to send email');
  }
} 