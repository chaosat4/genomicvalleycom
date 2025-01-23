import { Suspense } from 'react';
import ServiceDetails from './ServiceDetails';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default async function ServicePage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ServiceDetails id={params.id} />
    </Suspense>
  );
}