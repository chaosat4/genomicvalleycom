'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Calculator } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Kit {
  _id: string;
  name: string;
  code: string;
}

interface PriceConfig {
  extraction: number;
  sampleQC: number;
  libraryQC: number;
  serviceCost: number;
  logistics: number;
  libraryPreparation: Array<{
    kitRef: string;
    price: number;
    kitName?: string;
  }>;
  sequencingPerGb: {
    illumina: number;
    mgi: number;
    nanopore: number;
    pacbio: number;
    hic: number;
  };
  genomeAssemblyPerSample: {
    illumina: number;
    mgi: number;
    nanopore: number;
    pacbio: number;
    hic: number;
  };
  dataAnalysis: {
    standard: number;
    interpretation: number;
  };
  profitPercentage: number;
  gstPercentage: number;
  bulkDiscount: {
    categories: Array<{
      name: string;
      minSample: number;
      maxSample: number;
      discount: number;
    }>;
  };
  additionalDiscount: number;
}

const defaultConfig: PriceConfig = {
  extraction: 0,
  sampleQC: 0,
  libraryQC: 0,
  serviceCost: 0,
  logistics: 0,
  libraryPreparation: [],
  sequencingPerGb: {
    illumina: 0,
    mgi: 0,
    nanopore: 0,
    pacbio: 0,
    hic: 0,
  },
  genomeAssemblyPerSample: {
    illumina: 0,
    mgi: 0,
    nanopore: 0,
    pacbio: 0,
    hic: 0,
  },
  dataAnalysis: {
    standard: 0,
    interpretation: 0,
  },
  profitPercentage: 0,
  gstPercentage: 18,
  bulkDiscount: {
    categories: [],
  },
  additionalDiscount: 0,
};

