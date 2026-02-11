'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string>('');

  useEffect(() => {
    params.then(p => setServiceId(p.id));
  }, [params]);
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/admin/services/manage')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Services
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Service</h1>
      <p className="text-gray-600">Service ID: {serviceId}</p>
      <p className="text-gray-600 mt-4">
        This page will load the service data and allow editing with the multi-step form.
      </p>
    </div>
  );
}
