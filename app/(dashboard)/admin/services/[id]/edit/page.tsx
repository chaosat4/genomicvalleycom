'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ServiceForm from '@/components/admin/ServiceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ServiceFormData } from '@/components/admin/ServiceForm';
import { use } from 'react';


export default function EditServicePage({ 
    params 
  }: { 
    params: Promise<{ id: string }> 
  }) {
  const id = use(params).id;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [service, setService] = useState<ServiceFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!session.user?.isAdmin) {
      router.push('/login');
      return;
    }

    fetchService();
  }, [session, status, router, id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${id}`);
      if (!response.ok) throw new Error('Failed to fetch service');
      
      const data = await response.json();
      setService({
        name: data.name,
        overview: data.overview,
        commitment: data.commitment,
        contact: data.contact,
        price: data.price,
        category: data.category,
        whyChoose: data.whyChoose,
        whoCanBenefit: data.whoCanBenefit,
        diseasesSupported: data.diseasesSupported,
        process: data.process,
        faqs: data.faqs,
      });
    } catch (err) {
      setError('Failed to load service data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" bg-purple-50 p-6">
        <div className="mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error}</p>
            <Link 
              href="/admin"
              className="inline-flex items-center mt-4 text-sm hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin || !service) {
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="mx-auto space-y-8">
        <div>
          <Link 
            href="/admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Edit Service
          </h1>
          <p className="text-gray-600 mt-2">
            Update the service details below
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <ServiceForm 
            initialData={service}
            serviceId={id}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
} 