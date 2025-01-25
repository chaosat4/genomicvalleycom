'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.is_doctor) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}</h2>
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
  );
}