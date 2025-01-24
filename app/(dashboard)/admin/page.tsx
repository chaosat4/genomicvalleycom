'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ServiceForm from '@/components/admin/ServiceForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Package, ArrowRight } from "lucide-react";
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  overview: string;
  price: number;
  category: string;
  createdAt: string;
  _count: {
    whyChoose: number;
    whoCanBenefit: number;
    diseasesSupported: number;
    process: number;
    faqs: number;
  }
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!session.user?.isAdmin) {
      router.push('/login');
    }

    // Fetch services
    fetchServices();
  }, [session, status, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/services/${id}/edit`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Add Service Button */}
        <Link 
          href="/admin/services/new" 
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="p-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add New Service</h3>
                <p className="text-gray-600 mt-1">Create a new service offering</p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Services List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">All Services</h2>
          </div>
          
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{service.overview}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        ₹{service.price}
                      </span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span title="Features">{service._count.whyChoose} features</span>
                        <span>•</span>
                        <span title="Diseases">{service._count.diseasesSupported} diseases</span>
                        <span>•</span>
                        <span title="Process Steps">{service._count.process} steps</span>
                        <span>•</span>
                        <span title="FAQs">{service._count.faqs} FAQs</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        Added {new Date(service.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleEdit(service.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit service"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete service"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {services.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No services found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Add your first service using the form above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;