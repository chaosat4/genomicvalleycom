'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dna, ArrowRight, Activity, Microscope } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Service {
  id: number;
  name: string;
  overview: string;
  price: number;
  category: string;
  _count: {
    whyChoose: number;
    diseasesSupported: number;
    process: number;
  }
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchServices(activeCategory);
  }, [activeCategory]);

  const fetchServices = async (category: string) => {
    try {
      const url = category === 'all' 
        ? '/api/services/category'
        : `/api/services/category?category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (id: number) => {
    router.push(`/services/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Our Services</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover our comprehensive range of genomic services
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="all"
              onClick={() => setActiveCategory('all')}
            >
              All Services
            </TabsTrigger>
            <TabsTrigger 
              value="Diagnostic Services"
              onClick={() => setActiveCategory('Diagnostic Services')}
            >
              Diagnostic Services
            </TabsTrigger>
            <TabsTrigger 
              value="Research Services"
              onClick={() => setActiveCategory('Research Services')}
            >
              Research Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => handleServiceClick(service.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="Diagnostic Services" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => handleServiceClick(service.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="Research Services" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => handleServiceClick(service.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick }: { service: Service; onClick: () => void }) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {service.category === 'Diagnostic Services' ? (
            <Activity className="h-8 w-8 text-primary" />
          ) : (
            <Microscope className="h-8 w-8 text-primary" />
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
            <span className="text-sm text-primary">{service.category}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {service.overview}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-2xl font-bold text-primary">₹{service.price}</span>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>{service._count.diseasesSupported} diseases</span>
            <span>{service._count.process} steps</span>
          </div>
        </div>

        <div className="mt-4 flex items-center text-primary hover:text-primary/80">
          <span className="text-sm font-medium">Learn More</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Card>
  );
} 