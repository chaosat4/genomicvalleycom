import { Suspense } from 'react';
import ServiceDetails from './ServiceDetails';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ServiceDetails id={resolvedParams.id} />
    </Suspense>
  );
}