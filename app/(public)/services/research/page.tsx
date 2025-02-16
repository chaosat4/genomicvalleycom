'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Microscope, Brain, Database, Network } from "lucide-react";
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

export default function ResearchServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/category?category=Research Services');
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
    <div className="min-h-screen bg-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Research Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our research services at Genomic Valley Bharat focus on pioneering advancements in oncology through the application of Next-Generation Sequencing (NGS) and artificial intelligence.
          </p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative h-[400px] mb-16 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <Image
            src="/Research Services_2.jpg"
            alt="Research Services"
            fill
            className="object-cover"
          />
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ResearchSection
            title="AI-Based Genome Healthcare"
            content="At Genomic Valley Bharat, we are pioneering AI-based genome healthcare research to revolutionize the way genetic data is analyzed and interpreted..."
            imagePath="/AI-Based Genome Healthcare.jpg"
          />
          <ResearchSection
            title="Metagenomics and Healthcare"
            content="Our metagenomics research focuses on studying the collective genomes of microbial communities within the human body..."
            imagePath="/Metagenomics and Healthcare.jpg"
          />
          <ResearchSection
            title="Extramural Research Project"
            content="Our extramural research projects involve collaborating with external academic institutions, research organizations, and industry partners..."
            imagePath="/Extramural Research Project.jpg"
          />
        </div>

        {/* Available Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Research Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="text-primary mb-4">
                  <Microscope className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.overview}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {service._count.process} research steps
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

function ResearchSection({ 
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