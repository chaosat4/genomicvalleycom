'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Package,
  Check,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Basic Information',  description: 'Service name, category, and status' },
  { id: 2, title: 'Content Overview',   description: 'Titles and descriptions' },
  { id: 3, title: 'Service Items',      description: 'Add service items with kits' },
  { id: 4, title: 'Benefits',           description: 'List service benefits' },
  { id: 5, title: 'Review & Publish',   description: 'Review and publish service' },
];

interface Kit {
  _id: string;
  name: string;
  code: string;
  price: number;
}

interface ServiceItem {
  number: string;
  title: string;
  details: string[];
  kitRef?: string;
  kitName?: string;
  kitCode?: string;
  priceOverride?: number;
}

interface FormData {
  documentId: string;
  categoryName: string;
  order: number;
  status: string;
  stockStatus: string;
  mainContent: {
    contentTitle: string;
    contentDescription: string;
    leftBox: { title: string; description: string };
    servicesHeading: string;
    benefitsHeading: string;
    servicesList: ServiceItem[];
    benefits: string[];
  };
}

const DEFAULT_FORM: FormData = {
  documentId:   '',
  categoryName: '',
  order:        0,
  status:       'draft',
  stockStatus:  'in_stock',
  mainContent: {
    contentTitle:       '',
    contentDescription: '',
    leftBox:            { title: '', description: '' },
    servicesHeading:    'Services Included',
    benefitsHeading:    'Benefits',
    servicesList:       [],
    benefits:           [],
  },
};

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();

  const [serviceId, setServiceId]     = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData]       = useState<FormData>(DEFAULT_FORM);
  const [loadingService, setLoadSvc]  = useState(true);
  const [isSubmitting, setIsSubmit]   = useState(false);
  const [kits, setKits]               = useState<Kit[]>([]);
  const [showNewKitDialog, setShowKitDialog] = useState(false);
  const [newKit, setNewKit]           = useState({ name: '', code: '', price: '', description: '' });

  // Resolve params
  useEffect(() => {
    params.then(p => setServiceId(p.id));
  }, [params]);

  // Load service data
  useEffect(() => {
    if (!serviceId) return;
    setLoadSvc(true);
    fetch(`/api/admin/services/${serviceId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const s = data.data;
          setFormData({
            documentId:   s.documentId   ?? '',
            categoryName: s.categoryName ?? '',
            order:        s.order        ?? 0,
            status:       s.status       ?? 'draft',
            stockStatus:  s.stockStatus  ?? 'in_stock',
            mainContent: {
              contentTitle:       s.mainContent?.contentTitle       ?? '',
              contentDescription: s.mainContent?.contentDescription ?? '',
              leftBox: {
                title:       s.mainContent?.leftBox?.title       ?? '',
                description: s.mainContent?.leftBox?.description ?? '',
              },
              servicesHeading: s.mainContent?.servicesHeading ?? 'Services Included',
              benefitsHeading: s.mainContent?.benefitsHeading ?? 'Benefits',
              servicesList:    (s.mainContent?.servicesList ?? []).map((item: any) => ({
                number:        item.number    ?? '',
                title:         item.title     ?? '',
                details:       item.details   ?? [],
                kitRef:        item.kitRef    ? String(item.kitRef) : undefined,
                kitName:       item.kitName   ?? undefined,
                kitCode:       item.kitCode   ?? undefined,
                priceOverride: item.priceOverride ?? undefined,
              })),
              benefits: s.mainContent?.benefits ?? [],
            },
          });
        } else {
          toast({ title: 'Error', description: data.error || 'Service not found', variant: 'destructive' });
          router.push('/dashboard/admin/services/manage');
        }
      })
      .catch(() => {
        toast({ title: 'Error', description: 'Failed to load service', variant: 'destructive' });
        router.push('/dashboard/admin/services/manage');
      })
      .finally(() => setLoadSvc(false));
  }, [serviceId]);

  // Load kits
  useEffect(() => {
    fetch('/api/admin/kits?limit=100')
      .then(r => r.json())
      .then(d => { if (d.success) setKits(d.data); })
      .catch(() => {});
  }, []);

  // --- Submit ---
  const handleSubmit = async () => {
    setIsSubmit(true);
    try {
      const res  = await fetch(`/api/admin/services/${serviceId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Service updated successfully' });
        router.push('/dashboard/admin/services/manage');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update service', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    } finally {
      setIsSubmit(false);
    }
  };

  // --- Service Items ---
  const addServiceItem = () => {
    const newItem: ServiceItem = {
      number:  (formData.mainContent.servicesList.length + 1).toString(),
      title:   '',
      details: [''],
    };
    setFormData(fd => ({
      ...fd,
      mainContent: { ...fd.mainContent, servicesList: [...fd.mainContent.servicesList, newItem] },
    }));
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: any) => {
    setFormData(fd => {
      const list = [...fd.mainContent.servicesList];
      list[index] = { ...list[index], [field]: value };
      return { ...fd, mainContent: { ...fd.mainContent, servicesList: list } };
    });
  };

  const removeServiceItem = (index: number) => {
    setFormData(fd => {
      const list = fd.mainContent.servicesList.filter((_, i) => i !== index);
      list.forEach((item, i) => { item.number = (i + 1).toString(); });
      return { ...fd, mainContent: { ...fd.mainContent, servicesList: list } };
    });
  };

  const addDetail = (itemIndex: number) => {
    setFormData(fd => {
      const list = [...fd.mainContent.servicesList];
      list[itemIndex] = { ...list[itemIndex], details: [...list[itemIndex].details, ''] };
      return { ...fd, mainContent: { ...fd.mainContent, servicesList: list } };
    });
  };

  const updateDetail = (itemIndex: number, detailIndex: number, value: string) => {
    setFormData(fd => {
      const list = [...fd.mainContent.servicesList];
      const details = [...list[itemIndex].details];
      details[detailIndex] = value;
      list[itemIndex] = { ...list[itemIndex], details };
      return { ...fd, mainContent: { ...fd.mainContent, servicesList: list } };
    });
  };

  const removeDetail = (itemIndex: number, detailIndex: number) => {
    setFormData(fd => {
      const list = [...fd.mainContent.servicesList];
      list[itemIndex] = { ...list[itemIndex], details: list[itemIndex].details.filter((_, i) => i !== detailIndex) };
      return { ...fd, mainContent: { ...fd.mainContent, servicesList: list } };
    });
  };

  const handleKitSelection = (itemIndex: number, kitId: string) => {
    if (kitId === 'new') { setShowKitDialog(true); return; }
    if (kitId === 'manual') {
      updateServiceItem(itemIndex, 'kitRef', undefined);
      return;
    }
    const selected = kits.find(k => k._id === kitId);
    if (selected) {
      updateServiceItem(itemIndex, 'kitRef',  selected._id);
      updateServiceItem(itemIndex, 'kitName', selected.name);
      updateServiceItem(itemIndex, 'kitCode', selected.code);
    }
  };

  const createNewKit = async () => {
    try {
      const res  = await fetch('/api/admin/kits', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: newKit.name, code: newKit.code, price: parseFloat(newKit.price), description: newKit.description }),
      });
      const data = await res.json();
      if (data.success) {
        setKits(prev => [...prev, data.data]);
        setShowKitDialog(false);
        setNewKit({ name: '', code: '', price: '', description: '' });
        toast({ title: 'Kit created' });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create kit', variant: 'destructive' });
    }
  };

  // --- Benefits ---
  const addBenefit = () => {
    setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, benefits: [...fd.mainContent.benefits, ''] } }));
  };
  const updateBenefit = (index: number, value: string) => {
    setFormData(fd => {
      const benefits = [...fd.mainContent.benefits];
      benefits[index] = value;
      return { ...fd, mainContent: { ...fd.mainContent, benefits } };
    });
  };
  const removeBenefit = (index: number) => {
    setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, benefits: fd.mainContent.benefits.filter((_, i) => i !== index) } }));
  };

  // --- Render step content ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="documentId">Document ID (URL Slug) *</Label>
              <Input
                id="documentId"
                value={formData.documentId}
                onChange={e => setFormData(fd => ({ ...fd, documentId: e.target.value }))}
                placeholder="e.g., whole-genome-sequencing"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={formData.categoryName} onValueChange={v => setFormData(fd => ({ ...fd, categoryName: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order" type="number"
                value={formData.order}
                onChange={e => setFormData(fd => ({ ...fd, order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label>Stock Status</Label>
              <Select value={formData.stockStatus} onValueChange={v => setFormData(fd => ({ ...fd, stockStatus: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="contentTitle">Content Title *</Label>
              <Input
                id="contentTitle"
                value={formData.mainContent.contentTitle}
                onChange={e => setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, contentTitle: e.target.value } }))}
              />
            </div>
            <div>
              <Label htmlFor="contentDescription">Content Description *</Label>
              <Textarea
                id="contentDescription"
                value={formData.mainContent.contentDescription}
                onChange={e => setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, contentDescription: e.target.value } }))}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="servicesHeading">Services Section Heading</Label>
              <Input
                id="servicesHeading"
                value={formData.mainContent.servicesHeading}
                onChange={e => setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, servicesHeading: e.target.value } }))}
              />
            </div>
            <div>
              <Label htmlFor="benefitsHeading">Benefits Section Heading</Label>
              <Input
                id="benefitsHeading"
                value={formData.mainContent.benefitsHeading}
                onChange={e => setFormData(fd => ({ ...fd, mainContent: { ...fd.mainContent, benefitsHeading: e.target.value } }))}
              />
            </div>
            <div>
              <Label htmlFor="leftBoxTitle">Left Box Title *</Label>
              <Input
                id="leftBoxTitle"
                value={formData.mainContent.leftBox.title}
                onChange={e => setFormData(fd => ({
                  ...fd, mainContent: { ...fd.mainContent, leftBox: { ...fd.mainContent.leftBox, title: e.target.value } },
                }))}
              />
            </div>
            <div>
              <Label htmlFor="leftBoxDescription">Left Box Description *</Label>
              <Textarea
                id="leftBoxDescription"
                value={formData.mainContent.leftBox.description}
                onChange={e => setFormData(fd => ({
                  ...fd, mainContent: { ...fd.mainContent, leftBox: { ...fd.mainContent.leftBox, description: e.target.value } },
                }))}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Service Items</h3>
              <Button type="button" onClick={addServiceItem} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            {formData.mainContent.servicesList.map((item, itemIndex) => (
              <Card key={itemIndex} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Item {item.number}</h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeServiceItem(itemIndex)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Title *</Label>
                    <Input value={item.title} onChange={e => updateServiceItem(itemIndex, 'title', e.target.value)} placeholder="Service item title" />
                  </div>

                  <div>
                    <Label>Kit Selection</Label>
                    <Select
                      value={item.kitRef || (item.kitName ? 'manual' : '')}
                      onValueChange={v => handleKitSelection(itemIndex, v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select a kit" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Enter Manually</SelectItem>
                        {kits.map(kit => (
                          <SelectItem key={kit._id} value={kit._id}>
                            {kit.name} ({kit.code}) — ₹{kit.price}
                          </SelectItem>
                        ))}
                        <SelectItem value="new" className="text-purple-600 font-medium">
                          + Create New Kit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!item.kitRef && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Kit Name</Label>
                        <Input value={item.kitName || ''} onChange={e => updateServiceItem(itemIndex, 'kitName', e.target.value)} placeholder="Kit name" />
                      </div>
                      <div>
                        <Label>Kit Code</Label>
                        <Input value={item.kitCode || ''} onChange={e => updateServiceItem(itemIndex, 'kitCode', e.target.value)} placeholder="Kit code" />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Price Override (Optional)</Label>
                    <Input
                      type="number"
                      value={item.priceOverride ?? ''}
                      onChange={e => updateServiceItem(itemIndex, 'priceOverride', parseFloat(e.target.value) || undefined)}
                      placeholder="Override default kit price"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Details</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addDetail(itemIndex)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Detail
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex gap-2">
                          <Input
                            value={detail}
                            onChange={e => updateDetail(itemIndex, detailIndex, e.target.value)}
                            placeholder={`Detail ${detailIndex + 1}`}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeDetail(itemIndex, detailIndex)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {formData.mainContent.servicesList.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No service items yet</p>
                <Button type="button" onClick={addServiceItem} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add First Item
                </Button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Benefits</h3>
              <Button type="button" onClick={addBenefit} size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Benefit
              </Button>
            </div>
            <div className="space-y-3">
              {formData.mainContent.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <Input value={benefit} onChange={e => updateBenefit(index, e.target.value)} placeholder={`Benefit ${index + 1}`} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(index)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {formData.mainContent.benefits.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No benefits added yet</p>
                <Button type="button" onClick={addBenefit} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add First Benefit
                </Button>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Publication Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData(fd => ({ ...fd, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Service Preview</h3>
                <div className="space-y-3 text-sm">
                  {[
                    ['Document ID',    formData.documentId   || 'Not set'],
                    ['Title',          formData.mainContent.contentTitle || 'Not set'],
                    ['Category',       formData.categoryName || 'Not set'],
                    ['Status',         formData.status],
                    ['Stock Status',   formData.stockStatus],
                    ['Service Items',  `${formData.mainContent.servicesList.length} items`],
                    ['Benefits',       `${formData.mainContent.benefits.length} items`],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 gap-4">
                      <span className="text-gray-600 capitalize">{label}:</span>
                      <span className="col-span-2 font-medium capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingService) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back + Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/dashboard/admin/services/manage')} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">{serviceId}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  currentStep >= step.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                )}
              >
                {step.id}
              </button>
              {index < steps.length - 1 && (
                <div className={cn('w-16 h-1 mx-2 transition-colors', currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200')} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{steps[currentStep - 1].title}</h2>
          <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(s => s + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      {/* New Kit Dialog */}
      <Dialog open={showNewKitDialog} onOpenChange={setShowKitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Kit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Kit Name *</Label>
              <Input value={newKit.name} onChange={e => setNewKit(k => ({ ...k, name: e.target.value }))} />
            </div>
            <div>
              <Label>Kit Code *</Label>
              <Input value={newKit.code} onChange={e => setNewKit(k => ({ ...k, code: e.target.value }))} />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" value={newKit.price} onChange={e => setNewKit(k => ({ ...k, price: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={newKit.description} onChange={e => setNewKit(k => ({ ...k, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowKitDialog(false)}>Cancel</Button>
              <Button onClick={createNewKit} disabled={!newKit.name || !newKit.code}>Create Kit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
