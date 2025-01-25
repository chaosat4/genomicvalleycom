'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';

export default function PatientDashboard() {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.is_patient) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}</h2>
        <p className="text-gray-600">
          Your health dashboard provides access to:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>Upcoming Appointments</li>
          <li>Medical History</li>
          <li>Test Results</li>
          <li>Prescriptions</li>
        </ul>
      </div>
    </div>
  );
}