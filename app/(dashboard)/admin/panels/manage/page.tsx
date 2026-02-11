'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PanelsManagePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Panels</h1>
          <p className="text-gray-600 mt-1">View and manage all gene panels</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/panels/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Panel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Panels</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Panel management table will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
