'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ServiceData {
  documentId: string;
  categoryName: 'diagnostic' | 'research';
  mainContent: {
    leftBox: { title: string; description: string };
    contentTitle: string;
    contentDescription: string;
    servicesHeading: string;
    servicesList: { number: string; title: string; details: string[] }[];
    benefitsHeading: string;
    benefits: string[];
  };
}

export default function ServiceDetails({ id }: { id: string }) {
  const [data, setData] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Failed to fetch service');
        }
        setData(payload.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Service not found'}</div>
      </div>
    );
  }

  const { mainContent } = data;

  return (
    <div className="bg-purple-50 min-h-screen pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border-2 border-purple-500 p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-3">{mainContent.leftBox.title}</h3>
            <p className="text-gray-700 text-center">{mainContent.leftBox.description}</p>
          </div>

          <div className="flex justify-center">
            <Link href={`/request-quotation/${id}`}>
              <button className="bg-purple-600 text-white my-4 px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Request For Quote
              </button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-9">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">{mainContent.contentTitle}</h2>
          <p className="text-gray-800 text-xl mb-4 text-justify">{mainContent.contentDescription}</p>

          <h4 className="text-2xl font-semibold text-purple-600 mt-6 mb-4">{mainContent.servicesHeading}</h4>

          <div className="space-y-6">
            {mainContent.servicesList.map((service) => (
              <div key={service.number}>
                <h5 className="text-xl font-semibold flex items-center">
                  <span className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                    {service.number}
                  </span>
                  {service.title}
                </h5>
                <div className="ml-9 text-gray-700">
                  {service.details.map((detail, i) => (
                    <p key={i} className="flex text-lg items-start text-justify">
                      <span className="text-purple-600 mr-2">→</span>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold text-purple-600 mb-4">{mainContent.benefitsHeading}</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {mainContent.benefits.map((benefit, i) => (
                <li key={i} className="text-justify">{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
