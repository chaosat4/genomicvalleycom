'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';

const CATEGORY_LABELS: Record<string, string> = {
  human: 'Human DNA Panels',
  pro: 'DNA Pro Panels',
  ultra: 'DNA Ultra Panels',
};

export default function NewPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    documentId: '',
    name: '',
    geneCount: '',
    category: 'human',
    order: '0',
    genes: '',       // optional, hidden by default
  });

  // Auto-generate documentId from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((f) => ({ ...f, name, documentId: f.documentId || slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const geneCountNum = parseInt(formData.geneCount, 10);
    if (isNaN(geneCountNum) || geneCountNum < 0) {
      toast({ title: 'Validation error', description: 'Gene count must be a non-negative number', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        documentId: formData.documentId,
        name: formData.name,
        geneCount: geneCountNum,
        category: formData.category,
        order: parseInt(formData.order, 10) || 0,
      };
      if (formData.genes.trim()) payload.genes = formData.genes.trim();

      const response = await fetch('/api/admin/panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({ title: 'Success', description: 'Panel created successfully' });
        router.push('/dashboard/admin/panels/manage');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to create panel', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create panel', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Panel</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <Label htmlFor="name">Panel Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Human Breast Cancer Panel"
                required
              />
            </div>

            <div>
              <Label htmlFor="documentId">Document ID *</Label>
              <Input
                id="documentId"
                value={formData.documentId}
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                placeholder="e.g., human-breast-cancer-panel"
                className="font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly identifier, auto-filled from name.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="geneCount">Number of Genes *</Label>
                <Input
                  id="geneCount"
                  type="number"
                  min="0"
                  value={formData.geneCount}
                  onChange={(e) => setFormData({ ...formData, geneCount: e.target.value })}
                  placeholder="e.g., 93"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first within their category.</p>
            </div>

            <div>
              <Label htmlFor="genes">Gene List (optional)</Label>
              <Input
                id="genes"
                value={formData.genes}
                onChange={(e) => setFormData({ ...formData, genes: e.target.value })}
                placeholder="e.g., BRCA1, BRCA2, TP53, EGFR"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated gene names. Not shown publicly.</p>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/admin/panels/manage')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Panel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
