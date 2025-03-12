'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Activity, Heart, Shield, Users } from "lucide-react";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from 'next/navigation';

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

export default function DiagnosticServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/category?category=Diagnostic Services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (id: number) => {
    router.push(`/services/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Diagnostic Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Genomic Valley Bharat, our diagnostic services harness the power of Next-Generation Sequencing (NGS) to deliver unparalleled precision in identifying genetic mutations and abnormalities.
          </p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative h-[400px] mb-16 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <Image
            src="/Diagnostic Services.jpg"
            alt="Diagnostic Services"
            fill
            className="object-cover"
          />
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ServiceSection
            title="Personalized Healthcare"
            content="Personalized healthcare at Genomic Valley Bharat is centered on tailoring medical treatment to individual patients based on their unique genetic profiles..."
            imagePath="/Personalized Healthcare.jpg"
          />
          <ServiceSection
            title="Genetic Disease Predisposition"
            content="Our genetic disease predisposition services focus on identifying individuals' susceptibility to various hereditary conditions..."
            imagePath="/genetic-disease.jpg"
          />
          <ServiceSection
            title="Community Health Support"
            content="Community health support at Genomic Valley Bharat aims to improve public health outcomes through comprehensive genomic screening programs..."
            imagePath="/Community Health Support.jpg"
          />
          <ServiceSection
            title="Infectious Diseases"
            content="At Genomic Valley Bharat, we utilize advanced genomic sequencing and rapid diagnostics to identify and combat infectious diseases swiftly, enhancing public health response and patient outcomes."
            imagePath="/Genetic Disease Predisposition.jpg"
          />
        </div>

        {/* Available Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="text-primary mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.overview}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {service._count.diseasesSupported} diseases supported
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceSection({ 
  title, 
  content, 
  imagePath 
}: { 
  title: string; 
  content: string; 
  imagePath: string;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
} 