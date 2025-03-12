'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { use } from 'react';
import { Card } from "@/components/ui/card";
import { Dna, CheckCircle, Clock, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ServiceData {
  id: number;
  name: string;
  overview: string;
  price: number;
  razorpay_link: string;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CheckoutPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Service not found');
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save checkout data
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceId: resolvedParams.id,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to save checkout data');
      }

      // Redirect to Razorpay
      if (service?.razorpay_link) {
        window.location.href = service.razorpay_link;
      }
    } catch (err) {
      setError('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-purple-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details Column */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-start space-x-4">
                <Dna className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{service?.name}</h2>
                  <p className="text-gray-600 mt-2">{service?.overview}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 mx-4">
                    <p>We advise getting a consultation before booking the service for better pricing and customized solutions.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/contact')} 
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Enquiry
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Premium Quality Service</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Quick Turnaround Time</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </Card>

            {/* Additional Service Information */}
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">What's Included</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Comprehensive Analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Expert Consultation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Detailed Reports</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Checkout Form Column */}
          <div>
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Your Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!service?.razorpay_link}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed to Payment
                </button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 