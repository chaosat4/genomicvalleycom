'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Quotation {
  _id: string;
  quotationNumber: string;
  batchNumber: string;
  userInfo: {
    name: string;
    email: string;
    institution: string;
  };
  serviceInfo: {
    title: string;
  };
  pricing: {
    totalPrice: number;
  };
  status: string;
  createdAt: string;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quotations will be implemented
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
        <p className="text-gray-600 mt-1">View all generated quotations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : quotations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No quotations yet. They will appear here once generated.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation._id}>
                    <TableCell>{quotation.quotationNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quotation.userInfo.name}</p>
                        <p className="text-sm text-gray-500">{quotation.userInfo.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{quotation.serviceInfo.title}</TableCell>
                    <TableCell>₹{quotation.pricing.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge>{quotation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
