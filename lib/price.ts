import { useState, useEffect } from 'react';
import { calculateQuotationPrice } from './services/quotation-service';

// Custom hook to fetch price list data from REST API
export function usePriceList() {
  const [priceList, setPriceList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await fetch('/api/pricing');
        const data = await response.json();
        
        if (data.success) {
          // Transform the data to match the expected format
          const config = data.data;
          setPriceList({
            extraction: config.extraction,
            sampleQC: config.sampleQC,
            serviceCost: config.serviceCost,
            libraryPreparation_per_sample: {
              kit: (config.libraryPreparation || []).map((item: any) => ({
                name: item.kitName || item.kitRef?.name,
                price: item.price,
              })),
            },
            libraryQC: config.libraryQC,
            sequencing_per_gb: config.sequencingPerGb,
            genomeAssembly_per_sample: config.genomeAssemblyPerSample,
            logistics: config.logistics,
            dataAnalysis: config.dataAnalysis,
            profitPercentage: config.profitPercentage,
            gstPercentage: config.gstPercentage,
            bulkdiscount: {
              category: config.bulkDiscount?.categories || [],
            },
            additionalDiscount: config.additionalDiscount,
          });
        } else {
          throw new Error(data.error || 'Failed to fetch price list');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPriceList();
  }, []);

  return { priceList, loading, error };
}

// Pure function to calculate price based on service and form data
export function calculatePrice(serviceTitle: string, formData: any, priceList: any) {
  if (!priceList) return { priceBeforeGST: 0, totalPrice: 0, gstPercentage: 18, bulkDiscount: 0, logistics: 0 };
  const normalized = {
    ...priceList,
    sequencingPerGb: priceList.sequencing_per_gb,
    genomeAssemblyPerSample: priceList.genomeAssembly_per_sample,
    bulkDiscount: { categories: priceList.bulkdiscount?.category || [] },
  };
  return calculateQuotationPrice(serviceTitle, formData, normalized);
}

// New function to create quotation via API
export async function createQuotation(
  serviceTitle: string,
  formData: any,
  userInfo: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch('/api/quotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceTitle,
        formData,
        userInfo,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating quotation:', error);
    return { success: false, error: 'Failed to create quotation' };
  }
}
