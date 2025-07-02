'use client';

import { Card } from "@/components/ui/card";
import { Activity, Heart, Shield, Users, Microscope, Brain, Database, Network, Dna, Beaker, Settings } from "lucide-react";
import Image from "next/image";
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_DIAGNOSTIC_SERVICES = gql`
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

const getIconForService = (title: string) => {
  switch (title.toLowerCase()) {
    case 'gene expression analysis':
      return <Dna className="h-6 w-6" />;
    case 'genome assembly':
      return <Network className="h-6 w-6" />;
    case 'variant detection':
      return <Activity className="h-6 w-6" />;
    case 'metagenomics':
      return <Beaker className="h-6 w-6" />;
    case 'epigenetics':
      return <Microscope className="h-6 w-6" />;
    case 'next generation sequencing':
      return <Database className="h-6 w-6" />;
    case 'bioinformatics':
      return <Brain className="h-6 w-6" />;
    case 'personalized healthcare':
    case 'personalized medicine':
      return <Heart className="h-6 w-6" />;
    case 'genetic disease':
    case 'disease predisposition':
      return <Shield className="h-6 w-6" />;
    case 'community health':
      return <Users className="h-6 w-6" />;
    default:
      return <Settings className="h-6 w-6" />;
  }
};

export default function DiagnosticServicesPage() {
  const router = useRouter();
  const { loading, error, data } = useQuery<ServicesData>(GET_DIAGNOSTIC_SERVICES);

  const handleServiceClick = (documentId: string) => {
    router.push(`/services/diagnostic/${documentId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading diagnostic services...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">Error loading diagnostic services</p>
        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
      </div>
    </div>
  );

  // Filter diagnostic services and sort by order
  const diagnosticServices = data?.services
    .filter((service: GraphQLService) => service.categoryName === 'diagnostic')
    .sort((a, b) => a.order - b.order) || [];

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

        {/* Hero Image */}
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

        {/* Available Diagnostic Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Services
          </h2>
          {diagnosticServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagnosticServices.map((service) => (
                <Card 
                  key={service.documentId} 
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white h-full flex flex-col"
                  onClick={() => handleServiceClick(service.documentId)}
                >
                  <div className="text-primary mb-4">
                    {getIconForService(service.mainContent.leftBox.title)}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {service.mainContent.leftBox.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-grow mb-4">
                    {service.mainContent.leftBox.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-sm font-medium text-primary">Learn More</span>
                    <div className="text-sm text-gray-500">
                      Diagnostic Service
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No diagnostic services available at the moment.</p>
            </div>
          )}
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