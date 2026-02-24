'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace('/login');
      return;
    }

    const role = (session.user as any).role;
    if (role === 'admin') {
      router.replace('/dashboard/admin');
    } else {
      router.replace('/services');
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto" />
        <p className="text-gray-600 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
