"use client";

import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { uploadQuotationPDF } from '@/app/actions/quotation';
import gbvl_logo from '@/public/gbvl_logo.png';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, Font, pdf } from '@react-pdf/renderer';

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

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#8200db',
    padding: 20,
    borderRadius: 4,
  },
  logo: {
    width: 200,
    height: 120,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  companyDetails: {
    fontSize: 10,
    marginBottom: 3,
    color: '#FFFFFF',
  },
  quotationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  section: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 120,
  },
  value: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#582B87',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
  },
  terms: {
    fontSize: 10,
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8200db',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 8,
  },
  tableCell: {
    color: '#000',
    paddingHorizontal: 8,
    fontSize: 10,
  },
  catCell: {
    color: '#000',
    fontSize: 10,
  },
  tableCellHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    fontSize: 11,
  },

  colSNo: { width: '4%' },
  colCat: { width: '12%' },
  colQty: { width: '10%' },
  colDesc: { width: '34%' },
  colPrice: { width: '15%' },
  colDiscount: { width: '10%' },
  colTotal: { width: '15%' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
  summaryText: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 8,
  },
  summaryValue: {
    width: '15%',
    textAlign: 'right',
  },
  valueInWords: {
    marginTop: 10,
    padding: 8,
  }
});

const QuotationDocument = ({ formData, priceBeforeGST, totalPrice, serviceTitle, gstPercentage, bulkDiscount, quotationNumber }: { formData: FormData; priceBeforeGST: number; totalPrice: number; serviceTitle: string; gstPercentage: number; bulkDiscount : number; quotationNumber: string }) => {
  const validityDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'dd.MM.yyyy');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={gbvl_logo.src} />
          <View style={styles.headerText}>
            <Text style={styles.quotationTitle}>QUOTATION</Text>
            <Text style={styles.companyName}>GENOMIC VALLEY BHARAT Pvt. Ltd.</Text>
            <Text style={styles.companyDetails}>Corporate Address: Second Floor, G-74, PUSHKAR ENCLAVE, PASCHIM VIHAR, DELHI, India - 110063</Text>
            <Text style={styles.companyDetails}>Website: www.genomicvalley.in | Email: info@genomicvalley.in | Contact No.: +91-9811341542</Text>
            <Text style={styles.companyDetails}>GSTIN: 07AAKCG6119R1ZX</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Client and Quote Details */}
        <View style={styles.row}>
          {/* Buyer Details */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{formData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{`${formData.institution}, ${formData.address}`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>E-mail:</Text>
              <Text style={styles.value}>{formData.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{formData.phone}</Text>
            </View>
          </View>

          {/* Quote Details */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Quote Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>QT-No.:</Text>
              <Text style={styles.value}>{quotationNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{format(new Date(), 'dd MMMM yyyy')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Credit Days:</Text>
              <Text style={styles.value}>30-Days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Validity:</Text>
              <Text style={styles.value}>{`${validityDate} (11:59 PM)`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Service Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.colSNo]}>S. NO.</Text>
            <Text style={[styles.tableCellHeader, styles.colCat]}>Cat#</Text>
            <Text style={[styles.tableCellHeader, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.tableCellHeader, styles.colPrice]}>PRICE</Text>
            <Text style={[styles.tableCellHeader, styles.colQty]}>SAMPLES</Text>
            <Text style={[styles.tableCellHeader, styles.colDiscount]}>DISCOUNT</Text>
            <Text style={[styles.tableCellHeader, styles.colTotal]}>TOTAL</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colSNo]}>1</Text>
            <Text style={[styles.catCell, styles.colCat]}>Rs/WTS-AN 50M</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>
              {serviceTitle} {'\n'}
              {formData.serviceName} {'\n'}
              Species: {formData.speciesName} {formData.speciesNameOther} {'\n'}
              Tissue: {formData.tissueName} {formData.tissueNameOther} {'\n'}
              Number of Samples: {formData.numberOfSamples} {'\n'}
              Read/Bases: {formData.readRequired} {formData.readRequiredOther} {formData.basesRequired} {formData.basesRequiredOther} {'\n'}
              Read Length: {formData.readLength} {formData.readLengthOther} {'\n'}
              Sequencing Platform: {formData.sequencingPlatform} {'\n'}
              Data Analysis: {formData.dataAnalysis}
            </Text>
            <Text style={[styles.tableCell, styles.colPrice]}>{(priceBeforeGST / parseInt(formData.numberOfSamples)).toLocaleString('en-IN')}</Text>
            <Text style={[styles.tableCell, styles.colQty]}>{formData.numberOfSamples}</Text>
            <Text style={[styles.tableCell, styles.colDiscount]}>{bulkDiscount}%</Text>
            <Text style={[styles.tableCell, styles.colTotal]}>{priceBeforeGST.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>SUM</Text>
            <Text style={styles.summaryValue}>{priceBeforeGST.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>GST@{gstPercentage}%</Text>
            <Text style={styles.summaryValue}>{((priceBeforeGST) * (gstPercentage/100)).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total</Text>
            <Text style={styles.summaryValue}>Rs. {totalPrice.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.valueInWords}>
            <Text>Value in Words: {convertToWords(totalPrice)} Only.</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for choosing Genomic Valley. For any queries, please contact us at info@genomicvalley.in
        </Text>
      </Page>

      {/* Terms and Conditions Page */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 20 }]}>
          Terms and Conditions
        </Text>
        {[
          'This quotation is valid for 30 days from the date of issue.',
          'Payment terms: 50% advance payment, remaining 50% before sample collection.',
          'Sample collection and transportation charges are not included in the price.',
          'Turnaround time may vary based on sample quality and quantity.',
          'All prices are exclusive of GST.',
          'The company reserves the right to modify prices without prior notice.',
          'This quotation is subject to the company\'s standard terms and conditions.',
          'Sample quality and quantity must meet our minimum requirements.',
          'Results will be provided in the agreed format within the specified turnaround time.',
          'The company is not liable for any delays caused by factors beyond our control.',
          'All intellectual property rights remain with Genomic Valley.',
          'Confidentiality of data and results is maintained as per our privacy policy.',
          'Any modifications to the service requirements must be communicated in writing.',
          'The company reserves the right to refuse service if samples do not meet quality standards.',
          'This quotation is non-binding until a formal agreement is signed.',
        ].map((term, index) => (
          <Text key={index} style={styles.terms}>
            {`${index + 1}. ${term}`}
          </Text>
        ))}

        <Text style={[styles.footer, { textAlign: 'center' }]}>Page 2 of 2</Text>
      </Page>
    </Document>
  );
};

export const generateQuotationPDF = async (priceBeforeGST: number, totalPrice: number, gstPercentage: number, bulkDiscount: number, formData: FormData, serviceTitle: string, quotationNumber: string) => {
  try {
    
    // Create PDF
    const blob = await pdf(<QuotationDocument formData={formData} priceBeforeGST={priceBeforeGST} totalPrice={totalPrice} serviceTitle={serviceTitle} gstPercentage={gstPercentage} bulkDiscount={bulkDiscount} quotationNumber={quotationNumber} />).toBlob();
    const pdfBase64 = await blobToBase64(blob);
    
    // Upload to MinIO
    const filename = `quotation_${quotationNumber}.pdf`;
    const result = await uploadQuotationPDF(filename, pdfBase64);


    
    // Save locally
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    return { success: true, fileUrl: result.fileUrl };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error };
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Add this helper function at the bottom of the file
const convertToWords = (num: number): string => {
  // if num is float then convert it to integer
  if (typeof num === 'number' && num % 1 !== 0) {
    num = Math.floor(num);
  }
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
      if (n > 0) result += 'and ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }
    
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result;
  };

  if (num === 0) return 'Zero Rupees';
  
  let result = '';
  
  // Handle lakhs
  if (num >= 100000) {
    result += convertLessThanThousand(Math.floor(num / 100000)) + 'Lakh ';
    num %= 100000;
  }
  
  // Handle thousands
  if (num >= 1000) {
    result += convertLessThanThousand(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  
  result += convertLessThanThousand(num);
  
  return result + 'Rupees';
}; 