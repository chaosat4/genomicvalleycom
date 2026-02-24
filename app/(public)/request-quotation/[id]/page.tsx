'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import QuotationForm from '@/components/QuotationForm';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!isPending && !session && id) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/request-quotation/${id}`)}`);
    }
  }, [session, isPending, router, id]);

  if (isPending || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <QuotationForm id={id} />;
}
