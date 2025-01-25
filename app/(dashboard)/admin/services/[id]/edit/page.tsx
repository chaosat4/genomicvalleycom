'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ServiceForm from '@/components/admin/ServiceForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  overview: string;
  commitment: string;
  contact: string;
  price: number;
  category: string;
  razorpay_link: string;
  whyChoose: Array<{ feature: string; description: string }>;
  whoCanBenefit: Array<{ type: string; description: string }>;
  diseasesSupported: Array<{ name: string; relevance: string }>;
  process: Array<{ step: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
} 

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/services/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch service');
        }

        const data = await response.json();
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [resolvedParams.id, router]);

  const handleSuccess = () => {
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Service not found</div>
      </div>
    );
  }

  return (
    <div className=" mx-auto py-8">
      <div className=" items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin')}
          className="flex text-gray-600 hover:text-gray-900 items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Edit Service
          </h1>
          <p className="text-gray-600 mt-2">
            Update the service details below
          </p>
        </div>

      <ServiceForm 
        initialData={service}
        serviceId={resolvedParams.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 