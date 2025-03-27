'use server';

import { uploadPDFToMinIO } from '@/lib/minio';

export async function uploadQuotationPDF(filename: string, pdfBase64: string) {
  try {
    // Remove the data URI prefix to get just the base64 data
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Convert base64 to Buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // Upload to MinIO
    const uploadResult = await uploadPDFToMinIO(filename, pdfBuffer);
    
    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('Failed to upload PDF');
  }
} 