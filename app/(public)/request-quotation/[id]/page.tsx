'use client';

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuotationForm from "@/components/QuotationForm";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const returnUrl = `/request-quotation/${id}`;
          router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        const response = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const returnUrl = `/request-quotation/${id}`;
          router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        const returnUrl = `/request-quotation/${id}`;
        router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    };

    checkAuth();
  }, [router, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return <QuotationForm id={id} />;
}