export default function PricingPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<PriceConfig>(defaultConfig);
  const [kits, setKits] = useState<Kit[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchConfig();
    fetchKits();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      if (data.success && data.data) {
        setConfig({ ...defaultConfig, ...data.data });
        setLastUpdated(new Date(data.data.updatedAt));
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKits = async () => {
    try {
      const response = await fetch('/api/admin/kits?limit=100');
      const data = await response.json();
      if (data.success) {
        setKits(data.data);
      }
    } catch (error) {
      console.error('Error fetching kits:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        setLastUpdated(new Date());
        toast({ title: 'Success', description: 'Pricing configuration saved' });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addLibraryPrep = () => {
    setConfig({
      ...config,
      libraryPreparation: [
        ...config.libraryPreparation,
        { kitRef: '', price: 0 },
      ],
    });
  };

  const updateLibraryPrep = (index: number, field: string, value: any) => {
    const updated = [...config.libraryPreparation];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'kitRef') {
      const kit = kits.find(k => k._id === value);
      updated[index].kitName = kit?.name;
    }
    setConfig({ ...config, libraryPreparation: updated });
  };

  const removeLibraryPrep = (index: number) => {
    setConfig({
      ...config,
      libraryPreparation: config.libraryPreparation.filter((_, i) => i !== index),
    });
  };

  const addBulkDiscount = () => {
    setConfig({
      ...config,
      bulkDiscount: {
        ...config.bulkDiscount,
        categories: [
          ...config.bulkDiscount.categories,
          { name: '', minSample: 0, maxSample: 0, discount: 0 },
        ],
      },
    });
  };

  const updateBulkDiscount = (index: number, field: string, value: any) => {
    const updated = [...config.bulkDiscount.categories];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({
      ...config,
      bulkDiscount: { ...config.bulkDiscount, categories: updated },
    });
  };

  const removeBulkDiscount = (index: number) => {
    setConfig({
      ...config,
      bulkDiscount: {
        ...config.bulkDiscount,
        categories: config.bulkDiscount.categories.filter((_, i) => i !== index),
      },
    });
  };

  const testCalculation = () => {
    // Simple test calculation
    const testPrice = 1000;
    const withProfit = testPrice * (1 + config.profitPercentage / 100);
    const withGST = withProfit * (1 + config.gstPercentage / 100);
    return withGST.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-600 mt-1">Manage all pricing settings</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Test Calculation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Price Calculation</DialogTitle>
              </DialogHeader>
              <div className="pt-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Test calculation with base price of ₹1000:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit ({config.profitPercentage}%):</span>
                    <span>₹{(1000 * config.profitPercentage / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({config.gstPercentage}%):</span>
                    <span>₹{(1000 * (1 + config.profitPercentage / 100) * config.gstPercentage / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Final Price:</span>
                    <span>₹{testCalculation()}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Services</TabsTrigger>
          <TabsTrigger value="library">Library Prep</TabsTrigger>
          <TabsTrigger value="sequencing">Sequencing</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="business">Business Rules</TabsTrigger>
        </TabsList>

        {/* Basic Services */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Services (₹ per sample)</CardTitle>
              <CardDescription>Set pricing for basic laboratory services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="extraction">Extraction Cost</Label>
                  <Input
                    id="extraction"
                    type="number"
                    value={config.extraction}
                    onChange={(e) => setConfig({ ...config, extraction: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="sampleQC">Sample QC Cost</Label>
                  <Input
                    id="sampleQC"
                    type="number"
                    value={config.sampleQC}
                    onChange={(e) => setConfig({ ...config, sampleQC: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="libraryQC">Library QC Cost</Label>
                  <Input
                    id="libraryQC"
                    type="number"
                    value={config.libraryQC}
                    onChange={(e) => setConfig({ ...config, libraryQC: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="serviceCost">Service Cost</Label>
                  <Input
                    id="serviceCost"
                    type="number"
                    value={config.serviceCost}
                    onChange={(e) => setConfig({ ...config, serviceCost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="logistics">Logistics Cost (Flat)</Label>
                  <Input
                    id="logistics"
                    type="number"
                    value={config.logistics}
                    onChange={(e) => setConfig({ ...config, logistics: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Preparation */}
        <TabsContent value="library">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Library Preparation (₹ per sample)</CardTitle>
                  <CardDescription>Set pricing for each kit</CardDescription>
                </div>
                <Button onClick={addLibraryPrep} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Kit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.libraryPreparation.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-xs">Kit</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={item.kitRef}
                        onChange={(e) => updateLibraryPrep(index, 'kitRef', e.target.value)}
                      >
                        <option value="">Select Kit</option>
                        {kits.map((kit) => (
                          <option key={kit._id} value={kit._id}>
                            {kit.name} ({kit.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Price (₹)</Label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateLibraryPrep(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLibraryPrep(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {config.libraryPreparation.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No library preparation pricing set. Click "Add Kit" to add pricing.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sequencing */}
        <TabsContent value="sequencing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sequencing Cost (₹ per GB)</CardTitle>
                <CardDescription>Set cost per gigabase for each sequencing platform</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                {Object.entries(config.sequencingPerGb).map(([platform, price]) => (
                  <div key={platform}>
                    <Label className="capitalize">{platform}</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setConfig({
                        ...config,
                        sequencingPerGb: {
                          ...config.sequencingPerGb,
                          [platform]: parseFloat(e.target.value) || 0,
                        },
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Genome Assembly (₹ per sample)</CardTitle>
                <CardDescription>Set cost per sample for genome assembly</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                {Object.entries(config.genomeAssemblyPerSample).map(([platform, price]) => (
                  <div key={platform}>
                    <Label className="capitalize">{platform}</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setConfig({
                        ...config,
                        genomeAssemblyPerSample: {
                          ...config.genomeAssemblyPerSample,
                          [platform]: parseFloat(e.target.value) || 0,
                        },
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Analysis */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Data Analysis (₹ per sample)</CardTitle>
              <CardDescription>Set pricing for data analysis services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="standardAnalysis">Standard Analysis</Label>
                  <Input
                    id="standardAnalysis"
                    type="number"
                    value={config.dataAnalysis.standard}
                    onChange={(e) => setConfig({
                      ...config,
                      dataAnalysis: { ...config.dataAnalysis, standard: parseFloat(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="interpretation">Interpretation</Label>
                  <Input
                    id="interpretation"
                    type="number"
                    value={config.dataAnalysis.interpretation}
                    onChange={(e) => setConfig({
                      ...config,
                      dataAnalysis: { ...config.dataAnalysis, interpretation: parseFloat(e.target.value) || 0 },
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Rules */}
        <TabsContent value="business">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Markup & Tax</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="profitPercentage">Profit Percentage (%)</Label>
                  <Input
                    id="profitPercentage"
                    type="number"
                    value={config.profitPercentage}
                    onChange={(e) => setConfig({ ...config, profitPercentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="gstPercentage">GST Percentage (%)</Label>
                  <Input
                    id="gstPercentage"
                    type="number"
                    value={config.gstPercentage}
                    onChange={(e) => setConfig({ ...config, gstPercentage: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalDiscount">Additional Discount (%)</Label>
                  <Input
                    id="additionalDiscount"
                    type="number"
                    value={config.additionalDiscount}
                    onChange={(e) => setConfig({ ...config, additionalDiscount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bulk Discounts</CardTitle>
                    <CardDescription>Set discount tiers based on sample volume</CardDescription>
                  </div>
                  <Button onClick={addBulkDiscount} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {config.bulkDiscount.categories.map((category, index) => (
                    <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-xs">Category Name</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => updateBulkDiscount(index, 'name', e.target.value)}
                          placeholder="e.g., Small Batch"
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Min Samples</Label>
                        <Input
                          type="number"
                          value={category.minSample}
                          onChange={(e) => updateBulkDiscount(index, 'minSample', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Max Samples</Label>
                        <Input
                          type="number"
                          value={category.maxSample}
                          onChange={(e) => updateBulkDiscount(index, 'maxSample', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Discount %</Label>
                        <Input
                          type="number"
                          value={category.discount}
                          onChange={(e) => updateBulkDiscount(index, 'discount', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBulkDiscount(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {config.bulkDiscount.categories.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No bulk discounts set. Click "Add Tier" to create discount categories.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
