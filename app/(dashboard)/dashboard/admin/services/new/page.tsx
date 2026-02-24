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
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Save, RotateCcw, Plus, Trash2, Package, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Basic Information', description: 'Service name, category, and status' },
  { id: 2, title: 'Content Overview', description: 'Titles and descriptions' },
  { id: 3, title: 'Service Items', description: 'Add service items with kits' },
  { id: 4, title: 'Benefits', description: 'List service benefits' },
  { id: 5, title: 'Review & Publish', description: 'Review and publish service' },
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

export default function NewServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [kits, setKits] = useState<Kit[]>([]);
  const [showNewKitDialog, setShowNewKitDialog] = useState(false);
  const [newKit, setNewKit] = useState({ name: '', code: '', price: '', description: '' });
  
  const [formData, setFormData] = useState({
    documentId: '',
    categoryName: '',
    order: 0,
    status: 'draft',
    stockStatus: 'in_stock',
    mainContent: {
      contentTitle: '',
      contentDescription: '',
      leftBox: { title: '', description: '' },
      servicesHeading: 'Services Included',
      benefitsHeading: 'Benefits',
      servicesList: [] as ServiceItem[],
      benefits: [] as string[],
    },
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('service-draft-new');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep || 1);
        setLastSaved(new Date(parsed.savedAt));
        toast({
          title: 'Draft Restored',
          description: 'Your previous draft has been restored',
        });
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, currentStep]);

  // Fetch kits for selection
  useEffect(() => {
    fetchKits();
  }, []);

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

  const saveDraft = useCallback(async (showToast = true) => {
    setIsSavingDraft(true);
    try {
      const draft = {
        formData,
        currentStep,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('service-draft-new', JSON.stringify(draft));
      setLastSaved(new Date());
      if (showToast) {
        toast({ title: 'Draft Saved', description: 'Your progress has been saved' });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  }, [formData, currentStep, toast]);

  const clearDraft = () => {
    if (confirm('Are you sure you want to clear your draft?')) {
      localStorage.removeItem('service-draft-new');
      setFormData({
        documentId: '',
        categoryName: '',
        order: 0,
        status: 'draft',
        stockStatus: 'in_stock',
        mainContent: {
          contentTitle: '',
          contentDescription: '',
          leftBox: { title: '', description: '' },
          servicesHeading: 'Services Included',
          benefitsHeading: 'Benefits',
          servicesList: [],
          benefits: [],
        },
      });
      setCurrentStep(1);
      setLastSaved(null);
      toast({ title: 'Draft Cleared', description: 'Your draft has been cleared' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('service-draft-new');
        toast({ title: 'Success', description: 'Service created successfully' });
        router.push('/dashboard/admin/services/manage');
      } else {
        toast({ 
          title: 'Error', 
          description: data.error || 'Failed to create service',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to create service',
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addServiceItem = () => {
    const newItem: ServiceItem = {
      number: (formData.mainContent.servicesList.length + 1).toString(),
      title: '',
      details: [''],
    };
    setFormData({
      ...formData,
      mainContent: {
        ...formData.mainContent,
        servicesList: [...formData.mainContent.servicesList, newItem],
      },
    });
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: any) => {
    const updatedList = [...formData.mainContent.servicesList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, servicesList: updatedList },
    });
  };

  const removeServiceItem = (index: number) => {
    const updatedList = formData.mainContent.servicesList.filter((_, i) => i !== index);
    // Renumber items
    updatedList.forEach((item, i) => { item.number = (i + 1).toString(); });
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, servicesList: updatedList },
    });
  };

  const addDetail = (itemIndex: number) => {
    const updatedList = [...formData.mainContent.servicesList];
    updatedList[itemIndex].details.push('');
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, servicesList: updatedList },
    });
  };

  const updateDetail = (itemIndex: number, detailIndex: number, value: string) => {
    const updatedList = [...formData.mainContent.servicesList];
    updatedList[itemIndex].details[detailIndex] = value;
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, servicesList: updatedList },
    });
  };

  const removeDetail = (itemIndex: number, detailIndex: number) => {
    const updatedList = [...formData.mainContent.servicesList];
    updatedList[itemIndex].details = updatedList[itemIndex].details.filter((_, i) => i !== detailIndex);
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, servicesList: updatedList },
    });
  };

  const handleKitSelection = (itemIndex: number, kitId: string) => {
    if (kitId === 'new') {
      setShowNewKitDialog(true);
      return;
    }
    
    if (kitId === 'manual') {
      updateServiceItem(itemIndex, 'kitRef', undefined);
      return;
    }

    const selectedKit = kits.find(k => k._id === kitId);
    if (selectedKit) {
      updateServiceItem(itemIndex, 'kitRef', selectedKit._id);
      updateServiceItem(itemIndex, 'kitName', selectedKit.name);
      updateServiceItem(itemIndex, 'kitCode', selectedKit.code);
    }
  };

  const createNewKit = async () => {
    try {
      const response = await fetch('/api/admin/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKit.name,
          code: newKit.code,
          price: parseFloat(newKit.price),
          description: newKit.description,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setKits([...kits, data.data]);
        setShowNewKitDialog(false);
        setNewKit({ name: '', code: '', price: '', description: '' });
        toast({ title: 'Success', description: 'Kit created successfully' });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create kit', variant: 'destructive' });
    }
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      mainContent: {
        ...formData.mainContent,
        benefits: [...formData.mainContent.benefits, ''],
      },
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const updatedBenefits = [...formData.mainContent.benefits];
    updatedBenefits[index] = value;
    setFormData({
      ...formData,
      mainContent: { ...formData.mainContent, benefits: updatedBenefits },
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      mainContent: {
        ...formData.mainContent,
        benefits: formData.mainContent.benefits.filter((_, i) => i !== index),
      },
    });
  };

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
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                placeholder="e.g., whole-genome-sequencing"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => setFormData({ ...formData, categoryName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="stockStatus">Stock Status</Label>
              <Select
                value={formData.stockStatus}
                onValueChange={(value: any) => setFormData({ ...formData, stockStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { ...formData.mainContent, contentTitle: e.target.value }
                })}
                placeholder="e.g., Whole Genome Sequencing"
              />
            </div>
            <div>
              <Label htmlFor="contentDescription">Content Description *</Label>
              <Textarea
                id="contentDescription"
                value={formData.mainContent.contentDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { ...formData.mainContent, contentDescription: e.target.value }
                })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="servicesHeading">Services Section Heading</Label>
              <Input
                id="servicesHeading"
                value={formData.mainContent.servicesHeading}
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { ...formData.mainContent, servicesHeading: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="benefitsHeading">Benefits Section Heading</Label>
              <Input
                id="benefitsHeading"
                value={formData.mainContent.benefitsHeading}
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { ...formData.mainContent, benefitsHeading: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="leftBoxTitle">Left Box Title *</Label>
              <Input
                id="leftBoxTitle"
                value={formData.mainContent.leftBox.title}
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { 
                    ...formData.mainContent, 
                    leftBox: { ...formData.mainContent.leftBox, title: e.target.value }
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="leftBoxDescription">Left Box Description *</Label>
              <Textarea
                id="leftBoxDescription"
                value={formData.mainContent.leftBox.description}
                onChange={(e) => setFormData({
                  ...formData,
                  mainContent: { 
                    ...formData.mainContent, 
                    leftBox: { ...formData.mainContent.leftBox, description: e.target.value }
                  }
                })}
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
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {formData.mainContent.servicesList.map((item, itemIndex) => (
              <Card key={itemIndex} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Item {item.number}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServiceItem(itemIndex)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateServiceItem(itemIndex, 'title', e.target.value)}
                      placeholder="Service item title"
                    />
                  </div>

                  <div>
                    <Label>Kit Selection</Label>
                    <Select
                      value={item.kitRef || (item.kitName ? 'manual' : '')}
                      onValueChange={(value) => handleKitSelection(itemIndex, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a kit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Enter Manually</SelectItem>
                        {kits.map((kit) => (
                          <SelectItem key={kit._id} value={kit._id}>
                            {kit.name} ({kit.code}) - ₹{kit.price}
                          </SelectItem>
                        ))}
                        <SelectItem value="new" className="text-purple-600 font-medium">
                          + Create New Kit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(!item.kitRef) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Kit Name</Label>
                        <Input
                          value={item.kitName || ''}
                          onChange={(e) => updateServiceItem(itemIndex, 'kitName', e.target.value)}
                          placeholder="Kit name"
                        />
                      </div>
                      <div>
                        <Label>Kit Code</Label>
                        <Input
                          value={item.kitCode || ''}
                          onChange={(e) => updateServiceItem(itemIndex, 'kitCode', e.target.value)}
                          placeholder="Kit code"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Price Override (Optional)</Label>
                    <Input
                      type="number"
                      value={item.priceOverride || ''}
                      onChange={(e) => updateServiceItem(itemIndex, 'priceOverride', parseFloat(e.target.value) || undefined)}
                      placeholder="Override default kit price"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Details</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addDetail(itemIndex)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Detail
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex gap-2">
                          <Input
                            value={detail}
                            onChange={(e) => updateDetail(itemIndex, detailIndex, e.target.value)}
                            placeholder={`Detail ${detailIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDetail(itemIndex, detailIndex)}
                            className="text-red-600"
                          >
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
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
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
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>

            <div className="space-y-3">
              {formData.mainContent.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {formData.mainContent.benefits.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No benefits added yet</p>
                <Button type="button" onClick={addBenefit} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Benefit
                </Button>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="status">Publication Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                  <SelectItem value="published">Publish Immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Service Preview</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600">Title:</span>
                    <span className="col-span-2 font-medium">{formData.mainContent.contentTitle || 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600">Category:</span>
                    <span className="col-span-2 capitalize">{formData.categoryName || 'Not set'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600">Status:</span>
                    <span className="col-span-2 capitalize">{formData.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600">Service Items:</span>
                    <span className="col-span-2">{formData.mainContent.servicesList.length} items</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-gray-600">Benefits:</span>
                    <span className="col-span-2">{formData.mainContent.benefits.length} items</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with draft status */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Service</h1>
            <p className="text-gray-600 mt-2">Create a new service in 5 simple steps</p>
          </div>
          {lastSaved && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
              <button
                onClick={clearDraft}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Clear Draft
              </button>
            </div>
          )}
        </div>
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
                <div
                  className={cn(
                    'w-16 h-1 mx-2 transition-colors',
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                  )}
                />
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

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => saveDraft(true)}
            disabled={isSavingDraft}
          >
            <RotateCcw className={cn("h-4 w-4 mr-2", isSavingDraft && "animate-spin")} />
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          )}
        </div>
      </div>

      {/* New Kit Dialog */}
      <Dialog open={showNewKitDialog} onOpenChange={setShowNewKitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Kit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Kit Name *</Label>
              <Input
                value={newKit.name}
                onChange={(e) => setNewKit({ ...newKit, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Kit Code *</Label>
              <Input
                value={newKit.code}
                onChange={(e) => setNewKit({ ...newKit, code: e.target.value })}
              />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={newKit.price}
                onChange={(e) => setNewKit({ ...newKit, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newKit.description}
                onChange={(e) => setNewKit({ ...newKit, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewKitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createNewKit}>Create Kit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
