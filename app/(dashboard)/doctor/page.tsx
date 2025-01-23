'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DoctorDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!session.user?.isDoctor) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isDoctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Doctor Dashboard
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, Dr. {session?.user?.name}</h2>
          <p className="text-gray-600">
            Your medical dashboard provides access to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Patient Appointments</li>
            <li>Medical Records</li>
            <li>Treatment Plans</li>
            <li>Prescription Management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;