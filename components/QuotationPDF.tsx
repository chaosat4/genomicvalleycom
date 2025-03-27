"use client";

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { uploadQuotationPDF } from '@/app/actions/quotation';

interface FormData {
  name: string;
  institution: string;
  address: string;
  phone: string;
  email: string;
  servicesRequired: string;
  serviceName: string;
  speciesName: string;
  speciesNameOther: string;
  tissueName: string;
  tissueNameOther: string;
  numberOfSamples: string;
  readRequired: string;
  readRequiredOther: string;
  basesRequired: string;
  basesRequiredOther: string;
  kitName: string;
  readLength: string;
  readLengthOther: string;
  sequencingPlatform: string;
  dataAnalysis: string;
}

export const generateQuotationPDF = async (price: number, formData: FormData, serviceTitle: string) => {
  const quotationNumber = `Q${format(new Date(), 'yyyyMMdd')}-${uuidv4()}`;
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add company logo and header
    doc.setFontSize(24);
    doc.setTextColor(88, 28, 135); // Purple color
    doc.text('Genomic Valley', pageWidth / 2, 20, { align: 'center' });
    
    // Company details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Bharat Pvt Ltd', pageWidth / 2, 25, { align: 'center' });
    doc.text('Email: info@genomicvalley.in | Phone: +91 8091366601', pageWidth / 2, 35, { align: 'center' });
    doc.text('Address: 2nd Floor G74, Pushkar Enclave, Paschim Vihar, New Delhi, India - 110063', pageWidth / 2, 40, { align: 'center' });

    // Quotation details
    doc.setFontSize(16);
    doc.setTextColor(88, 28, 135);
    doc.text('Quotation', pageWidth / 2, 55, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 65);
    doc.text(`Quotation No: ${quotationNumber}`, 20, 70);

    // Client Information
    doc.setFontSize(12);
    doc.setTextColor(88, 28, 135);
    doc.text('Client Information', 20, 85);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${formData.name}`, 20, 95);
    doc.text(`Institution: ${formData.institution}`, 20, 100);
    doc.text(`Address: ${formData.address}`, 20, 105);
    doc.text(`Phone: ${formData.phone}`, 20, 110);
    doc.text(`Email: ${formData.email}`, 20, 115);

    // Service Details
    doc.setFontSize(12);
    doc.setTextColor(88, 28, 135);
    doc.text('Service Details', 20, 130);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Service Title: ${serviceTitle}`, 20, 140);
    doc.text(`Service Name: ${formData.serviceName}`, 20, 145);
    doc.text(`Services Required: ${formData.servicesRequired}`, 20, 150);

    // Technical Specifications
    doc.setFontSize(12);
    doc.setTextColor(88, 28, 135);
    doc.text('Technical Specifications', 20, 165);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Species: ${formData.speciesName}${formData.speciesNameOther ? ` (${formData.speciesNameOther})` : ''}`, 20, 175);
    doc.text(`Tissue Type: ${formData.tissueName}${formData.tissueNameOther ? ` (${formData.tissueNameOther})` : ''}`, 20, 180);
    doc.text(`Number of Samples: ${formData.numberOfSamples}`, 20, 185);
    doc.text(`Sequencing Platform: ${formData.sequencingPlatform}`, 20, 190);
    doc.text(`Read Length: ${formData.readLength}${formData.readLengthOther ? ` (${formData.readLengthOther})` : ''}`, 20, 195);
    
    if (formData.readRequired) {
      doc.text(`Reads Required: ${formData.readRequired}${formData.readRequiredOther ? ` (${formData.readRequiredOther})` : ''} M reads/sample`, 20, 200);
    } else if (formData.basesRequired) {
      doc.text(`Bases Required: ${formData.basesRequired}${formData.basesRequiredOther ? ` (${formData.basesRequiredOther})` : ''} GB/sample`, 20, 200);
    }
    
    doc.text(`Data Analysis: ${formData.dataAnalysis}`, 20, 205);
    if (formData.kitName) {
      doc.text(`Kit Name: ${formData.kitName}`, 20, 210);
    }

    // Price Details
    doc.setFontSize(12);
    doc.setTextColor(88, 28, 135);
    doc.text('Price Details', 20, 225);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Price: Rs. ${price.toLocaleString('en-IN')}`, 20, 235);
    doc.text('(Prices are subject to change without prior notice)', 20, 240);

    // Footer on first page
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Thank you for choosing Genomic Valley. For any queries, please contact us at info@genomicvalley.in', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Add new page for Terms and Conditions
    doc.addPage();

    // Terms and Conditions Header
    doc.setFontSize(16);
    doc.setTextColor(88, 28, 135);
    doc.text('Terms and Conditions', pageWidth / 2, 30, { align: 'center' });
    
    // Terms and Conditions Content
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const terms = [
      '1. This quotation is valid for 30 days from the date of issue.',
      '2. Payment terms: 50% advance payment, remaining 50% before sample collection.',
      '3. Sample collection and transportation charges are not included in the price.',
      '4. Turnaround time may vary based on sample quality and quantity.',
      '5. All prices are exclusive of GST.',
      '6. The company reserves the right to modify prices without prior notice.',
      '7. This quotation is subject to the company\'s standard terms and conditions.',
      '8. Sample quality and quantity must meet our minimum requirements.',
      '9. Results will be provided in the agreed format within the specified turnaround time.',
      '10. The company is not liable for any delays caused by factors beyond our control.',
      '11. All intellectual property rights remain with Genomic Valley.',
      '12. Confidentiality of data and results is maintained as per our privacy policy.',
      '13. Any modifications to the service requirements must be communicated in writing.',
      '14. The company reserves the right to refuse service if samples do not meet quality standards.',
      '15. This quotation is non-binding until a formal agreement is signed.',
    ];

    terms.forEach((term, index) => {
      doc.text(term, 20, 50 + (index * 7));
    });

    // Footer on second page
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Page 2 of 2', pageWidth / 2, pageHeight - 20, { align: 'center' });


    // Upload the PDF to MinIO
    const filename = `quotation_${quotationNumber}.pdf`;
    const pdfBase64 = doc.output('datauristring');
    const uploadResult = await uploadQuotationPDF(filename, pdfBase64);

    // Save the PDF
    doc.save(`quotation_${quotationNumber}.pdf`);
    
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error };
  }
}; 