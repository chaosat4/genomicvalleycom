import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Activity, Microscope, Dna, Beaker, Network, Settings } from 'lucide-react';
import { gql, useQuery } from '@apollo/client';
import React from 'react';

const GET_SERVICES = gql`
  query {
    services(pagination: { limit: 100 }) {
      documentId
      categoryName
      mainContent {
        contentTitle
        leftBox {
          title
          description
        }
      }
      order
    }
  }
`;

interface GraphQLService {
  documentId: string;
  categoryName: string;
  mainContent: {
    contentTitle: string;
    leftBox: {
      title: string;
      description: string;
    }
  }
  order: number;
}

interface ServicesData {
  services: GraphQLService[];
}

interface ServiceCardProps {
  service: GraphQLService;
}

const getIconForService = (title: string) => {
  switch (title) {
    case 'Gene Expression Analysis':
      return <Dna className="h-6 w-6" />;
    case 'Genome Assembly':
      return <Network className="h-6 w-6" />;
    case 'Variant Detection':
      return <Activity className="h-6 w-6" />;
    case 'Metagenomics':
      return <Beaker className="h-6 w-6" />;
    case 'Epigenetics':
      return <Microscope className="h-6 w-6" />;
    default:
      return <Settings className="h-6 w-6" />;
  }
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <a href={`/services/${service.categoryName}/${service.documentId}`} className="block">
      <Card 
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white h-full flex flex-col"
      >
        <div className="text-primary mb-4">
          {getIconForService(service.mainContent.leftBox.title)}
        </div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900">
          {service.mainContent.leftBox.title}
        </h3>
        <p className="text-gray-600 text-sm flex-grow">
          {service.mainContent.leftBox.description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
          <span className="text-sm font-medium text-primary">Learn More</span>
        </div>
      </Card>
    </a>
  );
} 

export function ServicesContent() {
  const { loading, error, data } = useQuery<ServicesData>(GET_SERVICES);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services</div>;

  // Filter services by category and sort by order
  const researchServices = data?.services
    .filter((service: GraphQLService) => service.categoryName === 'research')
    .sort((a, b) => a.order - b.order) || [];
  const diagnosticServices = data?.services
    .filter((service: GraphQLService) => service.categoryName === 'diagnostic')
    .sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of genomic services designed to advance research and improve healthcare outcomes
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <Image
            src="/services.jpg"
            alt="Genomic Services"
            fill
            className="object-cover"
          />
        </div>

        {/* Research Services Section */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Research Services
            </h2>
            <p className="text-gray-600 mb-8">
              Our cutting-edge research services empower scientists and researchers with advanced genomic tools and expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchServices.map((service) => (
              <ServiceCard key={service.documentId} service={service} />
            ))}
          </div>
        </div>

        {/* Diagnostics Services Section */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Diagnostics Services
            </h2>
            <p className="text-gray-600 mb-8">
              Our diagnostic services harness the power of Next-Generation Sequencing (NGS) to deliver unparalleled precision in genetic testing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnosticServices.map((service) => (
              <ServiceCard key={service.documentId} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 