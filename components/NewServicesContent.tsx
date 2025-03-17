import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Activity, Microscope, Dna, Beaker, Network, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';



export interface ServiceItem {
  title: string;
  description: string;
  category: 'Research Services' | 'Diagnostics Services';
  link?: string;
}

const researchServices: ServiceItem[] = [
  {
    title: 'Gene Expression Analysis',
    description: 'Understand gene expression patterns with our cutting-edge analysis services',
    category: 'Research Services',
    link: '/services/research/gene-expression-analysis'
  },
  {
    title: 'Genome Assembly',
    description: 'Get accurate and comprehensive genome assembly with our expert services',
    category: 'Research Services',
    link: '/services/research/genome-assembly'
  },
  {
    title: 'Variant Detection',
    description: 'Identify genetic variants with our advanced detection services',
    category: 'Research Services',
    link: '/services/research/variant-detection'
  },
  {
    title: 'Metagenomics',
    description: 'Explore microbial communities with our metagenomics services',
    category: 'Research Services',
    link: '/services/research/metagenomics'
  },
  {
    title: 'Epigenetics',
    description: 'Explore the epigenetic landscape with our comprehensive services',
    category: 'Research Services',
    link: '/services/research/epigenetics'
  },
  {
    title: 'Customised as per need',
    description: 'Explore the depth of customized NGS services as per your need',
    category: 'Research Services',
    link: '/services/research/custom'
  }
];

const diagnosticsServices: ServiceItem[] = [
  {
    title: 'Cancer Genomics',
    description: 'Unlock the genetic secrets of cancer with our comprehensive genomics services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/cancer-genomics'
  },
  {
    title: 'Rare Genetic Disorders',
    description: 'Diagnose and manage rare genetic disorders with our expert services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/rare-genetic-disorders'
  },
  {
    title: 'Infectious Disease Diagnosis',
    description: 'Rapidly diagnose infectious diseases with our cutting-edge services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/infectious-disease-diagnosis'
  },
  {
    title: 'Prenatal and Preimplantation Genetic Testing',
    description: 'Make informed reproductive choices with our genetic testing services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/prenatal-and-preimplantation-genetic-testing'
  },
  {
    title: 'Metagenomics',
    description: 'Diagnose microbial infections and understand the microbiome with our metagenomics services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/metagenomics'
  },
  {
    title: 'Transplantation Genetics',
    description: 'Optimize transplant outcomes with our comprehensive genetic testing services',
    category: 'Diagnostics Services',
    link: '/services/diagnostic/transplantation-genetics'
  }
]; 

interface ServiceCardProps {
  service: ServiceItem;
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
    <a href={service.link} className="block">
      <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white h-full flex flex-col"
    >
      <div className="text-primary mb-4">
        {getIconForService(service.title)}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">
        {service.title}
      </h3>
      <p className="text-gray-600 text-sm flex-grow">
        {service.description}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
        <span className="text-sm font-medium text-primary">Learn More</span>
      </div>
    </Card>
    </a>
  );
} 

export function ServicesContent() {
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
            {researchServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
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
            {diagnosticsServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 