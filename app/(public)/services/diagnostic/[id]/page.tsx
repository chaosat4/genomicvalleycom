import { notFound } from 'next/navigation'
import Link from 'next/link';
import { gql } from '@apollo/client';
import client from '@/lib/apollo';

interface ServiceDetail {
  details: {
    detailsItem: string;
  }[];
}

interface Service {
  number: string;
  title: string;
  details: {
    detailsItem: string;
  }[];
}

interface MainContent {
  leftBox: {
    title: string;
    description: string;
  };
  contentTitle: string;
  contentDescription: string;
  servicesHeading: string;
  servicesList: Service[];
  benefitsHeading: string;
  benefits: {
    benefitsItem: string;
  }[];
}

interface ServiceData {
  documentId: string;
  categoryName: string;
  mainContent: MainContent;
}

const GET_SERVICE = gql`
  query GetService($documentId: ID!) {
    service(documentId: $documentId) {
      documentId
      categoryName
      mainContent {
        contentTitle
        contentDescription
        servicesHeading
        servicesList {
          number
          title
          details {
            detailsItem
          }
        }
        leftBox {
          title
          description
        }
        benefitsHeading
        benefits {
          benefitsItem
        }
      }
    }
  }
`;

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data } = await client.query({
    query: GET_SERVICE,
    variables: { documentId: id }
  });

  const service = data.service;

  if (!service || service.categoryName !== 'diagnostic') {
    notFound()
  }

  const { mainContent } = service

  return (
    <div className="bg-purple-50 min-h-screen pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Box */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border-2 border-purple-500 p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-3">
                {mainContent.leftBox.title}
              </h3>
              <p className="text-gray-700 text-center">
                {mainContent.leftBox.description}
              </p>
            </div>

            <div className="flex justify-center">
              <Link href={`/request-quotation/${id}`}>
                <button className="bg-purple-600 text-white my-4 px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                  Request For Quote
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">
              {mainContent.contentTitle}
            </h2>
            
            <p className="text-gray-800 text-xl mb-4 text-justify">
              {mainContent.contentDescription}
            </p>

            <h4 className="text-2xl font-semibold text-purple-600 mt-6 mb-4">
              {mainContent.servicesHeading}
            </h4>

            <div className="space-y-6">
              {mainContent.servicesList.map((service: Service) => (
                <div key={service.number}>
                  <h5 className="text-xl font-semibold flex items-center">
                    <span className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                      {service.number}
                    </span>
                    {service.title}
                  </h5>
                  <div className="ml-9 text-gray-700">
                    {service.details.map((detail: { detailsItem: string }, i: number) => (
                      <p key={i} className="flex text-lg items-start text-justify">
                        <span className="text-purple-600 mr-2">→</span>
                        {detail.detailsItem}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-purple-600 mb-4">
                {mainContent.benefitsHeading}
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {mainContent.benefits.map((benefit: { benefitsItem: string }, i: number) => (
                  <li key={i} className="text-justify">{benefit.benefitsItem}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
