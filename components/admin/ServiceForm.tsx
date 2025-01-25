'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';

export interface ServiceFormData {
  name: string;
  overview: string;
  commitment: string;
  contact: string;
  price: number;
  category: string;
  razorpay_link: string;
  whyChoose: { feature: string; description: string }[];
  whoCanBenefit: { type: string; description: string }[];
  diseasesSupported: { name: string; relevance: string }[];
  process: { step: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

interface Props {
  initialData?: ServiceFormData;
  serviceId?: string;
  onSuccess?: () => void;
}

export default function ServiceForm({ initialData, serviceId, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || {
      name: '',
      overview: '',
      commitment: '',
      contact: '',
      price: 0,
      category: '',
      razorpay_link: '',
      whyChoose: [{ feature: '', description: '' }],
      whoCanBenefit: [{ type: '', description: '' }],
      diseasesSupported: [{ name: '', relevance: '' }],
      process: [{ step: '', description: '' }],
      faqs: [{ question: '', answer: '' }],
    }
  );
  const [message, setMessage] = useState('');
  const { user, loading: userLoading } = useUser();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.is_admin) {
    return <div>Unauthorized</div>;
  }

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>,
    index: number,
    subField: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };

  const addArrayItem = (
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], getEmptyItem(field)],
    }));
  };

  const removeArrayItem = (
    field: keyof Pick<ServiceFormData, 'whyChoose' | 'whoCanBenefit' | 'diseasesSupported' | 'process' | 'faqs'>,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const getEmptyItem = (field: keyof ServiceFormData) => {
    switch (field) {
      case 'whyChoose':
        return { feature: '', description: '' };
      case 'whoCanBenefit':
        return { type: '', description: '' };
      case 'diseasesSupported':
        return { name: '', relevance: '' };
      case 'process':
        return { step: '', description: '' };
      case 'faqs':
        return { question: '', answer: '' };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = serviceId 
        ? `/api/services/${serviceId}`
        : '/api/services';
      
      const method = serviceId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save service');
      }

      toast({
        title: "Success",
        description: "Service saved successfully!",
      });
      
      if (!serviceId) {
        // Reset form
        setFormData({
          name: '',
          overview: '',
          commitment: '',
          contact: '',
          price: 0,
          category: 'Diagnostic Services',
          razorpay_link: '',
          whyChoose: [{ feature: '', description: '' }],
          whoCanBenefit: [{ type: '', description: '' }],
          diseasesSupported: [{ name: '', relevance: '' }],
          process: [{ step: '', description: '' }],
          faqs: [{ question: '', answer: '' }],
        });
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-8 p-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleBasicChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleBasicChange}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleBasicChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleBasicChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select Category</option>
                <option value="Diagnostic Services">Diagnostic Services</option>
                <option value="Research Services">Research Services</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay_link">Razorpay Link</Label>
            <Input
              id="razorpay_link"
              name="razorpay_link"
              value={formData.razorpay_link}
              onChange={handleBasicChange}
              required
            />
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Why Choose Our Service</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addArrayItem('whyChoose')}
              className="text-primary hover:text-primary/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {formData.whyChoose.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('whyChoose', index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Feature</Label>
                <Input
                  value={item.feature}
                  onChange={(e) => handleArrayChange('whyChoose', index, 'feature', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('whyChoose', index, 'description', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Who Can Benefit Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Who Can Benefit</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addArrayItem('whoCanBenefit')}
              className="text-primary hover:text-primary/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {formData.whoCanBenefit.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('whoCanBenefit', index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Beneficiary Type</Label>
                <Input
                  value={item.type}
                  onChange={(e) => handleArrayChange('whoCanBenefit', index, 'type', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('whoCanBenefit', index, 'description', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Diseases Supported Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Diseases Supported</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addArrayItem('diseasesSupported')}
              className="text-primary hover:text-primary/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {formData.diseasesSupported.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('diseasesSupported', index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Disease Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => handleArrayChange('diseasesSupported', index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Relevance</Label>
                <Textarea
                  value={item.relevance}
                  onChange={(e) => handleArrayChange('diseasesSupported', index, 'relevance', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Process Steps</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addArrayItem('process')}
              className="text-primary hover:text-primary/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {formData.process.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('process', index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Step Title</Label>
                <Input
                  value={item.step}
                  onChange={(e) => handleArrayChange('process', index, 'step', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Step Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => handleArrayChange('process', index, 'description', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addArrayItem('faqs')}
              className="text-primary hover:text-primary/80"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {formData.faqs.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem('faqs', index)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={item.question}
                  onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={item.answer}
                  onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commitment">Our Commitment</Label>
            <Textarea
              id="commitment"
              name="commitment"
              value={formData.commitment}
              onChange={handleBasicChange}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Textarea
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleBasicChange}
              required
              rows={4}
            />
          </div>
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : serviceId ? 'Update Service' : 'Create Service'}
        </Button>
      </form>
    </div>
  );
} 