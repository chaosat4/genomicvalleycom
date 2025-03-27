import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  name: string;
  email: string;
  phone: string;
  institution?: string;
  address?: string;
  [key: string]: any;
}

export async function generateQuotation(price: number, formData: FormData, serviceTitle: string) {
  try {
    const response = await fetch('/api/quotation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price,
        formData,
        serviceTitle,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate quotation');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quotation:', error);
    throw error;
  }
}

