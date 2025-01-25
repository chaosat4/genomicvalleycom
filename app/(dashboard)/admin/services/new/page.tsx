'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ServiceForm from '@/components/admin/ServiceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const user = await response.json();
        if (!user.is_admin) {
          router.push('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSuccess = () => {
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
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
            Add New Service
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new service offering for your platform
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <ServiceForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
} 