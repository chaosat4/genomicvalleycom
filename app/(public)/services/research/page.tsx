'use client';

import { Card } from "@/components/ui/card";
import { Microscope, Brain, Database, Network, Activity, Dna, Beaker, Settings } from "lucide-react";
import Image from "next/image";
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_RESEARCH_SERVICES = gql`
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
    default:
      return <Settings className="h-6 w-6" />;
  }
};

export default function ResearchServicesPage() {
  const router = useRouter();
  const { loading, error, data } = useQuery<ServicesData>(GET_RESEARCH_SERVICES);

  const handleServiceClick = (documentId: string) => {
    router.push(`/services/research/${documentId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading research services...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">Error loading research services</p>
        <p className="text-gray-600 text-sm mt-2">{error.message}</p>
      </div>
    </div>
  );

  // Filter research services and sort by order
  const researchServices = data?.services
    .filter((service: GraphQLService) => service.categoryName === 'research')
    .sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-purple-50 pt-44 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Research Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our research services at Genomic Valley Bharat focus on pioneering advancements in oncology through the application of Next-Generation Sequencing (NGS) and artificial intelligence.
          </p>
        </div>

        {/* Hero Image */}
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
            title="Next Generation Sequencing"
            content="Our next-generation sequencing research utilizes advanced sequencing technologies to analyze genetic variations, gene expression patterns, and genomic architectures."
            imagePath="/sequencing.jpg"
          />
          <ResearchSection
            title="Metagenomics"
            content="Our metagenomics research focuses on studying the collective genomes of microbial communities within the human body..."
            imagePath="/Metagenomics and Healthcare.jpg"
          />
          <ResearchSection
            title="Bioinformatics and Genome Healthcare"
            content="Genomic Valley Bharat pioneers bioinformatics and genome healthcare research, transforming genetic data analysis to advance personalized medicine and healthcare outcomes."
            imagePath="/AI-Based Genome Healthcare.jpg"
          />
          <ResearchSection
            title="Extramural Research Project"
            content="Our extramural research projects involve collaborating with external academic institutions, research organizations, and industry partners..."
            imagePath="/Extramural Research Project.jpg"
          />
        </div>

        {/* Available Research Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Research Opportunities
          </h2>
          {researchServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchServices.map((service) => (
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
                      Research Service
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No research services available at the moment.</p>
            </div>
          )}
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