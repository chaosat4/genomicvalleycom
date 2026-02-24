'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuotationFormProps {
  id: string;
}

export default function QuotationForm({ id }: QuotationFormProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { toast } = useToast();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    address: '',
    phone: '',
    email: '',
    servicesRequired: '',
    serviceName: '',
    speciesName: '',
    tissueName: '',
    numberOfSamples: '',
    basesRequired: '',
    readLength: 'PE-150x2',
    sequencingPlatform: 'MGI',
    dataAnalysis: 'standard',
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/request-quotation/${id}`)}`);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        const data = await response.json();
        if (data.success) {
          setService(data.data);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchService();
    }
  }, [id, session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceTitle: service?.mainContent?.contentTitle,
          formData: {
            ...formData,
            numberOfSamples: parseInt(formData.numberOfSamples),
            basesRequired: parseFloat(formData.basesRequired),
          },
          userInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            institution: formData.institution,
            address: formData.address,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Quotation Generated',
          description: `Quotation number: ${data.data.quotationNumber}`,
        });
        router.push('/services');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate quotation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate quotation',
        variant: 'destructive',
      });
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-50 mt-40 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Request Quotation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Number of Samples</Label>
                <Input
                  type="number"
                  value={formData.numberOfSamples}
                  onChange={(e) => setFormData({ ...formData, numberOfSamples: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Bases Required (GB)</Label>
                <Input
                  value={formData.basesRequired}
                  onChange={(e) => setFormData({ ...formData, basesRequired: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Sequencing Platform</Label>
                <Select
                  value={formData.sequencingPlatform}
                  onValueChange={(value) => setFormData({ ...formData, sequencingPlatform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MGI">MGI</SelectItem>
                    <SelectItem value="Illumina">Illumina</SelectItem>
                    <SelectItem value="PacBio">PacBio</SelectItem>
                    <SelectItem value="Nanopore">Nanopore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Generate Quotation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
